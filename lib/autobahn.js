module.exports = autobahn = function(callback) {

  require('underscore')

  var self = this

  self.router = require("./autobahn/router")

  self.static = require("./autobahn/static")

  callback(self.router)

  self.cached_routes = true

  return function(options) {

    var path = require("path"), http = require('http')
    
    var default_options = {
      port: 4000, 
      host: "127.0.0.1"
    }

    _.extend(default_options, options)

    http.createServer(function (req, res) {

      var filename = path.normalize(path.join(
        path.join(
          path.dirname(process.mainModule.filename), "public"
        ), req.url
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
