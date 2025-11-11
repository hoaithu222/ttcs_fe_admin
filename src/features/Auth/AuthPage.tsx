import { NAVIGATION_CONFIG } from "@/app/router/naviagtion.config";
import Login from "./components/Login";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "./components/slice/auth.selector";
import { useAppSelector } from "@/app/store";

const AuthPage = () => {
  // Sử dụng selector từ auth slice
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from");

  // Nếu đã đăng nhập thì chuyển hướng về trang ban đầu (nếu có), mặc định về Home
  if (isAuthenticated) {
    return <Navigate to={from ?? NAVIGATION_CONFIG.home.path} replace />;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Login />
    </div>
  );
};

export default AuthPage;
