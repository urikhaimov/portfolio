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
        path: `${mainPath}/`,
        redirect: `${mainPath}/about`
      },
      {
        exact: true,
        path: `${mainPath}/about`,
        component: '@/pages/home/about'
      },
      {
        exact: true,
        path: `${mainPath}/experience`,
        component: '@/pages/home/experience'
      },
      {
        exact: true,
        path: `${mainPath}/patents`,
        component: '@/pages/home/patents'
      },
      ...mainErrors
    ]
  };
};

export default { MAIN_ROUTES };