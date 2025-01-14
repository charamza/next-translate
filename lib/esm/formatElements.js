import React, { cloneElement, Fragment } from 'react'
var tagRe = /<(\w+)>(.*?)<\/\1>|<(\w+)\/>/
var nlRe = /(?:\r\n|\r|\n)/g
function getElements(parts) {
  if (!parts.length) return []
  var _a = parts.slice(0, 4),
    paired = _a[0],
    children = _a[1],
    unpaired = _a[2],
    after = _a[3]
  return [[paired || unpaired, children || '', after]].concat(
    getElements(parts.slice(4, parts.length))
  )
}
export default function formatElements(value, elements) {
  if (elements === void 0) {
    elements = []
  }
  var parts = value.replace(nlRe, '').split(tagRe)
  if (parts.length === 1) return value
  var tree = []
  var before = parts.shift()
  if (before) tree.push(before)
  getElements(parts).forEach(function (_a, realIndex) {
    var key = _a[0],
      children = _a[1],
      after = _a[2]
    var element = elements[key] || React.createElement(Fragment, null)
    tree.push(
      cloneElement(
        element,
        { key: realIndex },
        children ? formatElements(children, elements) : element.props.children
      )
    )
    if (after) tree.push(after)
  })
  return tree
}
