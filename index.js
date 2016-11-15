'use strict'
/*
 * gulp-ng-template
 * https://github.com/teambition/gulp-ejs-template
 *
 * Copyright (c) 2014 Yan Qing
 * Licensed under the MIT license.
 */
const fs = require('fs')
const util = require('util')
const path = require('path')
const gutil = require('gulp-util')
const through = require('through2')
const EJS = require('./lib/ejs')
const packageName = require('./package.json').name
const templatesTpl = fs.readFileSync(path.join(__dirname, './lib/templates.js'), {encoding: 'utf8'})

module.exports = function (options) {
  options = options || {}

  var joinedContent = ''
  var moduleName = options.moduleName || 'templates'
  var templates = templatesTpl.replace('moduleName', moduleName)
  var contentTpl = "templates['%s'] = templates['%s'] = %s;\n\n"
  var joinedFile = new gutil.File({
    cwd: __dirname,
    base: __dirname,
    path: path.join(__dirname, moduleName + '.js')
  })

  return through.obj(function (file, encoding, next) {
    if (file.isNull()) return next()
    if (file.isStream()) return this.emit('error', new gutil.PluginError(packageName, 'Streaming not supported'))

    var name = path.relative(file.base, file.path)
    var tpl = new EJS(file.contents.toString('utf8'), options.delimiter)
    joinedContent += util.format(contentTpl, normalName(name), '/' + normalName(name), tpl.compile())
    next()
  }, function () {
    joinedContent = joinedContent.trim().replace(/^/gm, '  ')
    joinedFile.contents = new Buffer(templates.replace('/* PLACEHOLDER */', joinedContent))
    this.push(joinedFile)
    this.push(null)
  })

  function fullName (name) {
    return name.replace('\\', '/')
  }

  function normalName (name) {
    return fullName(name).replace(path.extname(name), '')
  }
}
