/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { defineAbilityFor } from '@/utils/auth/ability';
import { monitorHistory } from '@/utils/history';
import { errorGetMsg } from '@/utils/message';
import { ROLES } from '@/utils/roles';

import {
  manageUser,
  getUserProps,
  gravatarUrl,
  handleUserSessionTimeout,
  sendVerificationEmail,
  updateFbUserEmail
} from '@/services/user.service';
import {
  fbAdd,
  fbFindById,
  fbReadBy,
  fbReadByRef,
  fbSignOut,
  fbUpdate,
  firebaseAppAuth
} from '@/services/firebase.service';
import { STATUSES } from '@/utils/state';

const MODEL_NAME = 'authModel';

/**
 * @description Default user role.
 * @type {string}
 */
const DEFAULT_ROLE = ROLES.consumer;

const DEFAULT_STATE = {
  user: null,
  ability: null,
  isSignedOut: false,
  fbUserValidated: false,
  MIN_PASSWORD_LENGTH: 8
};

/**
 * @export
 * @default
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    ...DEFAULT_STATE,
    MODEL_NAME
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      // TODO (teamco): Do something.
    },

    setup({ history, dispatch }) {
      monitorHistory({ history, dispatch });

      // Init abilities
      dispatch({ type: 'defineAbilities', payload: { user: null } });
      dispatch({ type: 'signIn' });
    }
  },

  effects: {

    * signIn({ payload = {} }, { call, put, select }) {
      const { isSignedOut } = yield select(state => state[MODEL_NAME]);

      let { user, _userExist } = payload;

      if (!user) return false;

      if (isSignedOut) {
        yield put({ type: 'updateState', payload: { isSignedOut: false } });
      }

      if (!_userExist?.id) {

        const userProps = yield call(getUserProps, { user });

        /**
         * @type {{id, data: {roles}}}
         * @private
         */
        _userExist = yield call(manageUser, {
          uid: userProps.uid,
          emailVerified: userProps.emailVerified,
          metadata: { ...userProps.metadata }
        });
      }

      if (_userExist?.id) {

        yield put({ type: 'updateUserProfile', payload: { _userExist } });

      } else {
        // TODO (teamco): Show error.
      }
    },

    * handleUserProfile({ payload }, { call, put }) {
      const { userProps, invitedUserId, isOnRegisterWithPassword = false } = payload;

      /**
       * @type {{id, data: {roles}}}
       * @private
       */
      let _userExist = yield call(manageUser, { uid: userProps.uid });

      if (_userExist?.id) {

        yield put({ type: 'updateUserProfile', payload: { _userExist } });

      } else {

        let displayName = userProps?.displayName;
        let metadata = userProps?.metadata;
        let roles = [];

        if (invitedUserId) {
          const invitedUserRef = yield call(fbFindById, {
            collectionPath: 'invitedUsers',
            docName: invitedUserId
          });

          if (invitedUserRef.exists()) {
            const invitedUserData = invitedUserRef.data();

            displayName = invitedUserData?.name;
            roles = invitedUserData?.business?.roles;
            metadata.businessByRef = invitedUserData?.business?.id;
            metadata.invitedUserRef = invitedUserRef;
          }
        }

        // Create user
        _userExist = yield call(fbAdd, {
          collectionPath: 'users',
          data: { ...userProps, displayName, roles, metadata }
        });
      }

      if (_userExist?.id) {

        if (invitedUserId) {
          const profileByRef = yield call(fbFindById, {
            collectionPath: 'users',
            docName: _userExist.id
          });

          // Update invited user
          yield call(fbUpdate, {
            caller: 'handleUserProfile',
            collectionPath: 'invitedUsers',
            docName: invitedUserId,
            data: {
              status: STATUSES.active,
              'metadata.profileByRef': profileByRef
            }
          });
        }
      }

      isOnRegisterWithPassword && (yield put({ type: 'signOut' }));
    },

    /**
     * @function
     * @param {{
     *  registerData: {isBusinessUser: boolean},
     *  _userExist: {data, id: string, serverUserId: string, emailVerified: boolean}
     * }} payload
     * @param call
     * @param put
     * @return {Generator<*, void, *>}
     */
    * updateUserProfile({ payload = {} }, { call, put }) {
      const { _userExist } = payload;
      const _user = { ..._userExist.data, id: _userExist.id };

      const data = {
        ..._user,
        metadata: {
          ..._user?.metadata,
          // Avoid error 403
          photoURL: _user?.metadata?.photoURL
        },
        roles: [...(_user?.roles?.length ? _user?.roles : [DEFAULT_ROLE])]
      };

      // Update user
      yield call(fbUpdate, {
        caller: 'updateUserProfile',
        collectionPath: 'users',
        docName: _user.id,
        data
      });

      // Define user abilities
      yield put({ type: 'defineAbilities', payload: { user: data } });

      yield put({ type: 'appModel/notification' });

      yield call(handleUserSessionTimeout);
    },

    * registerData({ payload = {} }, { call, put }) {
      const { registerData, user } = payload;

      if (!user || !registerData) {
        // TODO (teamco): Show error.
        throw new Error('Registration data cannot be empty');
      }

      const {
        email,
        firstName,
        lastName
      } = registerData;

      const photoURL = yield call(gravatarUrl, { email });
      const displayName = `${firstName} ${lastName}`;

      yield call(sendVerificationEmail, {
        user: {
          uid: user.uid,
          metadata: { providerId: user.providerId }
        }
      });

      yield put({
        type: 'firebaseModel/updateAccountOnSignUpWithPassword',
        payload: { displayName, photoURL }
      });

      const _userProps = yield call(getUserProps, { user });
      const userProps = {
        ..._userProps,
        displayName,
        roles: [DEFAULT_ROLE],
        metadata: {
          ..._userProps.metadata,
          photoURL
        }
      };

      // Create profile only when it will be accessible (not offline)
      yield put({
        type: 'handleUserProfile',
        payload: {
          userProps,
          isOnRegisterWithPassword: true
        }
      });
    },

    * updateEmail({ payload }, { call, put }) {
      if (!payload.user) {
        return false;
      }

      const _userExist = yield call(manageUser, {
        uid: payload.user.uid,
        email: payload.email,
        metadata: { updatedAt: new Date }
      });

      if (_userExist.id) {
        const user = _userExist.data;

        // Update local user
        yield call(fbUpdate, {
          notice: true,
          caller: 'updateEmail',
          collectionPath: 'users',
          docName: _userExist.id,
          data: user
        });

        // Update fb user
        yield call(updateFbUserEmail, { email: payload.email });

        yield put({ type: 'updateState', payload: { user } });
        yield put({ type: 'defineAbilities', payload: { user } });
      }
    },

    * defineAbilities({ payload = {} }, { put }) {
      const { user, business } = payload;

      yield put({ type: 'defineRoles', payload: { user, business } });
    },

    * defineRoles({ payload = {} }, { call, put }) {
      const { user, business } = payload;

      const ability = yield call(defineAbilityFor, { user, business });

      yield put({ type: 'updateState', payload: { ability, user } });
    },

    * signOut({ payload = {} }, { call, put, select }) {
      const state = yield select(state => state[MODEL_NAME]);
      const { user = firebaseAppAuth?.currentUser } = payload;

      if (state.ability.cannot('access', 'logout')) {
        return yield put({ type: 'noPermissions', payload: { key: 'signOut' } });
      }

      if (user?.uid) {

        const _userExist = yield call(manageUser, {
          uid: user?.uid,
          metadata: {
            forceSignOut: false,
            signedIn: false,
            updatedAt: new Date
          }
        });

        if (_userExist.id) {
          yield call(fbUpdate, {
            caller: 'signOut',
            collectionPath: 'users',
            docName: _userExist.id,
            data: _userExist.data
          });

          if (state?.user?.uid === user?.uid || !state?.user) {

            // Handle force logout of the current user
            if (yield call(fbSignOut)) {
              yield put({ type: 'resetAuthState' });
            } else {

              // TODO (teamco): Do something.
              yield put({
                type: 'signOutLog',
                payload: {
                  fbSignOut: false,
                  error: 'Error during <SignOut>'
                }
              });
            }

          } else {

            // TODO (andrew.palkin): Handle force signed-out users.
            yield put({
              type: 'signOutLog',
              payload: {
                fbSignOut: false,
                error: 'TODO: Handle force signed-out users'
              }
            });
          }

        } else {

          yield put({
            type: 'signOutLog',
            payload: { fbSignOut: false, error: `<User> does not Exist` }
          });

          yield call(errorGetMsg, { instance: 'User' });
        }

      } else {

        yield put({
          type: 'notFound',
          payload: { entity: 'user', key: 'signOut' }
        });
      }
    },

    * signOutLog({ payload }, { put }) {
      const { fbSignOut, error } = payload;

      yield put({
        type: 'updateState',
        payload: { userSignOut: { fbSignOut, error } }
      });
    },

    * updateUserRoles({ payload }, { put, select }) {
      const { user, roles = [] } = payload;

      yield put({
        type: 'updateUserProfile',
        payload: { _userExist: { data: { ...user, roles }, id: user.id } }
      });
    },

    * resetAuthState(_, { put }) {
      yield put({ type: 'defineAbilities', payload: { user: null } });

      yield put({
        type: 'updateState',
        payload: {
          ...DEFAULT_STATE,
          isSignedOut: true
        }
      });

      yield put({
        type: 'firebaseModel/updateState',
        payload: { error: null, result: null, credential: null }
      });
    }
  },

  reducers: {}
});
