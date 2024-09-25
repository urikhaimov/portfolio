import { routes } from '../config/routes';

describe('Routes', () => {

  it('Routes amount', () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  /**
   * @const _routesIterator
   * @param {array} routes
   * @private
   */
  const _routesIterator = (routes = []) => {
    routes.forEach(route => {
      const {
        path,
        routes,
        component,
        redirect,
        breadcrumb
      } = route;

      if (routes) {
        expect(component.match(/@\/layouts/)).not.toBeNull();
        _routesIterator(routes);
      }

      it(`Validate routes: ${path}`, () => {

        expect(path).toBeDefined();
        expect(typeof path).toEqual('string');

        if (redirect) {
          expect(typeof redirect).toEqual('string');
        } else {
          expect(component).toBeDefined();
          expect(typeof component).toEqual('string');
        }

        if (breadcrumb) {
          expect(typeof breadcrumb).toEqual('string');
        }

        expect(route).toMatchSnapshot();
      });
    });
  };

  _routesIterator(routes);
});