/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { commonModel } from '@/models/common.model';
import { monitorHistory } from '@/utils/history';

const MODEL_NAME = 'landingModel';

const DEFAULT_STATE = {
  data: {},
  topUnder: 160,
  header: {
    title: 'Error Mgr',
    position: 'fixed',
    visible: false
  },
  locale: {
    current: 'en-US',
    list: ['en-US']
  }
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: { ...DEFAULT_STATE },

  subscriptions: {

    setupHistory({ history, dispatch }) {
      return monitorHistory({ history, dispatch }, MODEL_NAME);
    },

    setup({ dispatch }) {
      dispatch({ type: 'query' });
    }
  },

  effects: {

    * query({ payload }, { call, put, select }) {
      // TODO: Write code here.
    }
  },

  reducers: {}
});
