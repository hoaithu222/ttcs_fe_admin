import React, { useRef } from "react";
import Modal from "@/foundation/components/modal/Modal";
import HomeConfigurationForm, { HomeConfigurationFormRef } from "./HomeConfigurationForm";
import { HomeConfiguration } from "@/core/api/home/type";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { InfoIcon, EditIcon } from "lucide-react";

interface ModalHomeConfigurationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: HomeConfiguration | null;
  onSubmit: (data: {
    mainBanners: any[];
    sideBanners: any[];
    features: any[];
    settings: {
      autoSlideInterval: number;
      showCounter: boolean;
      showDots: boolean;
    };
    isActive: boolean;
  }) => void;
  isLoading?: boolean;
}

const ModalHomeConfiguration: React.FC<ModalHomeConfigurationProps> = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const formSubmitRef = useRef<HomeConfigurationFormRef>(null);

  const handleSubmit = () => {
    if (formSubmitRef.current) {
      formSubmitRef.current.submit();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleFormSubmit = (data: {
    mainBanners: any[];
    sideBanners: any[];
    features: any[];
    settings: {
      autoSlideInterval: number;
      showCounter: boolean;
      showDots: boolean;
    };
    isActive: boolean;
  }) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="3xl"
      title={
        <div className="flex gap-3 items-center">
          <IconCircleWrapper size={initialData ? "lg" : "md"} color="info">
            {initialData ? (
              <EditIcon className="text-info" />
            ) : (
              <InfoIcon className="text-blue-500 dark:text-white" />
            )}
          </IconCircleWrapper>
          <div>
            <h2 className="text-xl font-bold text-neutral-9">
              {initialData ? "Chỉnh sửa cấu hình trang chủ" : "Tạo cấu hình trang chủ mới"}
            </h2>
            <p className="text-sm text-neutral-6 mt-0.5">
              {initialData
                ? "Cập nhật thông tin cấu hình trang chủ"
                : "Nhập thông tin để tạo cấu hình trang chủ mới"}
            </p>
          </div>
        </div>
      }
      onConfirm={handleSubmit}
      onCancel={handleCancel}
      hideFooter={false}
      testId={initialData ? "modal-edit-home-config" : "modal-add-home-config"}
      closeText="Hủy"
      confirmText={initialData ? "Cập nhật" : "Tạo mới"}
      className="duration-200 animate-in fade-in-0 zoom-in-95"
      titleClassName="!text-2xl"
      headerPadding="pb-8"
      disabled={isLoading}
    >
      <HomeConfigurationForm
        ref={formSubmitRef}
        initialData={initialData || null}
        onSubmit={handleFormSubmit}
      />
    </Modal>
  );
};

export default ModalHomeConfiguration;

