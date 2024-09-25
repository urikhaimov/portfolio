import { RUNTIME_CONFIG } from '@/services/config/runtime.config';

/**
 * @export
 * @param {{ history, dispatch }} setup
 * @param {string} [eventType]
 * @param {number} [duration]
 */
export const monitorHistory = (setup, eventType = 'Navigation', duration = 0) => {
  const { history, dispatch } = setup;

  return history.listen(data => {
    // In case of route replace
    const location = data.pathname ? { ...data } : { ...data.location };

    Object.keys(location).forEach(key => {
      if (typeof location[key] === 'undefined') {
        location[key] = '';
      }
    });

    const skipOnRoute = [
      `/${RUNTIME_CONFIG.ADMIN_NS}/logs`,
      `/${RUNTIME_CONFIG.ADMIN_NS}/errors`
    ];

    const shouldMonitor = skipOnRoute.indexOf(location.pathname) === -1;

    dispatch({ type: 'profileModel/updateActionBtns', payload: { actionBtns: {} } });

    dispatch({ type: 'updateState', payload: { location } });

    shouldMonitor && dispatch({
      type: 'userLogModel/monitor',
      payload: {
        eventType,
        location,
        duration
      }
    });
  });
};
