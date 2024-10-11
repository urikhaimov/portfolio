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
        path: `${mainPath}/portfolio`,
        redirect: `${mainPath}/portfolio/about`
      },
      {
        exact: true,
        path: `${mainPath}/portfolio/about`,
        component: '@/pages/home/about'
      },
      {
        exact: true,
        path: `${mainPath}/portfolio/experience`,
        component: '@/pages/home/experience'
      },
     
      ...mainErrors
    ]
  };
};

export default { MAIN_ROUTES };