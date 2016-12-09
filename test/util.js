var Promise = require('bluebird');
var should = require('should');
var _ = require('lodash');
var request = require('supertest');
var $http = require('http-as-promised');
var config = require('./config');

/* addLink: easily associate two documents.
 params:
 -type: type of the resource you're targeting. Should be pluralized. e.g. "pets"
 -linkObj: value of the "links" parameter being sent. e.g. "{friends: "o1sas3213ddafgsd123"}".
 -baseUrl: baseUrl of the api being hit, e.g. "http://localhost:8081"
 -url: the rest of the url of the targeted resource, e.g. "/pets/12387921213"
 returns: a promise with the result of the query
 */
function addLink(type, linkObj, baseUrl, url) {
    return new Promise(function (resolve) {
        var payload = {};

        payload[type] = [
            {
                links: linkObj
            }
        ];

        request(baseUrl)
            .put(url)
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (error, response) {
                should.not.exist(error);
                var body = JSON.parse(response.text);
                _.each(Object.keys(linkObj), function (key, value, list) {
                    (body[type][0].links[key]).should.match(linkObj[key]);
                });
                resolve(body);
            });
    })

}




// Deletes all docs from index type. Uses bulk API to delete and gets doc Ids by first doing a get.
function deleteAllEsDocsFromIndex(index, type) {
    var getDocsListOptions = {
        url: config.harvester.options.es_url + '/' + index + '/' + type +'/_search',
        json: true,
        errors: false
    }

    return new Promise(function (resolve) {
        return $http.get(getDocsListOptions)
            .spread(function (res, json) {
                var bulkDeleteOptions = {
                    url: config.harvester.options.es_url + '/_bulk',
                    json: true,
                    form: '',
                    error: false
                };
                if (json.hits.total === 0) return resolve();
                _.forEach(json.hits.hits, function (doc) {
                    var bulkCommand = { delete: { _index: index, _type: type, _id: doc._id, _routing: doc._routing } }
                    bulkDeleteOptions.form += JSON.stringify(bulkCommand) + '\n';
                });

                return $http.post(bulkDeleteOptions);
            })
            .spread(function (res, json) {
                console.log('deleted all docs from', index, type);
                return resolve();
            });
    });
}

module.exports = {
    addLink: addLink,
    deleteAllEsDocsFromIndex: deleteAllEsDocsFromIndex,
};
