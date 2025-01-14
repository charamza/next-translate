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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.InternalContext = void 0
var react_1 = __importStar(require('react'))
var router_1 = require('next/router')
var _context_1 = __importDefault(require('./_context'))
var transCore_1 = __importDefault(require('./transCore'))
var useTranslation_1 = __importDefault(require('./useTranslation'))
exports.InternalContext = (0, react_1.createContext)({ ns: {}, config: {} })
function I18nProvider(_a) {
  var lng = _a.lang,
    _b = _a.namespaces,
    namespaces = _b === void 0 ? {} : _b,
    children = _a.children,
    _c = _a.config,
    newConfig = _c === void 0 ? {} : _c
  var parentLang = (0, useTranslation_1.default)().lang
  var _d = (0, router_1.useRouter)() || {},
    locale = _d.locale,
    defaultLocale = _d.defaultLocale
  var internal = (0, react_1.useContext)(exports.InternalContext)
  var allNamespaces = __assign(__assign({}, internal.ns), namespaces)
  var lang = lng || parentLang || locale || defaultLocale || ''
  var config = __assign(__assign({}, internal.config), newConfig)
  var localesToIgnore = config.localesToIgnore || ['default']
  var ignoreLang = localesToIgnore.includes(lang)
  var pluralRules = new Intl.PluralRules(ignoreLang ? undefined : lang)
  var t = (0, transCore_1.default)({
    config: config,
    allNamespaces: allNamespaces,
    pluralRules: pluralRules,
    lang: lang,
  })
  return react_1.default.createElement(
    _context_1.default.Provider,
    { value: { lang: lang, t: t } },
    react_1.default.createElement(
      exports.InternalContext.Provider,
      { value: { ns: allNamespaces, config: config } },
      children
    )
  )
}
exports.default = I18nProvider
