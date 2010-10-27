module.exports = autobahn = function(callback) {

  require('underscore')

  var self = this

  self.router = require("./autobahn/router")(callback)

  self.static = require("./autobahn/static")

  //self.router(callback)

  self.cached_routes = true

  return function(options) {

    var path = require("path"), http = require('http'), url = require('url')
    
    var default_options = {
      port: 4000, 
      host: "127.0.0.1"
    }

    _.extend(default_options, options)

    http.createServer(function (req, res) {

      var filename = path.normalize(path.join(
        path.join(
          path.dirname(process.mainModule.filename), "public"
        ), url.parse(req.url).pathname
      ))
      if (path.extname(filename) == "") return self.router.route(req, res)

      path.exists(filename, function (exists) {

        if (exists) {
          self.static(req, res, filename)
        } else {
          self.router.route(req, res)
        }

      })

    }).listen(default_options.port, default_options.host);
  }
}

autobahn.not_found = function(req, res) {
  res.writeHead(404, []); res.end()
}

autobahn.render = require("./autobahn/render")