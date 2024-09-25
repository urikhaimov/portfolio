import { connect } from '@umijs/max';

import LandingSignup from './signup';

const MODEL_NAME='businessEmployeesModel'

export default connect(
    ({
       authModel,
       businessModel,
       businessEmployeesModel,
       landingModel,
       loading
     }) => ({
      authModel,
      businessModel,
      businessEmployeesModel,
      landingModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onPrepareInvitation(params) {
        dispatch({ type: `${MODEL_NAME}/prepareInvitation`, payload: { ...params } });
      },
      onConfirmInvitation(registerData) {
        // dispatch({ type: 'authModel/registerData', payload: { registerData } });
      }
    })
)(LandingSignup);
