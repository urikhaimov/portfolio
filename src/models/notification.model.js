/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { history } from '@umijs/max';

import { commonModel } from '@/models/common.model';

import { getNotifications } from '@/services/notification.service';
import {
  fbAdd,
  fbFindById,
  fbUpdate,
  getRef
} from '@/services/firebase.service';

import { logger } from '@/utils/console';
import { NOTIFICATIONS } from '@/utils/state';

const MODEL_NAME = 'notificationModel';
const SUBJECT_NAME = 'notifications';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    MODEL_NAME,
    isOnline: false,
    isFBConnected: true,
    notificationBadge: { count: 0 },
    notifications: {
      sent: [],
      inbox: []
    }
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      // TODO (teamco): Do something.
    },
    setup({ history, dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { call, put, select }) {
      let { user, ability } = yield select(state => state.authModel);
      const { userId, type = 'inbox' } = payload;

      if (user && ability.can('read', SUBJECT_NAME)) {
        if (userId && ability.can('read', 'profile')) {
          const _user = yield call(fbFindById, {
            collectionPath: 'users',
            docName: userId
          });

          if (_user.exists()) {
            user = _user.data();
          } else {
            return yield put({
              type: 'notFound',
              payload: { entity: 'User', key: 'selectedUser' }
            });
          }
        }

        const {
          sent = [],
          inbox = []
        } = yield call(getNotifications, {
          userId: user.id,
          email: user.email,
          type
        });

        yield put({
          type: 'updateState',
          payload: { notifications: { sent, inbox } }
        });

        if (type === 'inbox') {
          yield put({ type: 'getCount', payload: inbox });
        }

      } else {

        history.push(`/errors/403`);
      }
    },

    * refreshNotification(_, { put, call }) {
      DEBUG && logger({ log: 'Notification' });

      yield put({ type: 'handleOnline' });
      yield put({ type: 'getCount' });
    },

    * getCount({ payload = {} }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      let { inbox = [] } = payload;

      if (user && ability.can('read', SUBJECT_NAME)) {

        const notifications = yield call(getNotifications, {
          userId: user.id,
          email: user.email,
          type: 'inbox'
        });

        inbox = notifications.inbox;

        yield put({
          type: 'updateState',
          payload: {
            notificationBadge: { count: inbox.filter(n => !n.read).length }
          }
        });
      }
    },

    * createAndUpdate({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const {
        type,
        status,
        replyTo,
        sentTo,
        title,
        description,
        isPrivate,
        read = false
      } = payload;

      if (user && ability.can('create', SUBJECT_NAME)) {

        let replyRef = null;
        if (replyTo) {
          replyRef = getRef({
            collectionPath: 'notifications',
            document: replyTo
          });

          yield put({
            type: 'setAsRead',
            payload: { docName: replyTo, status: 'status.answered' }
          });
        }

        const userRef = getRef({ collectionPath: 'users', document: user.id });

        // Create notification
        const _notification = yield call(fbAdd, {
          collectionPath: 'notifications',
          data: {
            type,
            title,
            description,
            status,
            sentTo,
            replyRef,
            metadata: {
              createdByRef: userRef,
              createdAt: new Date
            },
            isPrivate,
            read
          }
        });

        if (_notification.exists()) {
          yield put({ type: 'getCount' });
        }
      }
    },

    * setAsRead({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { notifications } = yield select(state => state[MODEL_NAME]);
      const { docName, status = 'status.read' } = payload;

      if (user && ability.can('update', SUBJECT_NAME)) {

        // Update notifications
        yield call(fbUpdate, {
          collectionPath: 'notifications',
          caller: 'setAsRead',
          docName,
          notice: true,
          data: {
            read: true,
            status,
            'metadata.updatedAt': new Date
          }
        });

        let key, msg, i;
        let updatedNotices = [];

        for (key in notifications) {
          if (notifications.hasOwnProperty(key)) {
            const instances = notifications[key];

            if (key === 'inbox') {
              for (i = 0; i < instances.length; i++) {
                updatedNotices = [...instances];
                msg = { ...[...instances][i] };
                if (msg.id === docName) {
                  msg.read = true;
                  msg.status = status;
                  updatedNotices[i] = msg;

                  yield put({
                    type: 'updateState',
                    payload: {
                      notifications: {
                        ...notifications,
                        [key]: updatedNotices
                      }
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  },

  reducers: {

    handleOnline(state, { payload = {} }) {
      const { isOnline = window.navigator.onLine } = payload;
      return { ...state, isOnline };
    }
  }
});
