_ = require('underscore')._
module.exports = autobahn = function(callback) {


  var self = this

  self.router = require("./autobahn/router")(callback)

  self.static = require("./autobahn/static")

  self.cached_routes = true

  var path = require("path"), http = require('http'), url = require('url')

  var server = http.createServer(function (req, res) {

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

  })

  return server
}

autobahn.not_found = function(req, res) {
  res.writeHead(404, []); res.end()
}

autobahn.forbidden = function(req, res) {
  res.writeHead(403, []); res.end()
}

autobahn.render = require("./autobahn/render")
