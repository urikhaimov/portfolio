import { toEntityForm } from '@/services/common.service';
import { history } from '@umijs/max';
import { merge } from 'lodash';

import { intl, t } from '@/utils/i18n';
import { logger } from '@/utils/console';
import { getSiderPanel } from '@/utils/panel';

const DEFAULT_FORM = [];

const DEFAULT_STATE = {
  referrer: document.referrer,
  resetForm: false,
  entityForm: [...DEFAULT_FORM],
  language: 'en-US',
  isEdit: false,
  touched: false,
  tags: [],
  schedulers: {},
  uploadedFiles: {},
  siderPanelConfig: {
    minWidth: 600,
    className: 'siderPanel',
    collapsedWidth: 0,
    collapsed: false,
    collapsible: false,
    resizeable: true,
    layoutable: true
  }
};

/**
 * @constant
 * @export
 */
const commonModel = {
  state: { ...DEFAULT_STATE },

  subscriptions: {},

  effects: {

    * updateTags({ payload }, { put }) {
      const { tags = [], touched = true } = payload;
      yield put({ type: 'updateState', payload: { tags, touched } });
    },

    * cleanForm({ payload }, { put }) {
      yield put({ type: 'updateState', payload: { ...DEFAULT_STATE, ...payload } });
    },

    * updateMessages({ payload }, { put, select }) {
      const { MODEL_NAME, translateMessages } = payload;

      if (MODEL_NAME === 'appModel') {

        yield put({ type: 'updateState', payload: { translateMessages } });

      } else {

        const appState = yield select(state => state.appModel);
        yield put({ type: 'updateState', payload: { translateMessages: appState.translateMessages } });
      }
    },

    * toForm({ payload }, { call, put, select }) {
      const { entityForm } = yield select(state => state[payload.model]);

      yield put({
        type: 'updateState',
        payload: {
          entityForm: yield call(toEntityForm, { entityForm, formObj: payload.form })
        }
      });
    },

    * updateFields({ payload }, { put }) {
      const { allFields } = payload;
      // const uniqueAllFields = [...new Map(allFields.map(item => [item['name'].toString(), item])).values()];

      yield put({
        type: 'updateState',
        payload: {
          touched: true
          // entityForm: [...uniqueAllFields].map(field => ({ name: field.name, value: field.value }))
        }
      });
    },

    * updateEntityForm({ payload }, { put, select }) {
      const { fields, model } = payload;
      const { entityForm } = yield select(state => state[model]);
      let _entityForm = [...entityForm];

      Object.keys(fields).forEach((fieldForChange) => {
        const index = _entityForm.findIndex(field => field.name.includes(fieldForChange));
        if (index > -1) {
          _entityForm = _entityForm.map((entity, idx) => {
            if (idx === index) {
              return {
                ...entity,
                value: fields[fieldForChange]
              };
            }
            return entity;
          });
        } else {
          logger({ type: 'warn', log: 'Invalid field name' });
        }
      });

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          entityForm: _entityForm
        }
      });
    },

    * raiseCondition({ payload }, { put, call, take }) {
      const { redirect = true, type = 404, key, message } = payload;

      if (!key) {
        throw new Error('Key must be defined');
      }

      const msg = yield call(intl, message);
      console.warn(msg);

      const { pathname } = window.location;

      console.warn(msg);

      yield put({
        type: 'updateState',
        payload: {
          [key]: null,
          touched: false
        }
      });

      yield put({
        type: 'errorModel/save',
        payload: {
          error: {
            config: { url: pathname, data: key },
            response: {
              status: { redirect },
              statusText: message?.id
            },
            message: message?.defaultMessage,
            code: type
          },
          showNotification: false
        }
      });

      redirect && history.push(`/errors/${type}?referrer=${encodeURIComponent(pathname)}`);
    },

    * notFound({ payload }, { put }) {
      const { entity = 'Entity', key, redirect } = payload;

      yield put({
        type: 'raiseCondition',
        payload: {
          key,
          redirect,
          type: 404,
          message: {
            id: 'error.notFound',
            defaultMessage: `${entity} not found`, instance: { entity }
          }
        }
      });
    },

    * noPermissions({ payload }, { put }) {
      const { key, redirect } = payload;

      yield put({
        type: 'raiseCondition',
        payload: {
          key,
          redirect,
          type: 403,
          message: {
            id: 'error.noPermissions',
            defaultMessage: 'Has no relevant permissions'
          }
        }
      });
    },

    * updateEntity({ payload }, { put }) {
      const { entity, selectedEntity, entityName } = payload;

      if (entity) {
        yield put({
          type: 'updateState',
          payload: {
            [entityName]: {
              ...selectedEntity,
              ...entity.data
            }
          }
        });
      }
    },

    * closeSiderPanel({ payload = {} }, { put, select }) {
      const { siderPanels } = yield select(state => state.appModel);
      const { currentPanel, panel } = getSiderPanel(siderPanels, payload);

      if (currentPanel) {
        yield put({
          type: 'updateState',
          payload: {
            siderPanels: {
              ...siderPanels,
              [currentPanel]: { ...panel, visible: false }
            }
          }
        });
      }
    }
  },

  reducers: {

    updateState(state, { payload }) {
      return { ...state, ...payload };
    },

    mergeState(state, { payload }) {
      return merge({}, state, payload);
    }
  }
};

export { commonModel };
