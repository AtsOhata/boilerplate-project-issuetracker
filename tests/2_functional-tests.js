const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
	this.timeout(5000);
	suite('tests', function () {
		created_id = "";
		// #1
		test('Test case 001: POST all inputs', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/issues/mochatest')
				.send({
					"issue_title": "mocha_title001",
					"issue_text": "mocha_text001",
					"created_by": "mocha_created_by001",
					"assigned_to": "mocha_assigned_to001",
					"status_text": "mocha_status_text001",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.assigned_to, "mocha_assigned_to001");
					assert.equal(res.body.status_text, "mocha_status_text001");
					assert.equal(res.body.open, true);
					assert.equal(res.body.issue_title, "mocha_title001");
					assert.equal(res.body.issue_text, "mocha_text001");
					assert.equal(res.body.created_by, "mocha_created_by001");
					created_id = res.body._id;
					done();
				});
		});
		// #2
		test('Test case 002: POST only required inputs', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/issues/mochatest')
				.send({
					"issue_title": "mocha_title002",
					"issue_text": "mocha_text002",
					"created_by": "mocha_created_by002",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.assigned_to, "");
					assert.equal(res.body.status_text, "");
					assert.equal(res.body.open, true);
					assert.equal(res.body.issue_title, "mocha_title002");
					assert.equal(res.body.issue_text, "mocha_text002");
					assert.equal(res.body.created_by, "mocha_created_by002");
					done();
				});
		});
		// #3
		test('Test case 003: POST with missing required inputs', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/issues/mochatest')
				.send({
					"issue_title": "mocha_title003",
					"created_by": "mocha_created_by003",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.error, "required field(s) missing");
					done();
				});
		});
		// #4
		test('Test case 004: GET', function (done) {
			chai
				.request(server)
				.keepOpen()
				.get('/api/issues/mochatest')
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.isArray(res.body);
					done();
				});
		});
		// #5
		test('Test case 005: GET with a field', function (done) {
			chai
				.request(server)
				.keepOpen()
				.get('/api/issues/mochatest?issue_title=mocha_title001')
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body[0].project, "mochatest");
					assert.equal(res.body[0].issue_title, "mocha_title001");
					assert.equal(res.body[0].issue_text, "mocha_text001");
					assert.equal(res.body[0].created_by, "mocha_created_by001");
					assert.equal(res.body[0].assigned_to, "mocha_assigned_to001");
					assert.equal(res.body[0].open, true);
					assert.equal(res.body[0].status_text, "mocha_status_text001");
					done();
				});
		});
		// #6
		test('Test case 006: GET with multiple fields', function (done) {
			chai
				.request(server)
				.keepOpen()
				.get('/api/issues/mochatest?issue_title=mocha_title001&issue_text=mocha_text001')
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body[0].project, "mochatest");
					assert.equal(res.body[0].issue_title, "mocha_title001");
					assert.equal(res.body[0].issue_text, "mocha_text001");
					assert.equal(res.body[0].created_by, "mocha_created_by001");
					assert.equal(res.body[0].assigned_to, "mocha_assigned_to001");
					assert.equal(res.body[0].open, true);
					assert.equal(res.body[0].status_text, "mocha_status_text001");
					done();
				});
		});
		// #7
		test('Test case 007: PUT Update a field', function (done) {
			chai
				.request(server)
				.keepOpen()
				.put('/api/issues/mochatest')
				.send({
					"_id": "666900c251ddc63c280ee8db",
					"issue_title": "mocha_title007",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.result, "successfully updated");
					assert.equal(res.body._id, "666900c251ddc63c280ee8db");
					done();
				});
		});
		// #8
		test('Test case 008: PUT Update some fields', function (done) {
			chai
				.request(server)
				.keepOpen()
				.put('/api/issues/mochatest')
				.send({
					"_id": "666900c251ddc63c280ee8db",
					"issue_title": "mocha_title008",
					"issue_text": "mocha_text008",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.result, "successfully updated");
					assert.equal(res.body._id, "666900c251ddc63c280ee8db");
					done();
				});
		});
		// #9
		test('Test case 009: PUT Without _id', function (done) {
			chai
				.request(server)
				.keepOpen()
				.put('/api/issues/mochatest')
				.send({
					"issue_title": "mocha_title008",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.error, "missing _id");
					done();
				});
		});
		// #10
		test('Test case 010: PUT With no fields', function (done) {
			chai
				.request(server)
				.keepOpen()
				.put('/api/issues/mochatest')
				.send({
					"_id": "666900c251ddc63c280ee8db",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.error, "no update field(s) sent");
					assert.equal(res.body._id, "666900c251ddc63c280ee8db");
					done();
				});
		});
		// #11
		test('Test case 011: PUT Invalid _id', function (done) {
			chai
				.request(server)
				.keepOpen()
				.put('/api/issues/mochatest')
				.send({
					"_id": "999999c251ddc63c280ee8db",
					"issue_title": "44444",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.error, "could not update");
					assert.equal(res.body._id, "999999c251ddc63c280ee8db");
					done();
				});
		});
		// #12
		test('Test case 012: DELETE One record', function (done) {
			chai
				.request(server)
				.keepOpen()
				.delete('/api/issues/mochatest')
				.send({
					"_id": created_id,
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.result, "successfully deleted");
					assert.equal(res.body._id, created_id);
					done();
				});
		});
		// #13
		test('Test case 013: DELETE Invalid _id', function (done) {
			chai
				.request(server)
				.keepOpen()
				.delete('/api/issues/mochatest')
				.send({
					"_id": created_id,
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.error, "could not delete");
					assert.equal(res.body._id, created_id);
					done();
				});
		});
		// #14
		test('Test case 014: DELETE Missing id', function (done) {
			chai
				.request(server)
				.keepOpen()
				.delete('/api/issues/mochatest')
				.send({
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, "application/json");
					assert.equal(res.body.error, "missing _id");
					done();
				});
		});
	});
});
