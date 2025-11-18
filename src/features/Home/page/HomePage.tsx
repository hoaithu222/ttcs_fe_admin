import React, { useEffect } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectHomeCategories,
  selectBestSellerProducts,
  selectBestShops,
  selectFlashSaleProducts,
  selectHomeLoading,
} from "../slice/home.selector";
import { useHomeActions } from "../hooks/useHomeActions";
import { Card } from "@/foundation/components/info/Card";
import { Package, ShoppingBag, TrendingUp, Zap } from "lucide-react";

const HomePage: React.FC = () => {
  const categories = useAppSelector(selectHomeCategories);
  const bestSellerProducts = useAppSelector(selectBestSellerProducts);
  const bestShops = useAppSelector(selectBestShops);
  const flashSaleProducts = useAppSelector(selectFlashSaleProducts);
  const isLoading = useAppSelector(selectHomeLoading);
  const { fetchHomeData } = useHomeActions();

  useEffect(() => {
    fetchHomeData({ page: 1, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 min-h-screen bg-background-base">
      <h1 className="text-3xl font-bold mb-6 text-neutral-10">Trang chủ quản trị</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Danh mục</h3>
              <p className="text-2xl font-bold text-primary-6">{categories.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Sản phẩm bán chạy</h3>
              <p className="text-2xl font-bold text-primary-6">{bestSellerProducts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Cửa hàng tốt nhất</h3>
              <p className="text-2xl font-bold text-primary-6">{bestShops.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Flash Sale</h3>
              <p className="text-2xl font-bold text-primary-6">{flashSaleProducts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-neutral-10">Danh mục nổi bật</h2>
          {isLoading ? (
            <p className="text-neutral-6">Đang tải...</p>
          ) : categories.length > 0 ? (
            <div className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <div key={category._id} className="p-3 bg-neutral-2 rounded-lg">
                  <p className="font-medium text-neutral-10">{category.name}</p>
                  {category.description && (
                    <p className="text-sm text-neutral-6">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-6">Chưa có danh mục nào</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-neutral-10">Sản phẩm bán chạy</h2>
          {isLoading ? (
            <p className="text-neutral-6">Đang tải...</p>
          ) : bestSellerProducts.length > 0 ? (
            <div className="space-y-2">
              {bestSellerProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="p-3 bg-neutral-2 rounded-lg">
                  <p className="font-medium text-neutral-10">{product.name}</p>
                  <p className="text-sm text-primary-6">
                    {product.finalPrice.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-6">Chưa có sản phẩm nào</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HomePage;

