import { Outlet } from "react-router-dom";

import { lazy } from "react";

//  sừ dụng lazy load để load component Sidebar
const Sidebar = lazy(() => import("@/widgets/app-bar/SideBar"));
const Header = lazy(() => import("@/widgets/header/Index"));
const MainLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="h-20 md:h-28 lg:h-32">
        <Header />
      </div>
      <div className="grid grid-cols-12 min-h-full">
        <div className="col-span-2 min-h-full md:col-span-3 lg:col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10 min-h-full md:col-span-9 lg:col-span-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
