module.exports = static = function(request, response, filename) {

  var fs   = require("fs")
  var mime = require("./utils/mime")

  fs.stat(filename, function(err, stat){

    if (err) {
      console.log(err)
    } else if (stat.isDirectory()) {
      console.log("Is Directory")
    }

    function onRead(err, data) {
      if (err) {
        console.log("Can't read")
      }

      var headers = {
        "Content-Type": mime.type(filename),
        "Content-Length": stat.size,
        "Last-Modified": stat.mtime.toUTCString(),
        "Cache-Control": "public max-age=" + (31557600),
        "ETag": stat.size + '-' + Number(stat.mtime)
      }

      response.writeHead(200, headers);
      response.end(data);
    }
    fs.readFile(filename, onRead)
  })

}