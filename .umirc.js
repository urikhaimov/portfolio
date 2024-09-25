import { defineConfig } from '@umijs/max';

import envs from './config/envs';
import { proxy } from './config/proxy';
import { routes } from './config/routes';
import { theme } from './config/theme';
import { alias } from './config/alias';

const { NODE_ENV, DEBUG } = process.env;

const isDevelopment = NODE_ENV === 'development';

const shared = {
  react: {
    singleton: true,
    eager: true,
    requiredVersion: '18.3.1',
    strictVersion: true
  },
  'react-dom': {
    singleton: true,
    eager: true,
    requiredVersion: '18.3.1',
    strictVersion: true
  }
};

const headScripts = DEBUG ? [
  'http://localhost:8005'
] : [];

/**
 * @constant
 * @type {ConfigType|*}
 * @private
 */
const __config__ = {
  antd: {
    theme,
    configProvider: {},
    style: 'less',
    dark: false,
    compact: true
  },
  crossorigin: true,
  alias,
  routes,
  proxy,
  model: {},
  // https://makojs.dev/getting-started
  mako: {},
  base: '/',
  request: {
    dataField: 'data'
  },
  manifest: {},
  initialState: {},
  favicons: [
    '/assets/favicon.png'
    // '/assets/favicon-16x16.png',
    // '/assets/favicon-32x32.png'
  ],
  locale: {
    default: 'en-US',
    antd: true,
    title: true,
    baseNavigator: false,
    baseSeparator: '-'
  },
  access: {},
  layout: false,
  npmClient: 'yarn',
  plugins: [
    'umi-plugin-circular-check'
  ],
  extraBabelPlugins: [],
  headScripts: [
    // 'https://upload-widget.cloudinary.com/global/all.js'
    ...headScripts
  ],
  links: [],
  metas: [],
  deadCode: {},
  // @link https://umijs.org/docs/max/react-query
  // reactQuery: {},
  mfsu: {
    // esbuild: true
    mfName: 'local',
    remoteName: 'remote',
    shared
  },
  fastRefresh: true,
  dva: {
    extraModels: []
  },
  devtool: isDevelopment ? 'source-map' : 'eval',
  clientLoader: {},
  define: { ...envs }
};

if (isDevelopment) {
  console.log('\n\n==== CONFIG =====\n');
  console.log(JSON.stringify(__config__, null, 2));
  console.log('\n==== /CONFIG =====\n\n');
}

export default defineConfig(__config__);
