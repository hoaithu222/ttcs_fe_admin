import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import LoginLayout from "@/layout/LoginLayout";
import ExtensionLayout from "@/layout/ExtensionLayout";
import { ROUTE } from "./routers.config";
import React from "react";
// import { authMiddleware } from "./auth.middleware";
import AppShell from "@/AppShell";
// map layout name thành component layout tuong ung
const layoutMap = {
  main: MainLayout,
  login: LoginLayout,
  extension: ExtensionLayout,
};
// gom các router theo layout trở thành nhánh trong router tree
const layoutRoutes: Record<string, RouteObject> = {};

/**
 *  Duyệt qua từng router trong routers.config.tsx
 *  Tạo nhánh trong router tree dựa trên layout của router
 *  Nếu router có layout là "main" thì thêm vào nhánh main
 *  Nếu router có layout là "login" thì thêm vào nhánh login
 *  Nếu router có layout là "extension" thì thêm vào nhánh extension
 * gắn authmiddleware vào router tương ứng
 */

Object.values(ROUTE).forEach((router) => {
  const { layout, path, element, options } = router;
  // nếu layout chưa được tạo, thì khởi tạo router cha cho router đó
  if (!layoutRoutes[layout]) {
    layoutRoutes[layout] = {
      element: React.createElement(layoutMap[layout as keyof typeof layoutMap]),
      children: [],
    };
  }
  // thêm router vào nhánh tương ứng
  layoutRoutes[layout].children?.push({
    path: path.replace(/^\//, ""),
    element,
    // loader: authMiddleware({ requireAuth: options.requireAuth }),
  });
  // Chuyển sang màn 404 nếu không tìm thấy router
  layoutRoutes[layout].children?.push({
    path: "*",
    element: <Navigate to="/404" />,
  });
});
/**
 * Gộp tất cả router lại dưới appshell
 * appshell được render 1 lần duy nhất
 * mỗi layout con sẽ nằm trong <Outlet /> của appshell
 *
 *
 */

const routers: RouteObject = {
  path: "/",
  element: <AppShell />,
  children: Object.values(layoutRoutes),
};

export const router = createBrowserRouter([routers]);
