'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var templateWithHoc_1 = __importDefault(require('./templateWithHoc'))
var templateWithLoader_1 = __importDefault(require('./templateWithLoader'))
var utils_1 = require('./utils')
function loader(rawCode) {
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
    return (0, utils_1.getDefaultAppJs)(hasLoadLocaleFrom)
  }
  if (!normalizedResourcePath.startsWith(normalizedPagesPath)) return rawCode
  var page = normalizedResourcePath.replace(normalizedPagesPath, '/')
  var pageNoExt = page.replace(extensionsRgx, '')
  var code = rawCode.replace(utils_1.clearCommentsRgx, '')
  var typescript = page.endsWith('.ts') || page.endsWith('.tsx')
  if (!code.includes('export default')) return rawCode
  if (code.match(/export *\w* *(__N_SSP|__N_SSG) *=/)) {
    return rawCode
  }
  if (hasGetInitialPropsOnAppJs) {
    return pageNoExt === '/_app'
      ? (0, templateWithHoc_1.default)(rawCode, {
          typescript: typescript,
          hasLoadLocaleFrom: hasLoadLocaleFrom,
        })
      : rawCode
  }
  if (pageNoExt === '/_app') {
    return (0, templateWithHoc_1.default)(rawCode, {
      skipInitialProps: true,
      typescript: typescript,
      hasLoadLocaleFrom: hasLoadLocaleFrom,
    })
  }
  if ((0, utils_1.isPageToIgnore)(page)) return rawCode
  var isWrapperWithExternalHOC = (0, utils_1.hasHOC)(code)
  var isDynamicPage = page.includes('[')
  var isGetInitialProps = !!code.match(/\WgetInitialProps\W/g)
  var isGetServerSideProps = (0, utils_1.hasExportName)(
    code,
    'getServerSideProps'
  )
  var isGetStaticPaths = (0, utils_1.hasExportName)(code, 'getStaticPaths')
  var isGetStaticProps = (0, utils_1.hasExportName)(code, 'getStaticProps')
  var hasLoader = isGetStaticProps || isGetServerSideProps || isGetInitialProps
  if (isGetInitialProps || (!hasLoader && isWrapperWithExternalHOC)) {
    return (0, templateWithHoc_1.default)(rawCode, {
      typescript: typescript,
      hasLoadLocaleFrom: hasLoadLocaleFrom,
    })
  }
  var loader =
    isGetServerSideProps || (!hasLoader && isDynamicPage && !isGetStaticPaths)
      ? 'getServerSideProps'
      : 'getStaticProps'
  return (0, templateWithLoader_1.default)(rawCode, {
    page: pageNoExt,
    typescript: typescript,
    loader: loader,
    hasLoader: hasLoader,
    hasLoadLocaleFrom: hasLoadLocaleFrom,
    revalidate: revalidate,
  })
}
exports.default = loader
