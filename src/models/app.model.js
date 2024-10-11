/* global window */
/* global document */
/* global location */

/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import dayjs from 'dayjs';

import weekday from 'dayjs/plugin/weekday';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { commonModel } from '@/models/common.model';
import { menus } from '@/services/menu.service';

import request from '@/utils/request';
import { updateScrollPosition } from '@/utils/dom';

const appMeta = {
  name: 'Uri Khaimov: Portfolio',
  charSet: 'utf-8'
};

const MODEL_NAME = 'appModel';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

dayjs.locale('en');

const DEFAULT_STATE = {
  theme: 'light',
  interval: {
    timeout: 3 * 60 * 1000,
    enabled: true
  },
  activeTab: true,
  meta: { ...appMeta, ...{ title: '' } },
  menus: [],
  layout: {
    header: false,
    footer: false
  }
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    ...DEFAULT_STATE
  },

  subscriptions: {

    setupHistory(setup) {
      const { dispatch, history } = setup;

      dispatch({ type: 'updateState', payload: { location: history.location } });

      return history.listen(data => {
        // In case of route replace
        const location = data.pathname ? { ...data } : { ...data.location };

        dispatch({ type: 'updateState', payload: { location } });

        updateScrollPosition();
      });
    },

    setup({ dispatch }) {
      dispatch({ type: 'updateState', payload: { menus } });
    }
  },

  effects: {

    * toggleTheme({ payload }, { put, select }) {
      const { theme } = yield select(state => state[MODEL_NAME]);

      const newTheme = theme === 'light' ? 'dark' : 'light';
      yield put({ type: 'updateState', payload: { theme: newTheme } });
    },

    * updateDocumentMeta({ payload }, { put, select }) {
      const { meta } = yield select(state => state[MODEL_NAME]);
      yield put({ type: 'updateState', payload: { meta: { ...meta, ...payload.meta } } });
    }
  },

  reducers: {
    update404(state, { payload }) {
      return { ...state, is404: payload?.is404 };
    },
    updateReferrer(state, { payload }) {
      return { ...state, referrer: payload?.referrer };
    },
    activeModel(state, { payload }) {
      return { ...state, activeModel: { ...payload } };
    },
    checkActiveTab(state, { payload }) {
      return { ...state, activeTab: payload };
    },
    handleMessageApi(state, { payload = {} }) {
      const { intl, messageApi } = payload;

      request.xhr.addMessageApi(messageApi, intl);
      return { ...state, messageApi, intl };
    },
    handleModalApi(state, { payload = {} }) {
      const { modalApi } = payload;

      request.xhr.addModalApi(modalApi);
      return { ...state, modalApi };
    },
    handleNotificationApi(state, { payload = {} }) {
      const { dispatch, notificationApi } = payload;

      request.xhr.addNotificationApi(notificationApi, dispatch);
      return { ...state, notificationApi, dispatch };
    }
  }
});
