import * as config from './error.routes';

const { ERRORS } = config.default;

const MAIN_ROUTES = (mainPath = '') => {
  const mainErrors = ERRORS(mainPath);

  return {
    exact: false,
    path: `${mainPath}/`,
    component: '@/layouts/landing',
    routes: [
      {
        exact: true,
        path: `${mainPath}/`,
        component: '@/pages/home'
      },
      ...mainErrors
    ]
  };
};

export default { MAIN_ROUTES };