module.exports = render = function(request, response, viewPath, options) {
  var options = (typeof(options) !== 'undefined') ? options : {}

var path = require("path")
var fs   = require("fs")
var mime = require("./utils/mime")

  var filename = path.normalize(path.join(
    path.join(
      path.dirname(process.mainModule.filename), "views"
    ), viewPath
  ))

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

      response.writeHead(options.status || 200, headers);
      response.end(data);
    }
    fs.readFile(filename, onRead)
  })

}
