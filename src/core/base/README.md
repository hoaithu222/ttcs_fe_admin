# Base HTTP Client với Refresh Token

## Tổng quan

Cấu hình base HTTP client đã được tối ưu hóa với đầy đủ tính năng refresh token tự động và tuân thủ Swagger API documentation. Hệ thống sẽ tự động:

- Thêm access token vào mọi request
- Phát hiện khi token hết hạn (401 error)
- Tự động refresh token khi cần thiết
- Retry request gốc với token mới
- Xử lý queue các request khi đang refresh
- Redirect về login khi refresh thất bại

## Cấu trúc API

### Authentication APIs

- `POST /auth/register` - Đăng ký tài khoản mới
- `GET /auth/verify-email` - Xác thực email bằng token
- `POST /auth/resend-verify-email` - Gửi lại email xác thực
- `POST /auth/login` - Đăng nhập bằng email/password
- `POST /auth/forgot-password` - Yêu cầu reset password
- `POST /auth/reset-password` - Đặt lại password với token + OTP
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh access token

### OTP APIs

- `POST /otp/request` - Yêu cầu mã OTP
- `POST /otp/verify` - Xác thực mã OTP

### Social Authentication APIs

- `GET /auth/social/google` - Google OAuth login
- `GET /auth/social/google/callback` - Google OAuth callback
- `GET /auth/social/facebook` - Facebook OAuth login
- `GET /auth/social/facebook/callback` - Facebook OAuth callback
- `GET /auth/social/github` - GitHub OAuth login
- `GET /auth/social/github/callback` - GitHub OAuth callback

### Products APIs

- `GET /products` - Danh sách sản phẩm với query parameters
- `POST /products` - Tạo sản phẩm mới
- `GET /products/:id` - Xem chi tiết sản phẩm
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm
- `GET /products/search` - Tìm kiếm sản phẩm
- `GET /products/categories` - Danh sách danh mục
- `GET /products/subcategories` - Danh sách danh mục con
- `GET /products/shops` - Danh sách cửa hàng

## Sử dụng

### 1. Import HTTP Client

```typescript
import {
  VpsHttpClient,
  tokenStorage,
  authApi,
  otpApi,
  socialAuthApi,
  productsApi,
} from "@/core/base";
```

### 2. Tạo HTTP Client Instance

```typescript
class ApiService extends VpsHttpClient {
  constructor() {
    super("http://localhost:3000/api");
  }
}

const apiService = new ApiService();
```

### 3. Sử dụng Auth API

```typescript
// Register
const registerResponse = await authApi.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
});

// Login
const loginResponse = await authApi.login({
  email: "john@example.com",
  password: "password123",
});

// Verify email
await authApi.verifyEmail("verification-token");

// Forgot password
await authApi.forgotPassword({ email: "john@example.com" });

// Reset password
await authApi.resetPassword({
  token: "reset-token",
  password: "newPassword123",
  confirmPassword: "newPassword123",
  identifier: "john@example.com",
  otp: "123456",
});
```

### 4. Sử dụng OTP API

```typescript
// Request OTP
await otpApi.request({
  identifier: "john@example.com",
  channel: "email",
  purpose: "login",
});

// Verify OTP
await otpApi.verify({
  identifier: "john@example.com",
  code: "123456",
  purpose: "login",
});
```

### 5. Sử dụng Social Auth

```typescript
// Google OAuth
const googleLoginUrl = socialAuthApi.google.login();
window.location.href = googleLoginUrl;

// Handle callback (usually done by backend redirect)
const googleCallback = await socialAuthApi.google.callback();

// Facebook OAuth
const facebookLoginUrl = socialAuthApi.facebook.login();
window.location.href = facebookLoginUrl;

// GitHub OAuth
const githubLoginUrl = socialAuthApi.github.login();
window.location.href = githubLoginUrl;
```

### 6. Sử dụng Products API

```typescript
// Lấy danh sách sản phẩm với query parameters
const products = await productsApi.getProducts({
  page: 1,
  limit: 20,
  categoryId: "category-id",
  minPrice: 100,
  maxPrice: 1000,
  sortBy: "price",
  sortOrder: "asc",
});

// Lấy chi tiết sản phẩm
const product = await productsApi.getProduct("product-id");

// Tạo sản phẩm mới
const newProduct = await productsApi.createProduct({
  name: "iPhone 15",
  description: "Latest iPhone model",
  images: ["image1.jpg", "image2.jpg"],
  shopId: "shop-id",
  subCategoryId: "subcategory-id",
  categoryId: "category-id",
  price: 999,
  discount: 50,
  stock: 100,
  warrantyInfo: "1 year warranty",
  weight: 0.2,
  dimensions: "15x7x0.8 cm",
  metaKeywords: "iphone, smartphone, apple",
  isActive: true,
});

// Cập nhật sản phẩm
const updatedProduct = await productsApi.updateProduct("product-id", {
  name: "iPhone 15 Pro",
  price: 1199,
  stock: 50,
});

// Xóa sản phẩm
await productsApi.deleteProduct("product-id");

// Tìm kiếm sản phẩm
const searchResults = await productsApi.searchProducts("iphone", {
  categoryId: "electronics",
  minPrice: 500,
});

// Lấy danh mục
const categories = await productsApi.getCategories();

// Lấy danh mục con
const subcategories = await productsApi.getSubcategories("category-id");

// Lấy danh sách cửa hàng
const shops = await productsApi.getShops();
```

### 7. Token Storage

```typescript
import { tokenStorage } from "@/core/base";

// Lưu tokens
tokenStorage.setTokens(accessToken, refreshToken);

// Lấy tokens
const accessToken = tokenStorage.getAccessToken();
const refreshToken = tokenStorage.getRefreshToken();

// Xóa tokens
tokenStorage.clearTokens();
```

## Response Structure

Tất cả API responses tuân theo cấu trúc chuẩn:

```typescript
interface ApiSuccess<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  timestamp: string;
  code: number;
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
  path: string;
  method: string;
  code: number;
}
```

## Tính năng chính

- **Request Interceptor**: Tự động thêm Bearer token
- **Response Interceptor**: Xử lý refresh token tự động
- **Queue Management**: Xử lý multiple requests khi refresh
- **Error Handling**: Xử lý lỗi và retry logic
- **Token Management**: Lưu trữ và quản lý tokens
- **OTP Support**: Hỗ trợ xác thực OTP
- **Social Auth**: Hỗ trợ đăng nhập qua Google, Facebook, GitHub
- **Products Management**: CRUD operations cho sản phẩm với query parameters
- **Search & Filter**: Tìm kiếm và lọc sản phẩm theo nhiều tiêu chí
- **Categories & Shops**: Quản lý danh mục và cửa hàng
