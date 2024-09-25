import * as umi from '@umijs/max';

export default (props) => {
  const { Navigate, Outlet, useLocation } = umi;

  const { pathname } = useLocation();

  const isLoginPage = pathname.match('login');
  const isRegisterPage = pathname.match('register');

  let component = <Outlet/>;

  // if (currentUser) {
  //   if (isLoginPage) {
  // component = <Navigate to="/profile"/>;
  // }
  // } else if (isLoginPage || isRegisterPage) {
  // TODO: Do nothing.
  // } else {
  // component = <Navigate to={`/login?ref=${decodeURIComponent(pathname)}`}/>;
  // }

  return component;
}
