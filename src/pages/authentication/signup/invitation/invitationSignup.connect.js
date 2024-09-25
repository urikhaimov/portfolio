import { connect } from '@umijs/max';

import InvitationSignup from './invitationSignup';

const MODEL_NAME = 'businessEmployeesModel';

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
      onConfirmInvitation(invitedUser, id) {
        dispatch({ type: `${MODEL_NAME}/confirmInvitation`, payload: { invitedUser, id } });
      }
    })
)(InvitationSignup);
