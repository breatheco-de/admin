import JwtLogin from './login/JwtLogin';
import NotFound from './notfound';
import JwtRegister from './register/JwtRegister';
import Choose from './choose';

const sessionRoutes = [
  {
    path: '/session/signup',
    component: JwtRegister,
  },
  {
    path: '/session/signin',
    component: JwtLogin,
  },
  {
    path: '/session/404',
    component: NotFound,
  },
  {
    path: '/session/choose',
    component: Choose,
  },
];

export default sessionRoutes;
