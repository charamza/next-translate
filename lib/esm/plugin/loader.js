import templateWithHoc from './templateWithHoc'
import templateWithLoader from './templateWithLoader'
import {
  clearCommentsRgx,
  getDefaultAppJs,
  hasExportName,
  hasHOC,
  isPageToIgnore,
} from './utils'
export default function loader(rawCode) {
  var _a = this.query,
    hasGetInitialPropsOnAppJs = _a.hasGetInitialPropsOnAppJs,
    hasAppJs = _a.hasAppJs,
    extensionsRgx = _a.extensionsRgx,
    pagesPath = _a.pagesPath,
    hasLoadLocaleFrom = _a.hasLoadLocaleFrom,
    revalidate = _a.revalidate
  var normalizedPagesPath = pagesPath.replace(/\\/g, '/')
  var normalizedResourcePath = this.resourcePath.replace(/\\/g, '/')
  if (normalizedResourcePath.includes('node_modules/next/dist/pages/_app')) {
    if (hasAppJs) return rawCode
    return getDefaultAppJs(hasLoadLocaleFrom)
  }
  if (!normalizedResourcePath.startsWith(normalizedPagesPath)) return rawCode
  var page = normalizedResourcePath.replace(normalizedPagesPath, '/')
  var pageNoExt = page.replace(extensionsRgx, '')
  var code = rawCode.replace(clearCommentsRgx, '')
  var typescript = page.endsWith('.ts') || page.endsWith('.tsx')
  if (!code.includes('export default')) return rawCode
  if (code.match(/export *\w* *(__N_SSP|__N_SSG) *=/)) {
    return rawCode
  }
  if (hasGetInitialPropsOnAppJs) {
    return pageNoExt === '/_app'
      ? templateWithHoc(rawCode, {
          typescript: typescript,
          hasLoadLocaleFrom: hasLoadLocaleFrom,
        })
      : rawCode
  }
  if (pageNoExt === '/_app') {
    return templateWithHoc(rawCode, {
      skipInitialProps: true,
      typescript: typescript,
      hasLoadLocaleFrom: hasLoadLocaleFrom,
    })
  }
  if (isPageToIgnore(page)) return rawCode
  var isWrapperWithExternalHOC = hasHOC(code)
  var isDynamicPage = page.includes('[')
  var isGetInitialProps = !!code.match(/\WgetInitialProps\W/g)
  var isGetServerSideProps = hasExportName(code, 'getServerSideProps')
  var isGetStaticPaths = hasExportName(code, 'getStaticPaths')
  var isGetStaticProps = hasExportName(code, 'getStaticProps')
  var hasLoader = isGetStaticProps || isGetServerSideProps || isGetInitialProps
  if (isGetInitialProps || (!hasLoader && isWrapperWithExternalHOC)) {
    return templateWithHoc(rawCode, {
      typescript: typescript,
      hasLoadLocaleFrom: hasLoadLocaleFrom,
    })
  }
  var loader =
    isGetServerSideProps || (!hasLoader && isDynamicPage && !isGetStaticPaths)
      ? 'getServerSideProps'
      : 'getStaticProps'
  return templateWithLoader(rawCode, {
    page: pageNoExt,
    typescript: typescript,
    loader: loader,
    hasLoader: hasLoader,
    hasLoadLocaleFrom: hasLoadLocaleFrom,
    revalidate: revalidate,
  })
}
