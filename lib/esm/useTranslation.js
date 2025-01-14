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
import { useContext, useMemo } from 'react'
import wrapTWithDefaultNs from './wrapTWithDefaultNs'
import I18nContext from './_context'
export default function useTranslation(defaultNS) {
  var ctx = useContext(I18nContext)
  return useMemo(
    function () {
      return __assign(__assign({}, ctx), {
        t: wrapTWithDefaultNs(ctx.t, defaultNS),
      })
    },
    [ctx.lang, defaultNS]
  )
}
