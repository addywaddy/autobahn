autobahn  = require('./../../lib/autobahn')

var server = autobahn(function() {
  var foo = "FOO!"

  this.before("/", function(req, res, params) {
      foo += " Bar!"
    console.log(foo)
  });

  this.get("/drawings", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('GET Drawings\n');
  })
  .post(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('POST Drawings\n');
  })
    .get("/:drawing_id", function(req, res, params) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('GET Drawing ' + params.drawing_id + '\n');
    })
    .before(function(req, res, params) {
      console.log("Drawing no: ", params.drawing_id)
      foo += " Buzz!"
      console.log(foo)
    })
    .put(function(req, res, params) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('PUT Drawing ' + params.drawing_id + '\n');
    })
    .del(function(req, res, params) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('DELETE Drawing ' + params.drawing_id + '\n');
    })
      .get("/elements", function(req, res, params) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('GET Drawing ' + params.drawing_id + ' Elements\n');
      })
      .post(function(req, res, params) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('POST Drawing ' + params.drawing_id + ' Elements\n');
      })
        .get("/:element_id", function(req, res, params) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('GET Drawing ' + params.drawing_id + ' Element ' + params.element_id + '\n');
        })
        .put(function(req, res, params) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('PUT Drawing ' + params.drawing_id + ' Element ' + params.element_id + '\n');
        })
        .del(function(req, res, params) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('DELETE Drawing ' + params.drawing_id + ' Element ' + params.element_id + '\n');
        })
        .before(function(req, res, params) {
          console.log("Element no: ", params.element_id)
        })
  this.get("/foo/:bar/:baz", function(req, res, params) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Bar is ' + params.bar + ', Baz is ' + params.baz + '\n');
  })
}).listen(4001)
