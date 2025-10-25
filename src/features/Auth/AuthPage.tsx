import { NAVIGATION_CONFIG } from "@/app/router/naviagtion.config";
import Login from "./components/Login";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "./components/slice/auth.selector";
import { useAppSelector } from "@/app/store";

const AuthPage = () => {
  // Sử dụng selector từ auth slice
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Nếu đã đăng nhập thì chuyển hướng đến trang chủ
  if (isAuthenticated) {
    return <Navigate to={NAVIGATION_CONFIG.home.path} />;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Login />
    </div>
  );
};

export default AuthPage;
