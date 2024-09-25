import { getDvaApp } from '@umijs/max';

import * as request from '@/utils/request';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import { firebaseAppAuth } from '@/services/firebase.service';

const { API } = require('@/services/config/api.config');
const {
  xhr,
  config,
  formData,
  METHOD,
  HEADER_TYPE,
  CONTENT_TYPE
} = request.default;

/**
 * @constant
 * @export
 * @return {boolean}
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development';

/**
 * @constant
 * @export
 * @return {boolean}
 */
export const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * @export
 * @param changedFields
 * @param allFields
 * @param MODEL_NAME
 * @param dispatch
 */
export const onFieldsChangeHandler = ({ changedFields, allFields, MODEL_NAME, dispatch = stub }) => {
  dispatch({
    type: `${MODEL_NAME}/updateFields`,
    payload: {
      changedFields,
      allFields,
      model: MODEL_NAME
    }
  });
};

/**
 * @export
 * @param entityForm
 * @param key
 * @param [namespace]
 * @return {number}
 */
export function getEntityFormIdx({ entityForm, key, namespace = '' }) {
  let idx = -1;
  if (namespace && namespace.length) {
    key = `${namespace}/${key}`;
  }
  entityForm.forEach((form, index) => {
    if (form.name === key) {
      idx = index;
    }
  });

  return idx;
}

/**
 * @export
 * @param [entityForm]
 * @param [formObj]
 * @return {*[]}
 */
export const toEntityForm = ({ entityForm = [], formObj = {} }) => {
  const _entityForm = [...entityForm];
  const toDelete = [];

  const keys = Object.keys(formObj);

  for (const element of keys) {
    const key = element;
    const idx = getEntityFormIdx({ entityForm, key });

    const formItem = {
      name: key,
      value: formObj[key]
    };

    // Overwrite existing values
    if (idx > -1) {
      toDelete.push(idx);
    }

    _entityForm.push(formItem);
  }

  return [..._entityForm.filter((_form, idx) => toDelete.indexOf(idx) === -1)];
};

/**
 * @export
 * @param {string} id
 * @return {boolean}
 */
export const isNew = id => id === 'new';

/**
 * @export
 * @async
 * @param {string} collectionPath
 * @param {boolean} [notice]
 * @param {string} [action]
 * @example
 * networkConnection('users', true, 'add')
 * @return {Promise<boolean>}
 */
export const networkConnection = async (collectionPath, notice = true, action = 'firestore') => {
  if (window.navigator.onLine) {
    return true;
  } else {

    const { messageApi, intl } = xhr.message;
    const error = t(intl, 'message.error.connection');

    if (notice) messageApi.error(error);
    console.warn(`No network connection on ${action}: ${collectionPath}\n`, error);

    return false;
  }
};

/**
 * @export
 * @return {*}
 */
export const useDispatcher = () => {
  const dva = getDvaApp();
  return dva._store.dispatch;
};

/**
 * @export
 * @param timeout
 * @return {Promise<unknown>}
 */
export const delayEffect = (timeout = 0) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

/**
 * @constant
 * @param {string} token
 * @return {string}
 */
const getBearer = (token) => `Bearer ${token}`;

/**
 * @async
 * @constant
 * @param error
 * @param notice
 * @return {Promise<{data}>}
 */
const handleError = async (error, notice) => {
  if (notice) {
    console.error(error);
  }
  return { data: { error } };
};

/**
 * @async
 * @export
 * @param props
 * @example
 * updateFeature = async ({ id, data }) => {
 *   return xhrRequest({
 *     url: API.features.get,
 *     method: request.METHOD.put,
 *     featureKey: id,
 *     data
 *   });
 * };
 * @return {Promise<T|{data: {error: *}, exists: boolean}>}
 */
export const xhrRequest = async (props) => {
  let {
    url,
    data = {},
    method = METHOD.post,
    notice = true,
    ...args
  } = props;

  const { accessToken } = firebaseAppAuth?.currentUser || {};

  const opts = config({
    url,
    method,
    headers: {
      [HEADER_TYPE.authorization]: getBearer(accessToken),
      [HEADER_TYPE.contentType]: CONTENT_TYPE.json
    },
    ...args
  });

  return xhr({
        ...opts,
        ...{ data }
      },
      notice,
      async (error) => handleError(error, notice)
  );
};