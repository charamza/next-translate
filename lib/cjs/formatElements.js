'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k]
          },
        })
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
var react_1 = __importStar(require('react'))
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
function formatElements(value, elements) {
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
    var element =
      elements[key] || react_1.default.createElement(react_1.Fragment, null)
    tree.push(
      (0, react_1.cloneElement)(
        element,
        { key: realIndex },
        children ? formatElements(children, elements) : element.props.children
      )
    )
    if (after) tree.push(after)
  })
  return tree
}
exports.default = formatElements
