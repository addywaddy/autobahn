require("underscore")
var path = require('path'), fs = require('fs');
require.paths.unshift(path.dirname(__dirname)+'/lib');

global.assert = require('assert');

global.test = function(description, cb) {
  console.log(description)
  cb.call()
}