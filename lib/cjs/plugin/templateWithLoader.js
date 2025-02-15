'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var utils_1 = require('./utils')
function templateWithLoader(rawCode, _a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.page,
    page = _c === void 0 ? '' : _c,
    _d = _b.typescript,
    typescript = _d === void 0 ? false : _d,
    _e = _b.loader,
    loader = _e === void 0 ? 'getStaticProps' : _e,
    _f = _b.hasLoader,
    hasLoader = _f === void 0 ? false : _f,
    _g = _b.hasLoadLocaleFrom,
    hasLoadLocaleFrom = _g === void 0 ? false : _g,
    _h = _b.revalidate,
    revalidate = _h === void 0 ? 0 : _h
  var tokenToReplace = '__CODE_TOKEN_'.concat(Date.now().toString(16), '__')
  var modifiedCode = rawCode
  if (hasLoader) {
    modifiedCode = modifiedCode
      .replace(
        new RegExp(
          '(const|var|let|async +function|function|import|import {.* as) +'.concat(
            loader,
            '\\W'
          )
        ),
        function (v) {
          return v.replace(
            new RegExp('\\W'.concat(loader, '\\W')),
            function (r) {
              return r.replace(loader, '_' + loader)
            }
          )
        }
      )
      .replace(
        new RegExp(
          'export +(const|var|let|async +function|function) +_'.concat(loader)
        ),
        function (v) {
          return v.replace('export', '')
        }
      )
      .replace(/export +\{ *(getStaticProps|getServerSideProps)( |,)*\}/, '')
      .replace(
        new RegExp('^ *export {(.|\n)*'.concat(loader, '(.|\n)*}'), 'gm'),
        function (v) {
          return v
            .replace(
              new RegExp('(\\w+ +as +)?'.concat(loader, '\\W'), 'gm'),
              function (v) {
                return v.endsWith(loader) ? '' : v[v.length - 1]
              }
            )
            .replace(/,( |\n)*,/gm, ',')
            .replace(/{( |\n)*,/gm, '{')
            .replace(/{,( \n)*}/gm, '}')
            .replace(/^ *export +{( |\n)*}\W*$/gm, '')
        }
      )
      .replace(/^ *import +{( |\n)*[^}]*/gm, function (v) {
        if (v.match(new RegExp('\\W+'.concat(loader, ' +as ')))) return v
        return v.replace(
          new RegExp('\\W+'.concat(loader, '(\\W|$)')),
          function (r) {
            return r.replace(loader, ''.concat(loader, ' as _').concat(loader))
          }
        )
      })
  }
  var template =
    "\n    import __i18nConfig from '@next-translate-root/i18n'\n    import __loadNamespaces from 'next-translate/loadNamespaces'\n    "
      .concat(tokenToReplace, '\n    export async function ')
      .concat(loader, '(ctx) {\n        ')
      .concat(
        hasLoader ? 'let res = _'.concat(loader, '(ctx)') : '',
        '\n        '
      )
      .concat(
        hasLoader ? "if(typeof res.then === 'function') res = await res" : '',
        '\n        return {\n          '
      )
      .concat(
        hasLoader && revalidate > 0
          ? 'revalidate: '.concat(revalidate, ',')
          : '',
        '\n          '
      )
      .concat(hasLoader ? '...res,' : '', '\n          props: {\n            ')
      .concat(
        hasLoader ? '...(res.props || {}),' : '',
        "\n            ...(await __loadNamespaces({\n              ...ctx,\n              pathname: '"
      )
      .concat(page, "',\n              loaderName: '")
      .concat(loader, "',\n              ...__i18nConfig,\n              ")
      .concat(
        (0, utils_1.overwriteLoadLocales)(hasLoadLocaleFrom),
        '\n            }))\n          }\n        }\n    }\n  '
      )
  if (typescript) template = template.replace(/\n/g, '\n// @ts-ignore\n')
  return template.replace(tokenToReplace, function () {
    return '\n'.concat(modifiedCode, '\n')
  })
}
exports.default = templateWithLoader
