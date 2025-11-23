import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectHomeConfigurations,
  selectHomeConfigurationLoading,
} from "../slice/home-configuration.selector";
import { useHomeConfigurationActions } from "../hooks/useHomeConfigurationActions";
import Button from "@/foundation/components/buttons/Button";
import { Card } from "@/foundation/components/info/Card";
import ModalHomeConfiguration from "../components/ModalHomeConfiguration";
import ConfirmModal from "@/foundation/components/modal/ModalConfirm";
import { HomeConfiguration } from "@/core/api/home/type";
import Icon from "@/foundation/components/icons/Icon";
import { Edit, Trash2 } from "lucide-react";
import Chip from "@/foundation/components/info/Chip";
import Spinner from "@/foundation/components/feedback/Spinner";

const HomeConfigurationPage: React.FC = () => {
  const configurations = useAppSelector(selectHomeConfigurations);
  const isLoading = useAppSelector(selectHomeConfigurationLoading);
  const {
    fetchConfigurations,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
  } = useHomeConfigurationActions();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<HomeConfiguration | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedConfig(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (config: HomeConfiguration) => {
    setSelectedConfig(config);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteConfiguration({ id: pendingDeleteId });
    setIsDeleteModalOpen(false);
    setPendingDeleteId(null);
    setTimeout(() => {
      fetchConfigurations();
    }, 500);
  };

  const handleAddSubmit = (data: {
    mainBanners: any[];
    sideBanners: any[];
    features: any[];
    settings: {
      autoSlideInterval: number;
      showCounter: boolean;
      showDots: boolean;
    };
    isActive: boolean;
    displayType: string;
  }) => {
    createConfiguration(data);
    setIsAddModalOpen(false);
    setTimeout(() => {
      fetchConfigurations();
    }, 500);
  };

  const handleEditSubmit = (data: {
    mainBanners: any[];
    sideBanners: any[];
    features: any[];
    settings: {
      autoSlideInterval: number;
      showCounter: boolean;
      showDots: boolean;
    };
    isActive: boolean;
    displayType: string;
  }) => {
    if (!selectedConfig) return;
    updateConfiguration({ id: selectedConfig._id, data });
    setIsEditModalOpen(false);
    setSelectedConfig(null);
    setTimeout(() => {
      fetchConfigurations();
    }, 500);
  };

  return (
    <div className="p-6 min-h-screen bg-background-base">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-10">Quản lý cấu hình trang chủ</h1>
        <Button
          variant="outlined"
          icon={<Icon name="Plus" size="sm" />}
          onClick={handleAdd}
        >
          Tạo cấu hình mới
        </Button>
      </div>

      {/* Configurations List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : configurations.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-neutral-6 mb-4">Chưa có cấu hình nào</p>
          <Button variant="outlined" onClick={handleAdd}>
            Tạo cấu hình đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map((config) => (
            <Card key={config._id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-10">
                      Cấu hình {config.isActive && <Chip variant="primary" size="sm">Đang hoạt động</Chip>}
                    </h3>
                    <p className="text-sm text-neutral-6 mt-1">
                      {new Date(config.createdAt || "").toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-7">Banner chính:</span>
                    <span className="font-medium text-neutral-10">{config.mainBanners?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-7">Banner phụ (danh mục):</span>
                    <span className="font-medium text-neutral-10">{config.sideBanners?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-7">Tính năng:</span>
                    <span className="font-medium text-neutral-10">{config.features?.length || 0}</span>
                  </div>
                </div>

                {/* Preview Main Banners */}
                {config.mainBanners && config.mainBanners.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-7">Banner chính:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {config.mainBanners.slice(0, 2).map((banner, idx) => (
                        <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-divider-1">
                          {banner.image?.url && (
                            <img
                              src={banner.image.url}
                              alt={banner.title || `Banner ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview Side Banners (Categories) */}
                {config.sideBanners && config.sideBanners.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-7">Banner phụ (từ danh mục):</label>
                    <div className="grid grid-cols-2 gap-2">
                      {config.sideBanners.slice(0, 2).map((banner, idx) => {
                        const bannerImage = banner.image || banner.category?.image_Background;
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="aspect-[3/4] rounded-lg overflow-hidden border border-divider-1">
                              {bannerImage?.url ? (
                                <img
                                  src={bannerImage.url}
                                  alt={banner.category?.name || `Category ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral-2 flex items-center justify-center">
                                  <p className="text-xs text-neutral-6">Chưa có banner</p>
                                </div>
                              )}
                            </div>
                            {banner.category?.name && (
                              <p className="text-xs text-center text-neutral-7 truncate">
                                {banner.category.name}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-divider-1">
                  <Button
                    variant="outlined"
                    size="sm"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => handleEdit(config)}
                    className="flex-1"
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDelete(config._id)}
                    className="flex-1"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <ModalHomeConfiguration
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddSubmit}
        isLoading={isLoading}
      />

      <ModalHomeConfiguration
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={selectedConfig}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />

      <ConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa cấu hình này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default HomeConfigurationPage;

