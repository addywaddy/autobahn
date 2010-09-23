var http  = require('http');

autobahn  = require('./../../lib/autobahn')

http.createServer(function (request, response) {

  autobahn(function(r) {

    r.add(/^\/$/, function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end("" +

        "<h1>Congratulations - you're on the Autobahn!</h1>" +
        "<p>" +
        "  Here are some links:" +
        "</p>" +
        "<ul>" +
        "  <li><a href='/simple'>Simple route</a></li>" +
        "  <li><a href='/awaken'>The obligatory delayed page</a></li>" +
        "  <li><a href='/autobahn.html'>A static page</a></li>" +
        "  <li><a href='/pics/me.jpg'>An image</a></li>" +
        "</ul>" +

      "");
    })

    r.add(/\/simple$/, function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Simple Page\n');
    })

    r.add(/\/awaken$/, function(req, res) {
      setTimeout(function() {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Awoken after 1 second\n');
      }, 1000)
    })

    r.add(/\/chunky$/,
      function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
      },
      function(req, res) {
        res.write('Chunky\n');
      },
      function(req, res) {
        setTimeout(function() {
          res.end('Bacon\n');
        }, 1000)
      }
    )

  })(request, response)

}).listen(4000, "127.0.0.1");

console.log('Server running at http://127.0.0.1:4000/');