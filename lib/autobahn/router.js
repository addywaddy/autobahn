module.exports = router = function (callback) {

  var Routes = {}

  function drawRoutes () {

    function generateRoute (method, routeChain, args) {
      var route = null

      if (typeof(_.first(args)) != "function") {
        var route = _.first(args)
        routeChain.push(route)
      }

      var func = _.last(args)
      var regexpString = routeChain.join("").replace(/([^\*]):[^/]+/g, '$1([^/]+)')

      var params = routeChain.join("").match(/:[^/]+/g)

      if (params) {
        params = _.map(params, function(key) {
          return key.replace(/:/, "")
        })
      }

      if (Routes[regexpString]) {
        Routes[regexpString]["actions"][method] = func
      } else {
        var actions = {}
        actions[method] = func
        Routes[regexpString] = {
          actions: actions,
          params: params
        }
      }

      return routeChain
    }

    function mapRoutes (chain) {
      return {
        get: function() {
          return mapRoutes(generateRoute("get", chain, arguments))
        },
        post: function() {
          return mapRoutes(generateRoute("post", chain, arguments))
        },
        put: function() {
          return mapRoutes(generateRoute("put", chain, arguments))
        },
        del: function() {
          return mapRoutes(generateRoute("delete", chain, arguments))
        }
      }
    }

    return {
      get: function() {
        return mapRoutes(generateRoute("get", [], arguments))
      },
      post: function() {
        return mapRoutes(generateRoute("post", [], arguments))
      },
      put: function() {
        return mapRoutes(generateRoute("put", [], arguments))
      },
      del: function() {
        return mapRoutes(generateRoute("delete", [], arguments))
      }
    }
  }

  callback.call(drawRoutes())

  return {
    routes: Routes,
    route: function(req, res) {

      var params = {}

      match = null

      var hit = _.detect(_.keys(Routes), function(route) {
        var re = new RegExp('^' + route + '/?$')
        return match = req.url.match(re)
      })

      if (hit) {
        if (_.include(_.keys(Routes[hit].actions), req.method.toLowerCase())) {
          // Our method is permitted on this route. Add the paramenters to the returned response function
          _.each(_.rest(match), function(val, i) {
            params[Routes[hit].params[i]] = val
          })
          return Routes[hit].actions[req.method.toLowerCase()](req, res, params)
        } else {
          return autobahn.forbidden(req, res)
        }
      } else {
        return autobahn.not_found(req, res)
      }
    }
  }
}
