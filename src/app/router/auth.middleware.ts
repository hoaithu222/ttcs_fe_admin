import { LoaderFunctionArgs, redirect } from "react-router-dom";

// Hàm decode JWT token đơn giản
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn("Error decoding JWT:", error);
    return null;
  }
};

export const authMiddleware = (options: { requireAuth: boolean; requireAdmin?: boolean }) => {
  return async ({ request }: LoaderFunctionArgs) => {
    const pathname = new URL(request.url).pathname;
    const isLoginPage = pathname.includes("/login");
    const isNotAuthorizedPage = pathname.includes("/not-authorized");
    const isNotFoundPage = pathname.includes("/not-found");

    try {
      // Kiểm tra tokens trước
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Nếu có tokens thì coi như đã authenticated
      const hasValidTokens = accessToken && refreshToken;

      // Lấy dữ liệu từ Redux persist store
      const persistData = localStorage.getItem("persist:root");
      let isAuthenticatedFromRedux = false;
      let userRole: string | null = null;

      if (persistData) {
        try {
          const parsedPersist = JSON.parse(persistData);
          const authData = parsedPersist.auth ? JSON.parse(parsedPersist.auth) : null;
          isAuthenticatedFromRedux = Boolean(authData?.isAuthenticated);
          
          // Lấy role từ user object, xử lý nhiều trường hợp
          const user = authData?.user;
          if (user && typeof user === 'object') {
            // Trường hợp 1: user là response object, cần lấy từ data.user.role (ưu tiên)
            if (user.data?.user?.role && typeof user.data.user.role === 'string') {
              userRole = user.data.user.role;
            }
            // Trường hợp 2: user là object trực tiếp có role
            else if (user.role && typeof user.role === 'string') {
              userRole = user.role;
            }
          }
        } catch (parseError) {
          console.warn("Error parsing persist data:", parseError);
        }
      }

      // Nếu không lấy được role từ Redux persist store, lấy từ localStorage
      if (!userRole) {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
          userRole = storedRole;
        }
      }

      // Nếu vẫn không có, thử decode từ JWT token (fallback)
      if (!userRole && accessToken) {
        try {
          const decodedToken = decodeJWT(accessToken);
          if (decodedToken?.role) {
            userRole = decodedToken.role;
          }
        } catch (error) {
          console.warn("Error decoding token for role:", error);
        }
      }

      // Xác định trạng thái authentication
      const isAuthenticated = hasValidTokens || isAuthenticatedFromRedux;
      
      // Kiểm tra quyền admin
      const isAdmin = userRole === "admin" || userRole === "moderator";

      console.log("Auth middleware check:", {
        pathname,
        isLoginPage,
        hasValidTokens,
        isAuthenticatedFromRedux,
        isAuthenticated,
        userRole,
        isAdmin,
        requireAuth: options.requireAuth,
        requireAdmin: options.requireAdmin,
      });

      // Nếu cần authentication nhưng chưa đăng nhập và không phải trang login/not-authorized/not-found
      if (options.requireAuth && !isAuthenticated && !isLoginPage && !isNotAuthorizedPage && !isNotFoundPage) {
        console.log("Redirecting to login - not authenticated");
        // Preserve intended destination so we can return after login
        return redirect(`/login?from=${encodeURIComponent(pathname)}`);
      }

      // Nếu cần quyền admin nhưng không phải admin và đã authenticated
      if (options.requireAdmin && isAuthenticated && !isAdmin && !isNotAuthorizedPage && !isNotFoundPage) {
        console.log("Redirecting to not-authorized - not admin");
        return redirect("/not-authorized");
      }

      // Nếu đã đăng nhập và là admin mà vào trang login thì redirect về home
      // Nếu không phải admin, vẫn cho phép vào login để logout
      if (isAuthenticated && isAdmin && isLoginPage) {
        console.log("Redirecting to home - already authenticated as admin");
        return redirect("/");
      }

      return null;
    } catch (error) {
      console.error("Auth middleware error:", error);

      // Nếu có lỗi và cần authentication
      if (options.requireAuth && !isLoginPage && !isNotAuthorizedPage && !isNotFoundPage) {
        return redirect("/login");
      }

      // Nếu có lỗi và cần admin
      if (options.requireAdmin && !isNotAuthorizedPage && !isNotFoundPage) {
        return redirect("/not-authorized");
      }

      return null;
    }
  };
};
