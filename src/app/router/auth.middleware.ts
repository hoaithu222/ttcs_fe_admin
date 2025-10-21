import { Navigate } from "react-router-dom";

export const authMiddleware = (options: { requireAuth: boolean }) => {
  return async (params: { pathname: string }) => {
    const { pathname } = params;
    const isLoginPage = pathname.includes("/login");
    const isAuthenticated = false;
    // if (options.requireAuth && !isAuthenticated && !isLoginPage) {
    //   return <Navigate to="/login" />;
    // }
    // if (isAuthenticated && isLoginPage) {
    //   return <Navigate to="/" />;
    // }
    return null;
  };
};
