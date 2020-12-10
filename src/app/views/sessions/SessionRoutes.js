import JwtLogin from "./login/JwtLogin.jsx";
import NotFound from "./NotFound";
import JwtRegister from "./register/JwtRegister";
import Choose from "./Choose";

const sessionRoutes = [
  {
    path: "/session/signup",
    component: JwtRegister,
  },
  {
    path: "/session/signin",
    component: JwtLogin,
  },
  {
    path: "/session/404",
    component: NotFound,
  },
  {
    path: "/session/choose",
    component: Choose,
  },
];

export default sessionRoutes;
