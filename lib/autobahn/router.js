var
  _           = require('underscore')._,
  url         = require('url'),
  querystring = require('querystring')

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

      function replacePlaceholders(path) {
        return path.replace(/([^\*]):[^\/]+/g, '$1([^\/]+)')
      }
      var regexpString = replacePlaceholders(routeChain.join(""))

      var params = routeChain.join("").match(/:[^\/|\.]+/g)

      if (params) {
        params = _.map(params, function(key) {
          return key.replace(/:/, "")
        })
      }

      var ancestors = _.reduce(routeChain, function(memo, segment){
        if (_.last(memo)) {
          memo.push(replacePlaceholders([_.last(memo),segment].join("")))
        } else {
          memo.push(replacePlaceholders(segment))
        }
        return memo
      }, []);
      ancestors.unshift("/")

      if (Routes[regexpString]) {
        Routes[regexpString]["actions"][method] = func
        Routes[regexpString]["actions"]['ancestors'] = ancestors
      } else {
        var actions = {}
        actions[method] = func
        Routes[regexpString] = {
          actions: actions,
          params: params,
          ancestors: ancestors
        }
      }

      return routeChain
    }

    function mapRoutes (chain) {
      return {
        before: function(callback) {
          return mapRoutes(generateRoute("before", chain, arguments))
        },
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
      before: function(callback) {
        return mapRoutes(generateRoute("before", [], arguments))
      },
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

      _.extend(params, querystring.parse(url.parse(req.url).query))
      var match = null

      var hit = _.detect(_.keys(Routes), function(route) {
        var re = new RegExp('^' + route + '/?$')
        return match = url.parse(req.url).pathname.match(re)
      })

      function runBeforeFilters(hit) {
        _(Routes[hit].ancestors).each(function(ancestor) {
          var beforeFilter = Routes[ancestor].actions.before;
          if (beforeFilter) beforeFilter(req, res, params);
        })
      }


      if (hit) {
        _.each(_.rest(match), function(val, i) {
          params[Routes[hit].params[i]] = val
        })

        var actions = _.keys(Routes[hit].actions)

        runBeforeFilters(hit)

        if (_.include(_.keys(Routes[hit].actions), req.method.toLowerCase())) {
          // Our method is permitted on this route. Add the paramenters to the returned response function
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
