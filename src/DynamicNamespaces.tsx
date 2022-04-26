import React, { useContext, useEffect, useState } from 'react'
import { DynamicNamespacesProps, I18nConfig, I18nDictionary } from '.'
import I18nProvider, { InternalContext } from './I18nProvider'
import useTranslation from './useTranslation'
import I18nContext from './_context'

export default function DynamicNamespaces({
  dynamic,
  namespaces = [],
  fallback,
  children,
}: DynamicNamespacesProps): any {
  const config = useContext(InternalContext).config as I18nConfig
  const { lang } = useTranslation()
  const [loaded, setLoaded] = useState(false)
  const [pageNs, setPageNs] = useState<I18nDictionary[]>([])
  const loadLocale =
    dynamic || config.loadLocaleFrom || (() => Promise.resolve({}))
  const ctx = useContext(I18nContext)

  async function loadNamespaces() {
    if (typeof loadLocale !== 'function') return

    const pageNamespaces = await Promise.all(
      namespaces.map((ns) => loadLocale(ctx.lang, ns))
    )
    setPageNs(pageNamespaces)
    setLoaded(true)
  }

  useEffect(() => {
    loadNamespaces()
  }, [namespaces.join(), ctx.lang])

  if (!loaded) return fallback || null

  return (
    <I18nProvider
      lang={lang}
      namespaces={namespaces.reduce(
        (obj: Record<string, I18nDictionary>, ns, i) => {
          obj[ns] = pageNs[i]
          return obj
        },
        {}
      )}
    >
      {children}
    </I18nProvider>
  )
}
