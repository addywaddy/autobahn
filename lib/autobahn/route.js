module.exports = route = function(request, response) {
  function action(hit, method) {
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
    return action(hit, request.method)(request, response)
  } else {
    return autobahn.not_found
  }
}