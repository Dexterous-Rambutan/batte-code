var assert = require('chai').assert;
var request = require('request');

var solutionController = require('../server/solutions/solutionController.js');
var userController = require('../server/users/userController.js');
var challengeController = require('../server/challenges/challengeController.js');

describe('solutionControllerTest', function () {
  before(function (done) {
    request('http://127.0.0.1:3000/api/resetDBWithData', function () {
      done();
    });
  });

  describe('getSolutionById', function () {
    it('should be a function', function () {
      assert.isFunction(solutionController.getSolutionById);
    });
    it('should get a solution by solutionID', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/solutions/1',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(body.content, 'solved!');
        assert.equal(body.user_id, 3);
        assert.equal(body.challenge_id, 1);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
    it('should return 404/null if user does not exist', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/solutions/10',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(response.statusCode, 404);
        assert.equal(body, null)
        done();
      });
    });
  });
  describe('getAllSolutionsForUser', function () {
    it('should be a function', function () {
      assert.isFunction(solutionController.getAllSolutionsForUser);
    });
    it('should get all solutions for a user', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/solutions/user/kweng2',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(body.length, 3);
        assert.equal(body[1].challenge_id, 2);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
    it('should return 404/null if user does not exist', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/solutions/user/kweng3',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(response.statusCode, 404);
        assert.equal(body, null);
        done();
      });
    });
  });
});

describe('userController', function () {
  describe('getUserById', function () {
    it('should be a function', function () {
      assert.isFunction(userController.getUserById);
    });
    it('should get a user by github handle', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/users/puzzlehe4d',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(body.github_display_name, 'Harun Davood');
        assert.equal(body.id, 2);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
    it('should return 404/null if user does not exist', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/users/kweng3',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(response.statusCode, 404);
        assert.equal(body, null);
        done();
      });
    });
  });
  describe('addUser', function () {
    it('should be a function', function () {
      assert.isFunction(userController.addUser);
    });
    it('should add a new user', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/users',
        method: 'POST',
        json: {
          github_handle: 'battlecoderbot'
        }
      }, function (err, response, body) {
        assert.equal(body.github_handle, 'battlecoderbot');
        assert.equal(response.statusCode, 201);
        done();
      });
    });
    it('should not add a new user if user exists', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/users',
        method: 'POST',
        json: {
          github_handle: 'kweng2'
        }
      }, function (err, response, body) {
        assert.equal(body.github_handle, 'kweng2');
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });
});

describe('challengeController', function () {
  describe('getChallenge', function () {
    it('should be a function', function () {
      assert.isFunction(challengeController.getChallenge);
    });
    it('should get a random by challengeID', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/challenges',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.isNumber(body.id);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });
  describe('getChallengeById', function () {
    it('should be a function', function () {
      assert.isFunction(challengeController.getChallengeById);
    });
    it('should get a challenge by challengeID', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/challenges/3',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(body.id, 3);
        assert.equal(body.name, "Test function three")
        assert.equal(response.statusCode, 200);
        done();
      });
    });
    it('should return 404/null if challenge does not exist', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/challenges/15',
        method: 'GET',
        json: {}
      }, function (err, response, body) {
        assert.equal(body, null);
        assert.equal(response.statusCode, 404);
        done();
      });
    });
  });
  describe('addChallenge', function () {
    it('should be a function', function () {
      assert.isFunction(challengeController.addChallenge);
    });
    it('should add a new challenge', function (done) {
      request({
        url: 'http://127.0.0.1:3000/api/challenges',
        method: 'POST',
        json: {
          name: 'testing_name',
          prompt: 'testing_prompt',
          test_suite: 'testing_test_suite'
        }
      }, function (err, response, body) {
        assert.equal(response.statusCode, 201);
        assert.equal(body.name, 'testing_name');
        assert.equal(body.prompt, 'testing_prompt');
        assert.equal(body.test_suite, 'testing_test_suite');
        done();
      });
    });
  });

  after(function (done) {
    request('http://127.0.0.1:3000/api/resetDBWithData', function () {
      done();
    });
  });
});
