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
function splitNsKey(key, nsSeparator) {
  if (!nsSeparator) return { i18nKey: key }
  var i = key.indexOf(nsSeparator)
  if (i < 0) return { i18nKey: key }
  return {
    namespace: key.slice(0, i),
    i18nKey: key.slice(i + nsSeparator.length),
  }
}
export default function transCore(_a) {
  var config = _a.config,
    allNamespaces = _a.allNamespaces,
    pluralRules = _a.pluralRules,
    lang = _a.lang
  var _b = config.logger,
    logger = _b === void 0 ? missingKeyLogger : _b
  var t = function (key, query, options) {
    var _a
    if (key === void 0) {
      key = ''
    }
    var k = Array.isArray(key) ? key[0] : key
    var _b = config.nsSeparator,
      nsSeparator = _b === void 0 ? ':' : _b,
      _c = config.loggerEnvironment,
      loggerEnvironment = _c === void 0 ? 'browser' : _c
    var _d = splitNsKey(k, nsSeparator),
      i18nKey = _d.i18nKey,
      _e = _d.namespace,
      namespace =
        _e === void 0
          ? (_a =
              options === null || options === void 0 ? void 0 : options.ns) !==
              null && _a !== void 0
            ? _a
            : config.defaultNS
          : _e
    var dic = (namespace && allNamespaces[namespace]) || {}
    var keyWithPlural = plural(pluralRules, dic, i18nKey, config, query)
    var value = getDicValue(dic, keyWithPlural, config, options)
    var empty =
      typeof value === 'undefined' ||
      (typeof value === 'object' && !Object.keys(value).length)
    var fallbacks =
      typeof (options === null || options === void 0
        ? void 0
        : options.fallback) === 'string'
        ? [options.fallback]
        : (options === null || options === void 0
            ? void 0
            : options.fallback) || []
    if (
      empty &&
      (loggerEnvironment === 'both' ||
        loggerEnvironment ===
          (typeof window === 'undefined' ? 'node' : 'browser'))
    ) {
      logger({ namespace: namespace, i18nKey: i18nKey })
    }
    if (empty && Array.isArray(fallbacks) && fallbacks.length) {
      var firstFallback = fallbacks[0],
        restFallbacks = fallbacks.slice(1)
      if (typeof firstFallback === 'string') {
        return t(
          firstFallback,
          query,
          __assign(__assign({}, options), { fallback: restFallbacks })
        )
      }
    }
    if (
      empty &&
      (options === null || options === void 0 ? void 0 : options.default) &&
      (fallbacks === null || fallbacks === void 0
        ? void 0
        : fallbacks.length) == 0
    ) {
      return interpolation({
        text: options === null || options === void 0 ? void 0 : options.default,
        query: query,
        config: config,
        lang: lang,
      })
    }
    if (empty) {
      return k
    }
    if (value instanceof Object) {
      return objectInterpolation({
        obj: value,
        query: query,
        config: config,
        lang: lang,
      })
    }
    return interpolation({
      text: value,
      query: query,
      config: config,
      lang: lang,
    })
  }
  return t
}
function getDicValue(dic, key, config, options) {
  if (key === void 0) {
    key = ''
  }
  if (options === void 0) {
    options = {
      returnObjects: false,
    }
  }
  var _a = (config || {}).keySeparator,
    keySeparator = _a === void 0 ? '.' : _a
  var keyParts = keySeparator ? key.split(keySeparator) : [key]
  var value = keyParts.reduce(function (val, key) {
    if (typeof val === 'string') {
      return {}
    }
    var res = val[key]
    return res || (typeof res === 'string' ? res : {})
  }, dic)
  if (
    typeof value === 'string' ||
    (value instanceof Object && options.returnObjects)
  ) {
    return value
  }
  return undefined
}
function plural(pluralRules, dic, key, config, query) {
  if (!query || typeof query.count !== 'number') return key
  var numKey = ''.concat(key, '_').concat(query.count)
  if (getDicValue(dic, numKey, config) !== undefined) return numKey
  var pluralKey = ''.concat(key, '_').concat(pluralRules.select(query.count))
  if (getDicValue(dic, pluralKey, config) !== undefined) {
    return pluralKey
  }
  var nestedNumKey = ''.concat(key, '.').concat(query.count)
  if (getDicValue(dic, nestedNumKey, config) !== undefined) return nestedNumKey
  var nestedKey = ''.concat(key, '.').concat(pluralRules.select(query.count))
  if (getDicValue(dic, nestedKey, config) !== undefined) return nestedKey
  return key
}
function interpolation(_a) {
  var text = _a.text,
    query = _a.query,
    config = _a.config,
    lang = _a.lang
  if (!text || !query) return text || ''
  var escapeRegex = function (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  var _b = config.interpolation || {},
    _c = _b.format,
    format = _c === void 0 ? null : _c,
    _d = _b.prefix,
    prefix = _d === void 0 ? '{{' : _d,
    _e = _b.suffix,
    suffix = _e === void 0 ? '}}' : _e
  var regexEnd =
    suffix === '' ? '' : '(?:[\\s,]+([\\w-]*))?\\s*'.concat(escapeRegex(suffix))
  return Object.keys(query).reduce(function (all, varKey) {
    var regex = new RegExp(
      ''.concat(escapeRegex(prefix), '\\s*').concat(varKey).concat(regexEnd),
      'gm'
    )
    return all.replace(regex, function (_match, $1) {
      return $1 && format ? format(query[varKey], $1, lang) : query[varKey]
    })
  }, text)
}
function objectInterpolation(_a) {
  var obj = _a.obj,
    query = _a.query,
    config = _a.config,
    lang = _a.lang
  if (!query || Object.keys(query).length === 0) return obj
  Object.keys(obj).forEach(function (key) {
    if (obj[key] instanceof Object)
      objectInterpolation({
        obj: obj[key],
        query: query,
        config: config,
        lang: lang,
      })
    if (typeof obj[key] === 'string')
      obj[key] = interpolation({
        text: obj[key],
        query: query,
        config: config,
        lang: lang,
      })
  })
  return obj
}
function missingKeyLogger(_a) {
  var namespace = _a.namespace,
    i18nKey = _a.i18nKey
  if (process.env.NODE_ENV === 'production') return
  if (!namespace) {
    console.warn(
      '[next-translate] The text "'.concat(
        i18nKey,
        '" has no namespace in front of it.'
      )
    )
    return
  }
  console.warn(
    '[next-translate] "'
      .concat(namespace, ':')
      .concat(
        i18nKey,
        '" is missing in current namespace configuration. Try adding "'
      )
      .concat(i18nKey, '" to the namespace "')
      .concat(namespace, '".')
  )
}
