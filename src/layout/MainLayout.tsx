import { Outlet } from "react-router-dom";

import { lazy } from "react";

//  sừ dụng lazy load để load component Sidebar
const Sidebar = lazy(() => import("@/widgets/app-bar/SideBar"));
const Header = lazy(() => import("@/widgets/header/Index"));
const MainLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="grid grid-cols-12 flex-1 min-h-0 overflow-hidden">
        <div className="col-span-2 md:col-span-3 lg:col-span-2 overflow-hidden">
          <Sidebar />
        </div>
        <div className="col-span-10 md:col-span-9 lg:col-span-10 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
