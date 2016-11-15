'use strict'

const templates = {}

function render (tplName, data) {
  var it = copy({}, ejs.locals)
  if (tplName.indexOf('/') === 0) {
    tplName = tplName.substr(1)
  }
  return getTpl(tplName)(copy(it, data))
}

function include (tplName, data) {
  return render(tplName, data)
}

function getTpl (tplName) {
  return templates[tplName]
}

function escape (markup) {
  if (!markup) return ''
  return String(markup)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
}

function copy (to, from = {}) {
  return Object.assign(to, from)
}

const ejs = {
  locals: {},
  get: getTpl,
  render: render
}

/* PLACEHOLDER */

export default ejs
