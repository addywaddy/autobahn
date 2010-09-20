module.exports = autobahn = function(callback) {

  require("underscore")

  var path = require("path")
  var sys  = require("sys")

  autobahn.add = function(match, func) {
    if (!autobahn.cached_routes) {
      autobahn.routes.push([match, func])
    }
  }

  callback(autobahn)

  autobahn.cached_routes = true

  return function(req, res) {

    var filename = path.normalize(path.join(
      path.join(
        path.dirname(process.mainModule.filename), "public"
      ), req.url
    ))

    if (path.extname(filename) == "") return autobahn.route(req, res)

    path.exists(filename, function (exists) {

      if (exists) {
        autobahn.static(req, res, filename)
      } else {
        autobahn.route(req, res)
      }

    })
  }

}

autobahn.static = require("./autobahn/static")

autobahn.route = require("./autobahn/route")

autobahn.cached_routes = false

autobahn.routes = []

autobahn.not_found = function(req, res) {
  res.writeHead(404, []); res.end()
}
