const should = require("should");
const request = require("request");
const expect = require("chai").expect;
// const baseUrl = "http://localhost:8080/";
const baseUrl = "https://atelierogre-staging.herokuapp.com/";
const util = require("util");
const id = 1;
const maxChildren = 10;
const distancePerYear = 200000;

/*********************** tests player ***********************************/

describe('players tests', function() {
    it('should return status', function(done) {
        request.get({ url: baseUrl + 'players/' + id },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
	it('should assert id number', function(done) {
        request.get({ url: baseUrl + 'players/' + id },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
            		expect(bodyObj.data.id).to.equal(id);
					expect(bodyObj.data.id).to.be.a('number');
                done();
            });
    });
	it('should assert max children number', function(done) {
        request.get({ url: baseUrl + 'players/' + id },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
            		expect(bodyObj.data.id).to.below(maxChildren);
                done();
            });
    });
	it('should assert distance per year', function(done) {
        request.get({ url: baseUrl + 'players/' + id },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
            		expect(bodyObj.data.id).to.below(distancePerYear);
                done();
            });
    });
});

/*********************** tests car consumptions *************************/

describe('car consumptions tests', function() {
    it('should return status', function(done) {
        request.get({ url: baseUrl + 'carconsumptions/' + id },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
});

/*********************** tests plane consumptions ***********************/

describe('plane consumptions tests', function() {
    it('should return status', function(done) {
        request.get({ url: baseUrl + 'planeconsumptions/' + id },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
});

/*********************** tests wind turbine consumptions ****************/

describe('wind turbine consumptions tests', function() {
    it('should return status', function(done) {
        request.get({ url: baseUrl + 'planeconsumptions/' + id },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
});
