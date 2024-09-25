import { connect } from '@umijs/max';

import LandingLogin from './login';

const MODEL_NAME = 'firebaseModel';

export default connect(
    ({
       authModel,
       firebaseModel,
       loading
     }) => ({
      authModel,
      firebaseModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignIn(user) {
        dispatch({ type: 'authModel/signIn', payload: { user } });
      },
      onSignInWithGoogle(popup = true) {
        dispatch({
          type: `${MODEL_NAME}/signInWithGoogle`,
          payload: { popup }
        });
      }
    })
)(LandingLogin);
