// Token utility functions
export const tokenUtils = {
  // Kiểm tra token có hết hạn không
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true; // Nếu không parse được thì coi như hết hạn
    }
  },

  // Lấy thời gian hết hạn của token
  getTokenExpiry: (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      return null;
    }
  },

  // Kiểm tra token có sắp hết hạn không (trong vòng 5 phút)
  isTokenExpiringSoon: (token: string, minutesBeforeExpiry: number = 5): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      const expiryTime = payload.exp;
      const timeUntilExpiry = expiryTime - currentTime;

      return timeUntilExpiry < minutesBeforeExpiry * 60;
    } catch (error) {
      return true;
    }
  },

  // Lấy thông tin user từ token
  getUserFromToken: (token: string): any => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      return null;
    }
  },

  // Kiểm tra token có hợp lệ không
  isValidToken: (token: string): boolean => {
    if (!token) return false;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
};
