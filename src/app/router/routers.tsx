import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { ROUTE } from "./routers.config";
import React from "react";
import { authMiddleware } from "./auth.middleware";
import AppShell from "@/AppShell";
import { LoaderFunction } from "react-router-dom";
import LoginLayout from "@/layout/LoginLayout";
import NotFound from "@/layout/NotFound";
import ExtensionLayout from "@/layout/ExtensionLayout";
import NotPermisstion from "@/layout/NotPermisstion";
import NotAuthorized from "@/layout/NotAuthorized";
// map layout name thành component layout tương ứng
const layoutMap = {
  main: MainLayout,
  login: LoginLayout,
  notFound: NotFound,
  extension: ExtensionLayout,
  notPermisstion: NotPermisstion,
  notAuthorized: NotAuthorized,
};

// gom các router theo layout trở thành nhánh trong router tree
const layoutRoutes: Record<string, RouteObject> = {};

/**
 * Duyệt qua từng router trong routers.config.tsx
 * Tạo nhánh trong router tree dựa trên layout của router
 * gắn authMiddleware vào router tương ứng
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
    loader: authMiddleware({ 
      requireAuth: options.requireAuth,
      requireAdmin: options.requireAdmin 
    }) as unknown as LoaderFunction,
  });
});

// Thêm 404 route chỉ một lần cho mỗi layout
Object.keys(layoutRoutes).forEach((layout) => {
  layoutRoutes[layout].children?.push({
    path: "*",
    element: <Navigate to="/not-found" replace />,
  });
});

/**
 * Gộp tất cả router lại dưới appshell
 * appshell được render 1 lần duy nhất
 * mỗi layout con sẽ nằm trong <Outlet /> của appshell
 */
const routers: RouteObject = {
  path: "/",
  element: <AppShell />,
  children: [
    ...Object.values(layoutRoutes),
    // Thêm route not-authorized (standalone, không cần layout)
    {
      path: "not-authorized",
      element: <NotAuthorized />,
      loader: authMiddleware({ requireAuth: false, requireAdmin: false }) as unknown as LoaderFunction,
    },
    // Thêm route not-found (standalone, không cần layout)
    {
      path: "not-found",
      element: <NotFound />,
      loader: authMiddleware({ requireAuth: false, requireAdmin: false }) as unknown as LoaderFunction,
    },
  ],
};

export const router = createBrowserRouter([routers]);
