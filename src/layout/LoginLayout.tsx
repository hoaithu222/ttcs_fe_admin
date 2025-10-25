import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Outlet />
    </div>
  );
};

export default LoginLayout;
