var should = require('should');
var Promise = require('bluebird');
var fixtures = require('./fixtures')();
var $http = require('http-as-promised');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

describe("Unit test ElasticHarvester for bulk inserts", function () {
  before(function () {
      config = this.config;
      harvester = this.harvesterApp;
      elastic = this.peopleSearch;
  });

  it('should be able to handle bulk inserts', function (done) {
    return Promise.resolve( elastic.expandBulkAndSync([{
      "id" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "Dilbert Test",
      "appearances" : "34574",
      "dateOfBirth" : "1984-07-10T12:18:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    },{
      "id" : "b76826d0-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "Wally Dilbert Brother",
      "appearances" : "34574",
      "dateOfBirth" : "1985-09-15T12:16:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    }],"b767ffc1-0ab6-11e5-a3f4-470467a3b6a8")
  ).delay(config.esIndexWaitTime)
  .then(function() {
    return $http.get(config.baseUrl + '/people/search?include=pets', { json: true })
  }).spread(function (res, body) {
      var dog = fixtures['pets'][0];
      var personOfInterest;
      expect(res.statusCode).to.equal(200);
      personOfInterest = _.find(body.people, { name: 'Dilbert Test' });
      expect(personOfInterest.links.pets).to.equal(dog.id);
      done();
    });
  });
});
