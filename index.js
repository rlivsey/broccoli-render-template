var fs = require('fs')
var RSVP = require('rsvp')
var Filter = require('broccoli-filter')
var cons = require('consolidate')

module.exports = RenderTemplate

RenderTemplate.prototype = Object.create(Filter.prototype)
RenderTemplate.prototype.constructor = RenderTemplate
function RenderTemplate (inputTree, options) {
  if (!(this instanceof RenderTemplate)) return new RenderTemplate(inputTree, options)
  Filter.call(this, inputTree, options)
  this.options = options || {}
}

RenderTemplate.prototype.targetExtension = 'html'

// file extension == template engine
// TODO - allow providing aliases so foo.md is markdown
RenderTemplate.prototype.engineFromPath = function(relativePath) {
  return cons[this.fileExtension(relativePath)];
}

RenderTemplate.prototype.fileExtension = function(relativePath) {
  return relativePath.split(".").pop();
}

RenderTemplate.prototype.getDestFilePath = function(relativePath) {
  if (this.engineFromPath(relativePath)) {
    var ext = this.fileExtension(relativePath);
    if (this.targetExtension != null) {
      relativePath = relativePath.slice(0, -ext.length) + this.targetExtension
    }
    return relativePath
  }
  return null;
}

RenderTemplate.prototype.processFile = function(srcDir, destDir, relativePath) {
  var self = this;
  return new RSVP.Promise(function(resolve, reject){
    self.engineFromPath(relativePath)(srcDir + '/' + relativePath, self.options, function(e, html){
      if (e) {
        reject(e)
      } else {
        var outputPath = self.getDestFilePath(relativePath)
        resolve(fs.writeFileSync(destDir + '/' + outputPath, html, { encoding: 'utf8' }))
      }
    })
  })
}
