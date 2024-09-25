import { green } from 'colors';

import { RUNTIME_CONFIG } from '../src/services/config/runtime.config';
import { API } from '../src/services/config/api.config';

const { NODE_ENV } = process.env;

let { SERVER_URL, SERVER_PORT, API_NS } = RUNTIME_CONFIG;

SERVER_PORT = SERVER_PORT ? `:${SERVER_PORT}` : '';

/**
 * @constant
 * @param {boolean} [debug]
 * @return {{onProxyRes(*, *, *): void, onError(*, *, *): void, logLevel: string, pathRewrite(*, *): void,
 *     onProxyReq(*, *, *): void}}
 */
const debugProps = (debug = true) => {
  return debug ? {
    logLevel: 'debug',
    pathRewrite(path, req) {
      console.info(path, req.url);
    },
    onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({ error: 'Error when connecting to remote server.' });
    },
    onProxyReq(proxyReq, req, res) {
      console.info('onProxyReq', proxyReq.host);
    },
    onProxyRes(proxyRes, req, res) {
      console.log('onProxyRes', proxyRes.host);
    }
  } : {};
};

const isDevelopment = NODE_ENV === 'development';

const proxyPops = {
  changeOrigin: true,
  secure: false,
  ws: false,
  target: `${SERVER_URL}${SERVER_PORT}/`,
  ...debugProps(isDevelopment)
};

const _proxy = {
  [`${API_NS}/addresses`]: { ...proxyPops },
  [`${API_NS}/${API.businesses.store}`]: { ...proxyPops }
};

/**
 * @export
 * @constant
 * @return {{[p: string]: {onProxyRes(*, *, *): void, onError(*, *, *): void, logLevel: string, changeOrigin: boolean,
 *     secure: boolean, ws: boolean, pathRewrite(*, *): void, onProxyReq(*, *, *): void, target: string}|{onProxyRes(*,
 *     *, *): void, onError(*, *, *): void, logLevel: string, changeOrigin: boolean, secure: boolean, ws: boolean,
 *     pathRewrite(*, *): void, onProxyReq(*, *, *): void, target: string}}}
 */
const getProxy = () => {
  console.log('\n\n==== PROXY =====\n');
  console.log(green('NODE_ENV:'), NODE_ENV);
  console.log(green('SERVER_URL:'), `${SERVER_URL}${SERVER_PORT}`);
  isDevelopment && console.log(green('PROXY:'), _proxy);
  console.log('\n==== /PROXY =====\n\n');

  return _proxy;
};

export const proxy = getProxy();