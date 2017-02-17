var Promise = require('bluebird');
var chai = require('chai');
var expect = chai.expect;
var should = require('should');

describe("test ElasticHarvester for bulk inserts", function () {
  it('should be able to handle expanded models', function () {
    var elastic = this.peopleSearch;
    return elastic.expandBulkAndSync([{
      "id" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "the Dilbert Test",
      "appearances" : "34574",
      "dateOfBirth" : "1984-07-10T12:18:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    },{
      "id" : "b76826d0-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "the Wally Dilbert Brother",
      "appearances" : "34574",
      "dateOfBirth" : "1985-09-15T12:16:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    }],"people")
    .then(function (response) {
      expect(response).to.have.string('Dogbert');
    })
  });
  it('should be able to fail without routing key', function () {
    var elastic = this.peopleSearch;
    var response = elastic.expandBulkAndSync([{
      "id" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "the Dilbert Test",
      "appearances" : "34574",
      "dateOfBirth" : "1984-07-10T12:18:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    },{
      "id" : "b76826d0-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "the Wally Dilbert Brother",
      "appearances" : "34574",
      "dateOfBirth" : "1985-09-15T12:16:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    }],"");

    should.equal(response, undefined);
  });
  it('should be able to handle fails', function () {
    var elastic = this.peopleSearch;
    return elastic.expandBulkAndSync([{
      "id" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "the Date fail Test",
      "appearances" : 123,
      "dateOfBirth" : "19843-07-10T12:18:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    },{
      "id" : "b76826d0-0ab6-11e5-a3f4-470467a3b6a8",
      "name" : "the Wally Dilbert Brother",
      "appearances" : "34574",
      "dateOfBirth" : "1985-09-15T12:16:51.000-03:00",
      "links" : {
        "pets" : "b767ffc1-0ab6-11e5-a3f4-470467a3b6a8"
      }
    }],"people")
    .then(function (response) {
      console.log('Should not pass through here', response);
      expect(response).to.have.string('Dogbert');
    })
    .catch(err => {
      should.exist(err);
    });
  });
});
