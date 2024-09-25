import { RUNTIME_CONFIG } from '@/services/config/runtime.config';

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isHomePage = (path = '') => path === '/';

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isLoginPage = (path = '') => path === '/login';

/**
 * @export
 * @param {string} [path]
 * @returns {boolean}
 */
export const isLogoutPage = (path = '') => !!path.match(/^\/logout/);