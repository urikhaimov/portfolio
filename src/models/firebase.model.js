/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  deleteUser
} from 'firebase/auth';
import {
  useGoogleAuthRedirect,
  useGoogleAuthPopup
} from '@/services/providers/google.provider';
import { firebaseAppAuth } from '@/services/firebase.service';
import { useDispatcher } from '@/services/common.service';

const DEFAULT_STATE = {
  error: null,
  result: null,
  credential: null
};

const MODEL_NAME = 'firebaseModel';

/**
 * @export
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
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * updateCredentials({ payload }, { put }) {
      yield put({ type: 'updateState', payload });
    },

    * deleteUserAccount({ payload }, { put }) {
      const { user } = payload;

      deleteUser(user).then((x, y, z) => {
        // User deleted.
        // TODO (teamco): Do something.
      }).catch((error) => {
        // An error occurred
        // TODO (teamco): Do something.
        console.error(error);
      });

      // TODO (teamco): Clean fb user data/profile, server profile dependencies.
    },

    * updateAccountOnSignUpWithPassword({ payload }, { put }) {
      const { displayName, photoURL } = payload;

      updateProfile(firebaseAppAuth.currentUser, {
        displayName,
        photoURL
      }).then(() => {
        // Profile updated!
        // TODO (teamco): Do something.
      }).catch((error) => {
        // An error occurred
        // TODO (teamco): Do something.
        console.error(error);
      });
    },

    * updateAccountEmail({ payload }, { put }) {
      const { email } = payload;

      updateEmail(firebaseAppAuth.currentUser, email).then(() => {
        // Email updated!
        // TODO (teamco): Do something.
      }).catch((error) => {
        // An error occurred
        // TODO (teamco): Do something.
        console.error(error);
      });
    },

    * signInWithGoogle({ payload = {} }, { call, put }) {
      const { popup = false } = payload;

      const authResult = yield call(popup ?
          useGoogleAuthPopup :
          useGoogleAuthRedirect
      );

      yield put({ type: 'updateCredentials', payload: { ...authResult } });

      if (authResult?.error) return false;
  
      // Create profile only when it will be accessible (not offline)
      yield put({ type: 'authModel/handleUserProfile', payload: { userProps } });
    },

    * refreshSignIn({ payload = {} }, { select }) {
      const authState = yield select(state => state.authModel);

      onAuthStateChanged(firebaseAppAuth, user => {
        const dispatch = useDispatcher();

        if (user) {
          if (authState.user) {
            // TODO (teamco): Do something.
          } else {
            dispatch({ type: 'authModel/signIn', payload: { user } });
          }

          dispatch({
            type: 'authModel/updateState',
            payload: { fbUserValidated: true }
          });

        } else {
          // TODO (teamco): Do something.
        }
      });
    }
  },

  reducers: {}
});
