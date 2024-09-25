import { connect } from '@umijs/max';

import { Home } from './home';

const MODEL_NAME = 'homeModel';

export default connect(
    ({ appModel, authModel, pageModel, loading }) => ({ appModel, authModel, pageModel, loading }),
    (dispatch) => ({
      dispatch
    })
)(Home);