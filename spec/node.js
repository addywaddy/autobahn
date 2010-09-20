
require.paths.unshift('spec', '/Library/Ruby/Gems/1.8/gems/jspec-4.3.3/lib', 'lib')
require('jspec')
require('unit/spec.helper')
require('autobahn/utils/mime')
require('autobahn/static')
require('autobahn')

JSpec
  .exec('spec/unit/spec.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report()