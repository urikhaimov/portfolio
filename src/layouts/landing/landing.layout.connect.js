import { connect } from '@umijs/max';

import { LandingLayout } from './landing.layout';

const MODEL_NAME = 'appModel';

/**
 * @constant
 * @param appModel
 * @param authModel
 * @param notificationModel
 * @param loading
 * @return {{authModel, appModel, loading}}
 */
const mapStateToProps = ({ appModel, authModel, notificationModel, loading }) => ({
  appModel,
  authModel,
  notificationModel,
  loading
});

/**
 * @constant
 * @param dispatch
 * @return {{onUpdateDocumentMeta(*): void, dispatch, onDefineAbilities(): void, onNotification(): void}}
 */
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  onInitLayout() {
    dispatch({ type: `${MODEL_NAME}/updateState`, payload: { layout: { header: true, footer: true } } });
  },
  onToggleTheme() {
    dispatch({ type: `${MODEL_NAME}/toggleTheme` });
  },
  onNotification() {
    dispatch({ type: 'notificationModel/refreshNotification' });
  },
  onUpdateDocumentMeta(meta) {
    dispatch({ type: `${MODEL_NAME}/updateDocumentMeta`, payload: { meta } });
  },
  onHandleMessageApi(messageApi, intl) {
    dispatch({ type: `${MODEL_NAME}/handleMessageApi`, payload: { messageApi, intl } });
  },
  onHandleNotificationApi(notificationApi) {
    dispatch({ type: `${MODEL_NAME}/handleNotificationApi`, payload: { notificationApi, dispatch } });
  },
  onHandleModalApi(modalApi) {
    dispatch({ type: `${MODEL_NAME}/handleModalApi`, payload: { modalApi } });
  },
  onUpdateMessages(translateMessages) {
    dispatch({ type: `${MODEL_NAME}/updateMessages`, payload: { translateMessages, MODEL_NAME } });
  },
  onOnline(isOnline) {
    dispatch({ type: `${MODEL_NAME}/handleOnline`, payload: { isOnline } });
  },
  onSignIn(user) {
    dispatch({ type: 'authModel/signIn', payload: { user } });
  },
  onSignOut() {
    dispatch({ type: 'authModel/signOut' });
  },
  onRefreshSignIn() {
    dispatch({ type: `firebaseModel/refreshSignIn` });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingLayout);
