// const should = require("should");
const request = require("request");
const expect = require("chai").expect;
const baseUrl = "http://localhost:8080/";
// const baseUrl = "https://atelierogre-staging.herokuapp.com/";
const util = require("util");

const maxChildren = 10;
const distancePerYear = 200000;

/*********************** GET Route ***********************************/

describe('GET /players', function() {
    it('should GET all the players', function(done) {
        request.get({ url: baseUrl + 'players/'},
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
	it('should not GET all the players', function(done) {
        request.get({ url: baseUrl + 'wrongUrl' },
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(404);
                done();
            });
    });
	it('should GET the car consumption datas', function(done) {
        request.get({ url: baseUrl + 'carconsumptions/'},
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
	it('should GET the plane consumption datas', function(done) {
        request.get({ url: baseUrl + 'planeconsumptions/'},
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
	it('should GET the wind turbine consumption datas', function(done) {
        request.get({ url: baseUrl + 'windturbineonshoreproductions/'},
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                done();
            });
    });
});

/*********************** GET(by ID) Route ****************************/

describe('GET /players/:id', function() {
    it('should GET one player', function(done) {
		const id = 1;
        request.get({ url: baseUrl + 'players/' + id},
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
					expect(bodyObj.data.id).to.equal(id);
					expect(bodyObj.data.id).to.be.a('number');
					expect(bodyObj.data).to.be.a('object');
                done();
            });
    });
	it('should not GET one player and return an error', function(done) {
		const id = 123;
        request.get({ url: baseUrl + 'players/' + id},
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
					// console.log(response.body);
                    // expect(response.statusCode).to.equal(404);
					expect(response.body).to.have.string('{"status":404,"data":"data not found"}');
                done();
            });
    });
});

/*********************** POST Route **********************************/

/* describe('POST /players', function() {
    it('should POST a new player', function(done) {
		const id = 1;
        request.get({ url: baseUrl + 'players/'},
            function(error, response, body) {
            		const bodyObj = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
					expect(bodyObj.data.id).to.equal(id);
					expect(bodyObj.data.id).to.be.a('number');
					expect(bodyObj.data).to.be.a('object');
                done();
            });
    });
}); */
