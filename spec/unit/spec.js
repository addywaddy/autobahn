require("unit/autobahn/utils/mime.spec")
require("unit/autobahn/static.spec")

JSpec.describe('autobahn', function(){

  before_each(function() {
    app = autobahn(function(r) {
      r.add(/\//,     function(req, res) { return "INDEX"     }),
      r.add(/\/foo/,  function(req, res) { return "AUTOBAHN"  })
    })
  })

  it('should add the routes', function(){
    expect(autobahn.routes.length).to(eql, 2)
  })

  it('should return the matching action', function(){
    expect(app({url: "/"})).to(eql, "INDEX")
  })

})
