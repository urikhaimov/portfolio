/**
 * @export
 * @param {string} [path]
 * @param {string} [errorPath]
 * @returns {[]}
 */
const ERRORS = (path = '', errorPath = '/errors') => [
  {
    component: `@/pages/warning`,
    breadcrumb: 'route.pageWarning',
    path: `${path}${errorPath}/warning`
  },
  {
    component: `@/pages/500`,
    breadcrumb: 'route.page500',
    path: `${path}${errorPath}/500`
  },
  {
    component: `@/pages/403`,
    breadcrumb: 'route.page403',
    path: `${path}${errorPath}/403`
  },
  {
    component: `@/pages/404`,
    breadcrumb: 'route.page404',
    path: `${path}${errorPath}/404`
  },
  {
    component: `@/pages/404`,
    breadcrumb: 'route.page404',
    path: `*`
  }
];

export default { ERRORS };
