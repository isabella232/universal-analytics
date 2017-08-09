var axios = require("axios");
var qs = require("query-string");
var uuid = require("uuid");
var should = require("should");
var sinon = require("sinon");
var url = require("url");

var ua = require("../lib/index.js");
var utils = require("../lib/utils.js")
var config = require("../lib/config.js")


describe("ua", function () {

	describe("#send", function () {
		var post;

		beforeEach(function () {
			post = sinon.stub(axios, "request").returns(Promise.resolve());
		});

		afterEach(function () {
			post.restore()
		});


		it("should immidiately return with an empty queue", function () {
			var visitor1 = ua();
			var fn = sinon.spy();

			return visitor1.send(fn).then(function () {
				post.called.should.equal(false, "no request should have been sent")
				fn.calledOnce.should.equal(true, "callback should have been called once")
				fn.thisValues[0].should.equal(visitor1, "callback should be called in the context of the visitor instance");
				fn.args[0].should.eql([null, 0], "no error, no requests");
			});
		});

		it("should include data in POST body", function () {
			var paramSets = [
				{ first: "123" }
			]
			var visitor2 = ua();

			var fn = sinon.spy(function () {
				fn.calledOnce.should.equal(true, "callback should have been called once")
				fn.thisValues[0].should.equal(visitor2, "callback should be called in the context of the visitor instance");
				fn.args[0].should.eql([null, 1], "no error, 1 requests");

				post.callCount.should.equal(paramSets.length, "each param set should have been POSTed");

				for (var i = 0; i < paramSets.length; i++) {
					var params = paramSets[i];
					var args = post.args[i];
					var parsedUrl = url.parse(args[0].url);

					Math.random(); // I have absolutely no idea why it fails unless there was some processing to be done after url.parse…

					(parsedUrl.protocol + "//" + parsedUrl.host).should.equal(config.hostname);
					args[0].data.should.equal(qs.stringify(params));
				}
			});

			visitor2._queue.push.apply(visitor2._queue, paramSets);
			return visitor2.send(fn);
		});

		it("should send individual requests when batchting is false", function () {
			var paramSets = [
				{ first: Math.random() },
				{ second: Math.random() },
				{ third: Math.random() }
			]

			var fn = sinon.spy(function () {
				fn.calledOnce.should.equal(true, "callback should have been called once")
				fn.thisValues[0].should.equal(visitor, "callback should be called in the context of the visitor instance");

				fn.args[0].should.eql([null, 3], "no error, 3 requests");
			});

			var visitor = ua({ enableBatching: false });
			visitor._queue.push.apply(visitor._queue, paramSets)
			return visitor.send(fn);
		});

		describe("#batching is true", function () {
			it("should send request to collect path when only one payload", function () {
				var visitorBatch0 = ua({ enableBatching: true });
				var paramSets = [
					{ first: Math.random() }
				]

				var fn = sinon.spy(function () {
					fn.args[0].should.eql([null, 1], "no error, 1 requests");
					var args = post.args[0];

					var parsedUrl = url.parse(args[0].url);

					parsedUrl.pathname.should.eql(config.path);
				});

				visitorBatch0._queue.push.apply(visitorBatch0._queue, paramSets)
				return visitorBatch0.send(fn);
			});

			it("should send request to batch path when more than one payload sent", function () {
				var paramSets = [
					{ first: Math.random() },
					{ second: Math.random() },
					{ third: Math.random() }
				]

				var fn = sinon.spy(function () {
					fn.args[0].should.eql([null, 1], "no error, 1 requests");
					var args = post.args[0];
					var parsedUrl = url.parse(args[0].url);

					parsedUrl.pathname.should.eql(config.batchPath);
				});

				var visitorBatch = ua({ enableBatching: true });
				visitorBatch._queue.push.apply(visitorBatch._queue, paramSets)
				return visitorBatch.send(fn);
			});

			it("should batch data in Post form", function () {
				var visitorBatch2 = ua({ enableBatching: true });
				var paramSets = [
					{ first: Math.random() },
					{ second: Math.random() },
					{ third: Math.random() }
				]

				var fn = sinon.spy(function () {
					fn.calledOnce.should.equal(true, "callback should have been called once")
					fn.thisValues[0].should.equal(visitorBatch2, "callback should be called in the context of the visitor instance");

					fn.args[0].should.eql([null, 1], "no error, 1 requests");
					var args = post.args[0];

					var params = paramSets;
					var formParams = args[0].data.split("\n");
					formParams.should.have.lengthOf(3);
					formParams[0].should.equal(qs.stringify(params[0]));
				});


				visitorBatch2._queue.push.apply(visitorBatch2._queue, paramSets)
				return visitorBatch2.send(fn);
			})

			it("should batch data based on batchSize", function () {
				var visitorBatch3 = ua({ enableBatching: true, batchSize: 2 });
				var paramSets = [
					{ first: Math.random() },
					{ second: Math.random() },
					{ third: Math.random() }
				]

				var fn = sinon.spy(function () {
					fn.calledOnce.should.equal(true, "callback should have been called once")
					fn.thisValues[0].should.equal(visitorBatch3, "callback should be called in the context of the visitor instance");

					fn.args[0].should.eql([null, 2], "no error, 2 requests");

					var body = post.args[0][0].data;

					body.split("\n").should.have.lengthOf(2);
				});

				visitorBatch3._queue.push.apply(visitorBatch3._queue, paramSets)
				return visitorBatch3.send(fn);
			});
		});


		it("should add custom headers to request header", function () {
			var visitorHeaders = ua({
				headers: { 'User-Agent': 'Test User Agent' }
			});
			var fn = sinon.spy(function () {
				fn.calledOnce.should.equal(true, "callback should have been called once");
				fn.thisValues[0].should.equal(visitorHeaders, "callback should be called in the context of the visitor instance");

				post.calledOnce.should.equal(true, "request should have been POSTed");

				var parsedUrl = url.parse(post.args[0][0].url);
				var options = post.args[0][0];

				(parsedUrl.protocol + "//" + parsedUrl.host).should.equal(config.hostname);

				options.should.have.keys("headers", "data")
				options.headers.should.have.key("User-Agent");
				options.headers["User-Agent"].should.equal("Test User Agent");
			});
			visitorHeaders._queue.push({});
			return visitorHeaders.send(fn);
		});

	})

});
