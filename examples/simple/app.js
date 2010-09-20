var http  = require('http');

autobahn  = require('./../../lib/autobahn')

http.createServer(function (request, response) {

  autobahn(function(r) {

    r.add(/^\/$/, function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Welome!\n');
    })

    r.add(/\/contact$/, function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Get in touch!\n');
    })

    r.add(/\/infos$/, function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Get some infos!\n');
    })

    r.add(/\/awaken$/, function(req, res) {
      setTimeout(function() {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Awoken after 1 second\n');
      }, 1000)
    })
  })(request, response)

  // Hmm. autobahn should probably be called on another object
  autobahn.add(1,2)

}).listen(4000, "127.0.0.1");

console.log('Server running at http://127.0.0.1:4000/');