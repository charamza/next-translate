'use strict'
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var react_1 = require('react')
var wrapTWithDefaultNs_1 = __importDefault(require('./wrapTWithDefaultNs'))
var _context_1 = __importDefault(require('./_context'))
function useTranslation(defaultNS) {
  var ctx = (0, react_1.useContext)(_context_1.default)
  return (0, react_1.useMemo)(
    function () {
      return __assign(__assign({}, ctx), {
        t: (0, wrapTWithDefaultNs_1.default)(ctx.t, defaultNS),
      })
    },
    [ctx.lang, defaultNS]
  )
}
exports.default = useTranslation
