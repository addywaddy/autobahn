JSpec.describe('autobahn.mime', function(){

  before_each(function() {
  })

  it('should return the correct mime type', function(){
    expect(mime.type("foo.js")).to(eql, "application/javascript")
  })

  it('should return the correct mime type, irrespective of case', function(){
    expect(mime.type("foo.JPEG")).to(eql, "image/jpeg")
  })

  it('should return the default mime if no match is found', function(){
    expect(mime.type("foo.WTF")).to(eql, "application/octet-stream")
  })

})
