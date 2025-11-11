import { LoaderFunctionArgs, redirect } from "react-router-dom";

export const authMiddleware = (options: { requireAuth: boolean }) => {
  return async ({ request }: LoaderFunctionArgs) => {
    const pathname = new URL(request.url).pathname;
    const isLoginPage = pathname.includes("/login");

    try {
      // Kiểm tra tokens trước
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Nếu có tokens thì coi như đã authenticated
      const hasValidTokens = accessToken && refreshToken;

      // Lấy dữ liệu từ Redux persist store
      const persistData = localStorage.getItem("persist:root");
      let isAuthenticatedFromRedux = false;

      if (persistData) {
        try {
          const parsedPersist = JSON.parse(persistData);
          const authData = parsedPersist.auth ? JSON.parse(parsedPersist.auth) : null;
          isAuthenticatedFromRedux = Boolean(authData?.isAuthenticated);
        } catch (parseError) {
          console.warn("Error parsing persist data:", parseError);
        }
      }

      // Xác định trạng thái authentication
      const isAuthenticated = hasValidTokens || isAuthenticatedFromRedux;

      console.log("Auth middleware check:", {
        pathname,
        isLoginPage,
        hasValidTokens,
        isAuthenticatedFromRedux,
        isAuthenticated,
        requireAuth: options.requireAuth,
      });

      // Nếu cần authentication nhưng chưa đăng nhập và không phải trang login
      if (options.requireAuth && !isAuthenticated && !isLoginPage) {
        console.log("Redirecting to login - not authenticated");
        // Preserve intended destination so we can return after login
        return redirect(`/login?from=${encodeURIComponent(pathname)}`);
      }

      // Nếu đã đăng nhập mà vào trang login thì redirect về home
      if (isAuthenticated && isLoginPage) {
        console.log("Redirecting to home - already authenticated");
        return redirect("/");
      }

      return null;
    } catch (error) {
      console.error("Auth middleware error:", error);

      // Nếu có lỗi và cần authentication
      if (options.requireAuth && !isLoginPage) {
        return redirect("/login");
      }

      return null;
    }
  };
};
