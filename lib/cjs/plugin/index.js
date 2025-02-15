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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {}
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p]
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]]
      }
    return t
  }
Object.defineProperty(exports, '__esModule', { value: true })
var utils_1 = require('./utils')
function nextTranslate(nextConfig) {
  if (nextConfig === void 0) {
    nextConfig = {}
  }
  var fs = require('fs')
  var path = require('path')
  var test = /\.(tsx|ts|js|mjs|jsx)$/
  var dir = path.resolve(
    path.relative(pkgDir(), process.env.NEXT_TRANSLATE_PATH || '.')
  )
  var i18n = nextConfig.i18n || {}
  var _a = require(path.join(dir, 'i18n')),
    locales = _a.locales,
    defaultLocale = _a.defaultLocale,
    _b = _a.loader,
    loader = _b === void 0 ? true : _b,
    pagesInDir = _a.pagesInDir,
    pages = _a.pages,
    logger = _a.logger,
    restI18n = __rest(_a, [
      'locales',
      'defaultLocale',
      'loader',
      'pagesInDir',
      'pages',
      'logger',
    ])
  var hasGetInitialPropsOnAppJs = false
  if (!pagesInDir) {
    pagesInDir = 'pages'
    if (fs.existsSync(path.join(dir, 'src/pages'))) {
      pagesInDir = 'src/pages'
    } else if (fs.existsSync(path.join(dir, 'app/pages'))) {
      pagesInDir = 'app/pages'
    } else if (fs.existsSync(path.join(dir, 'integrations/pages'))) {
      pagesInDir = 'integrations/pages'
    }
  }
  var pagesPath = path.join(dir, pagesInDir)
  var app = fs.readdirSync(pagesPath).find(function (page) {
    return page.startsWith('_app.')
  })
  if (app) {
    var code = fs.readFileSync(path.join(pagesPath, app)).toString('UTF-8')
    hasGetInitialPropsOnAppJs =
      !!code.match(/\WgetInitialProps\W/g) || (0, utils_1.hasHOC)(code)
  }
  return __assign(__assign({}, nextConfig), {
    i18n: __assign(__assign(__assign({}, i18n), restI18n), {
      locales: locales,
      defaultLocale: defaultLocale,
    }),
    webpack: function (conf, options) {
      var config =
        typeof nextConfig.webpack === 'function'
          ? nextConfig.webpack(conf, options)
          : conf
      config.resolve.alias = __assign(
        __assign({}, config.resolve.alias || {}),
        { '@next-translate-root': path.resolve(dir) }
      )
      if (!loader) return config
      config.module.rules.push({
        test: test,
        use: {
          loader: 'next-translate/plugin/loader',
          options: {
            extensionsRgx: restI18n.extensionsRgx || test,
            revalidate: restI18n.revalidate || 0,
            hasGetInitialPropsOnAppJs: hasGetInitialPropsOnAppJs,
            hasAppJs: !!app,
            pagesPath: path.join(pagesPath, '/'),
            hasLoadLocaleFrom: typeof restI18n.loadLocaleFrom === 'function',
          },
        },
      })
      return config
    },
  })
}
exports.default = nextTranslate
function pkgDir() {
  try {
    return require('pkg-dir').sync() || process.cwd()
  } catch (e) {
    return process.cwd()
  }
}
