module.exports = router = {

  routes: [],

  cached_routes: false,

  add: function() {
    if (!this.cached_routes) {
      this.routes.push([_.first(arguments), _.rest(arguments)])
    }
  },

  route: function(request, response) {

    require('underscore')

    var self = this

    function actions(hit, method) {
      return _(self.routes).chain()
        .detect(function(el) { if (el[0] == hit) return el })
        .last()
        .value()
    }

    var hit = _(self.routes).chain()
      .map(function(ary) { return ary[0] })
      .detect(function(regexp) { return request.url.match(regexp)})
      .value()

    if (hit) {
      _(actions(hit, request.method)).each(function(action) { action(request, response, request.url.match(hit)) })
    } else {
      autobahn.not_found(request, response)
    }
  }
}

