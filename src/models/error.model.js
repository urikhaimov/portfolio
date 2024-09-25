import React from 'react';

/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { fbAdd, getRef } from '@/services/firebase.service';

import request from '@/utils/request';

const MODEL_NAME = 'errorModel';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,

  state: {
    errors: []
  },

  subscriptions: {
    setup({ dispatch }) {
      // TODO: Do something.
    }
  },

  effects: {

    * query({ payload }, { put, select }) {
      const { errors } = yield select(state => state[MODEL_NAME]);
      // TODO: Do something.
      const { status, title } = payload;

      yield put({
        type: 'updateState',
        payload: {
          errors: [
            ...errors,
            { status, title }
          ]
        }
      });
    },

    * save({ payload }, { put, call, select }) {
      let { user, ability } = yield select(state => state.authModel);

      const {
        error: {
          config,
          response,
          message,
          code
        },
        showNotification = true
      } = payload;

      if (ability.can('create', 'error.logs')) {

        const userRef = user ? getRef({
          collectionPath: 'users',
          document: user?.id
        }) : null;

        const metadata = {
          updatedAt: new Date,
          updatedByRef: userRef
        };

        const entity = yield call(fbAdd, {
          collectionPath: 'errorLogs',
          notice: false,
          data: {
            code,
            url: config?.url || null,
            params: config?.data || null,
            status: response?.status || null,
            response: response?.data || {},
            message: response?.statusText || null,
            description: message || null,
            metadata: {
              createdAt: metadata.updatedAt,
              createdByRef: userRef,
              ...metadata
            }
          }
        });

        if (entity?.exists() && showNotification) {
          const { notificationApi } = request.xhr.notification;

          notificationApi.error({
            message: response?.statusText,
            description: (
                <div>
                  <p>{message}</p>
                  {response?.data?.details && (<p>{response?.data?.details}</p>)}
                  <p>Error Id: <a href={`/errors/${entity.id}`}
                                  rel={'noreferrer'}
                                  target={'_blank'}>{entity.id}</a></p>
                </div>
            ),
            placement: 'topRight',
            duration: null
          });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'save' } });
      }
    }
  },

  reducers: {}
});
