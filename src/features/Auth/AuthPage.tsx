import { NAVIGATION_CONFIG } from "@/app/router/naviagtion.config";
import Login from "./components/Login";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "./components/slice/auth.selector";
import { useAppSelector } from "@/app/store";

const AuthPage = () => {
  // Sử dụng selector từ auth slice
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from");

  // Kiểm tra quyền admin
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  // Nếu đã đăng nhập và là admin thì chuyển hướng về trang ban đầu (nếu có), mặc định về Home
  // Nếu không phải admin, vẫn cho phép vào trang login để logout
  if (isAuthenticated && isAdmin) {
    return <Navigate to={from ?? NAVIGATION_CONFIG.homeConfiguration.path} replace />;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Login />
    </div>
  );
};

export default AuthPage;
