import { green, cyan } from 'colors';

import * as config from './routes/main.routes';

const { MAIN_ROUTES } = config.default;
const { NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';

const mainRoutes = MAIN_ROUTES();

function routesList() {
  console.log('\n\n==== ROUTES =====\n');
  mainRoutes.routes.forEach(route => {
    console.log(green(route.path), '=>', cyan(route.component));
  });
  console.log('\n==== /ROUTES =====\n\n');
}

isDevelopment && routesList();

export const routes = [mainRoutes];
