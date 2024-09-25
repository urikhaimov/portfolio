import { request, history } from '@umijs/max';

import { stub } from '@/utils/function';
import { isHost } from '@/utils/window';
import { logger } from '@/utils/console';
import { memoizePromise } from '@/utils/cache';
import { successDeleteMsg, successSaveMsg, successUpdateMsg } from '@/utils/message';

const { RUNTIME_CONFIG } = require('@/services/config/runtime.config');

/**
 * @constant
 * @type {{API_NS, ADMIN_NS}}
 */
const { API_NS, ADMIN_NS } = RUNTIME_CONFIG;

const OPERATIONS = {
  add: 'ADD',
  update: 'UPDATE',
  delete: 'DELETE'
};

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfParam() {
  const meta = document.querySelector('meta[name="csrf-param"]');
  return meta.getAttribute('content');
}

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta.getAttribute('content');
}

const METHOD = {
  get: 'get',
  delete: 'delete',
  options: 'options',
  post: 'post',
  patch: 'patch',
  put: 'put'
};

/**
 * @constant
 * @type {{urlencoded: string, multipart: (function({_boundary: string}): string), json: string}}
 */
const CONTENT_TYPE = {
  json: 'application/json;charset=UTF-8',
  urlencoded: 'application/x-www-form-urlencoded',

  /**
   * @example
   * const form = new FormData();
   * form.append(item.name, fs.createReadStream(pathToFile));
   */
  multipart: `multipart/form-data`
};

const ACCEPT_TYPE = {
  all: '*/*',
  json: 'application/json'
};

const HEADER_TYPE = {
  contentType: 'Content-Type',
  allowOrigin: 'Access-Control-Allow-Origin',
  authorization: 'Authorization'
};

const DEFAULT_HEADERS = {
  [HEADER_TYPE.allowOrigin]: '*',
  accept: ACCEPT_TYPE.json
};

const API_CACHE = new Map();

let skipNotificationOn = [];

/**
 * @constant
 * @return {{'Access-Control-Allow-Origin': string, accept: string}}
 */
const mergeHeaders = () => {
  // DEFAULT_HEADERS['X-CSRF-Token'] = _csrfToken();
  return DEFAULT_HEADERS;
};

/**
 * @function
 * @param {string} url
 * @param args
 * @return {string}
 */
function adaptUrlToParams(url, args) {
  let _url = url;
  const matchers = _url.match(/:\w+/g);
  matchers?.forEach((matcher) => {
    const instance = matcher.replace(':', '');
    _url = _url.replace(new RegExp(matcher), args[instance]);
  });

  return _url;
}

/**
 * @function
 * @param url
 * @param {boolean} [direct]
 * @return {string}
 */
function adoptUrlToAPI(url, direct = false) {
  return direct ? `/${url}` : `${API_NS}/${url}`;
}

/**
 * @function
 * @param props
 * @return {{headers, method: string, url: *}}
 */
function config(props) {
  let {
    url = '',
    method = METHOD.get,
    headers = {},
    direct = false,
    responseType = 'json',
    ...args
  } = props;

  if (url.match(/:(\w+)Id/)) {
    url = adaptUrlToParams(url, args);
  }

  return {
    ...{
      url: adoptUrlToAPI(url, direct),
      method,
      responseType,
      headers: { ...mergeHeaders(), ...headers }
    },
    ...args
  };
}

/**
 * @function
 * @param file
 * @return {Promise<unknown>}
 */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * @function
 * @param {boolean} notice
 * @param opts
 * @param {function(any): Promise<{data}>} [errorHandler]
 * @param [fallback]
 * @return {Promise<T | {data: {error: *}}>}
 */
function xhr(opts, notice, errorHandler = stub, fallback = true) {
  const { pathname, hash } = window.location;
  const {
    url,
    method,
    memoized = true,
    showNotification = true,
    redirectOnError = false
  } = opts;

  delete opts.url;

  /**
   * @constant requestCallback
   * @type {function}
   * @return {*}
   */
  const requestCallback = () => request(url, opts).then((res) => {
    const isEdit = method === METHOD.put ||
        (opts?.data || [])[0]?.operation === 'Update';

    const isDelete = [METHOD.delete].includes(method) ||
        (opts?.data || [])[0]?.operation === 'Delete';

    if (notice) {
      let showMsg = stub;
      if ([METHOD.post, METHOD.put].includes(method)) {
        if (isDelete) {
          showMsg = async () => successDeleteMsg();
        } else if (method === METHOD.post) {
          showMsg = async () => successSaveMsg();
        } else if (method === METHOD.put) {
          showMsg = async () => successUpdateMsg();
        }
      } else if (isDelete) {
        showMsg = async () => successDeleteMsg();
      }

      if (skipNotificationOn.indexOf(url) === -1) {
        showMsg();
      }
    }

    return { data: res };

  }).catch((error) => {

    const _st = setTimeout(async () => {
      if (fallback) {
        const errorCode = error?.response?.data?.code;

        await handleResponseError({
          error,
          referrer: `${pathname}${hash}`,
          showNotification: errorCode ?
              !skipNotificationOn.includes(errorCode) :
              showNotification,
          redirectOnError
        });
      }
      clearTimeout(_st);
    }, 1000);

    errorHandler(error).then(r => {
      console.error(error.response);
    });

    return { data: { error } };
  });

  if (memoized && method === METHOD.get) {
    const cachedGet = memoizePromise({
      cache: API_CACHE,
      callback: requestCallback
    });

    return cachedGet(url);
  }

  return requestCallback();
}

/**
 * @memberOf xhr
 * @param messageApi
 * @param intl
 */
xhr.addMessageApi = (messageApi, intl) => {
  xhr.message = {
    ...(xhr.message || {}),
    messageApi,
    intl
  };
};

/**
 * @memberOf xhr
 * @param modalApi
 */
xhr.addModalApi = (modalApi) => {
  xhr.modal = {
    ...(xhr.modal || {}),
    modalApi
  };
};

/**
 * @memberOf xhr
 * @param notificationApi
 * @param dispatch
 */
xhr.addNotificationApi = (notificationApi, dispatch) => {
  xhr.notification = {
    ...(xhr.notification || {}),
    notificationApi,
    dispatch
  };
};

/**
 * @function
 * @async
 * @param props
 */
async function handleResponseError(props = {}) {
  const {
    error,
    referrer,
    showNotification = true,
    redirectOnError = false
  } = props;

  const { code, response } = error;

  const baseUrl = isHost(ADMIN_NS) ? `${ADMIN_NS}/errors` : '/errors';
  const qs = referrer ? `?ref=${encodeURIComponent(referrer)}` : '';
  logger({ type: 'warn', code });

  let errorUrl = `${baseUrl}/${response?.status}${qs}`;

  const { dispatch } = xhr.notification;

  switch (response?.status) {
    case 400:
    case 403:
    case 500:
    case 404:
      break;
    default:
      errorUrl = `${baseUrl}/warning${qs}`;
      break;
  }

  if (redirectOnError) {
    history.replace(errorUrl);
  }

  dispatch({ type: 'errorModel/save', payload: { error, showNotification } });
}

/**
 * @function
 * @param status
 * @return {boolean}
 */
function isSuccess(status) {
  return [200, 201, 202, 203, 204].indexOf(status) > -1;
}

/**
 * @constant
 * @param json
 * @param Handler
 * @return {*}
 * @private
 */
const _xhrData = (json, Handler) => {
  const data = new Handler();
  Object.keys(json).forEach(key => (data.append(key, json[key])));
  return data;
};

/**
 * @export
 * @param json
 * @return {FormData}
 */
const formData = json => {
  return _xhrData(json, FormData);
};

/**
 * @export
 * @param json
 * @return {URLSearchParams}
 */
const paramsData = json => {
  return _xhrData(json, URLSearchParams);
};

export default {
  xhr,
  formData,
  paramsData,
  config,
  toBase64,
  isSuccess,
  METHOD,
  OPERATIONS,
  ACCEPT_TYPE,
  CONTENT_TYPE,
  HEADER_TYPE
};
