module.exports = route = function(request, response) {
  function actions(hit, method) {
    return _(autobahn.routes).chain()
      .detect(function(el) { if (el[0] == hit) return el })
      .last()
      .value()
  }

  var hit = _(autobahn.routes).chain()
    .map(function(ary) { return ary[0] })
    .detect(function(regexp) { return request.url.match(regexp)})
    .value()

  if (hit) {
    _(actions(hit, request.method)).each(function(action) { action(request, response) })
  } else {
    autobahn.not_found(request, response)
  }
}