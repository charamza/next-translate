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
import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import I18nContext from './_context'
import transCore from './transCore'
import useTranslation from './useTranslation'
export var InternalContext = createContext({ ns: {}, config: {} })
export default function I18nProvider(_a) {
  var lng = _a.lang,
    _b = _a.namespaces,
    namespaces = _b === void 0 ? {} : _b,
    children = _a.children,
    _c = _a.config,
    newConfig = _c === void 0 ? {} : _c
  var parentLang = useTranslation().lang
  var _d = useRouter() || {},
    locale = _d.locale,
    defaultLocale = _d.defaultLocale
  var internal = useContext(InternalContext)
  var allNamespaces = __assign(__assign({}, internal.ns), namespaces)
  var lang = lng || parentLang || locale || defaultLocale || ''
  var config = __assign(__assign({}, internal.config), newConfig)
  var localesToIgnore = config.localesToIgnore || ['default']
  var ignoreLang = localesToIgnore.includes(lang)
  var pluralRules = new Intl.PluralRules(ignoreLang ? undefined : lang)
  var t = transCore({
    config: config,
    allNamespaces: allNamespaces,
    pluralRules: pluralRules,
    lang: lang,
  })
  return React.createElement(
    I18nContext.Provider,
    { value: { lang: lang, t: t } },
    React.createElement(
      InternalContext.Provider,
      { value: { ns: allNamespaces, config: config } },
      children
    )
  )
}
