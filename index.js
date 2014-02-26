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

RenderTemplate.prototype.processString = function (string, relativePath) {
  var options = this.options;
  return new RSVP.Promise(function(resolve, reject){
    cons.handlebars.render(string, options, function(e, html){
      if (e) {
        reject(e)
      } else {
        resolve(html)
      }
    })
  })
}