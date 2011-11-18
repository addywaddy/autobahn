require('../test-helper');

var Router = require("autobahn/router")(function() {
  
  this.get("/foos", function() {
    return "All the foos"
  })
    .get("/:foo_id", function(req, resp, params) {
      return "Foo No.  " + params.foo_id
    })
      .get("/bars", function(req, resp, params) {
        return "All the bars for Foo No. " + params.foo_id
      })
      .post(function(req, resp, params) {
        return "New bar created for Foo No. " + params.foo_id
      })
        .get("/:bar_id", function(req, res, params) {
          return "Bar No. " + params.bar_id + " belonging to Foo No. " + params.foo_id
        })
        .put(function(req, resp, params) {
          return "Bar No. " + params.bar_id + " belonging to Foo No. " + params.foo_id + " modified"
        })

  this.get("/fuzz", function() {
    return "Call the police"
  })
})

autobahn = {}

autobahn.not_found = function(req, res) {
  return "NOT FOUND"
}

autobahn.forbidden = function(req, res) {
  return "FORBIDDEN"
}

test("Should match top level routes", function() {
  assert.equal(Router.route({url: "/foos", method: "GET"}), "All the foos")
  assert.equal(Router.route({url: "/fuzz", method: "GET"}), "Call the police")
});

test("Should work with trailing slashes", function() {
  assert.equal(Router.route({url: "/foos/", method: "GET"}), "All the foos")
});

test("Should work with query params", function() {
  assert.equal(Router.route({url: "/foos/1?bar=200&buzz=12", method: "GET"}), "Foo No.  1, Bar is 200")
});

test("Should return params object for routes", function() {
  assert.equal(Router.route({url: "/foos/1/bars/2", method: "PUT"}), "Bar No. 2 belonging to Foo No. 1 modified")
});

test("Should chain routes", function() {
  assert.equal(Router.route({url: "/foos/1/bars/", method: "POST"}), "New bar created for Foo No. 1")
});
test("Should return 404 if no match", function() {
  assert.equal(Router.route({url: "/fuzz/1/bars/2", method: "GET"}), "NOT FOUND")
});

test("Should return 406 if not permitted", function() {
  assert.equal(Router.route({url: "/foos/1/bars/2", method: "POST"}), "FORBIDDEN")
});
