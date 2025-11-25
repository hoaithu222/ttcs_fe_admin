import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import TextArea from "@/foundation/components/input/TextArea";
import ImageBannerUpdate from "@/foundation/components/input/upload/ImageBannerUpload";
import ImageUploadMulti from "@/foundation/components/input/upload/ImageUploadMulti";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import { CreateCategoryPayload } from "../slice/category.type";
import { useAppDispatch } from "@/app/store";
import { createCategoryStart } from "../slice/category.slice";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { imagesApi } from "@/core/api/images";
import AlertMessage from "@/foundation/components/info/AlertMessage";
import { InfoIcon } from "lucide-react";
import ImageIconUpload from "@/foundation/components/input/upload/ImageIconUpload";
import AiCategoryDescriptionGenerator from "@/foundation/components/ai/AiCategoryDescriptionGenerator";
interface ModalAddCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalAddCategory: React.FC<ModalAddCategoryProps> = ({ open, onOpenChange }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    name: "",
    description: "",
    isActive: true,
    order_display: 0,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});
  const [imageIcon, setImageIcon] = useState<{ url: string; publicId?: string } | null>(null);
  const [bannerImage, setBannerImage] = useState<{ url: string; publicId?: string } | null>(null);
  const [galleryImages, setGalleryImages] = useState<Array<{
    url: string;
    publicId?: string;
  }> | null>(null);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setErrors({ name: "Tên danh mục là bắt buộc" });
      return;
    }

    // Add images and image_Icon to formData if uploaded
    const submitData = {
      ...formData,
      ...(galleryImages && galleryImages.length > 0 && { image: galleryImages }),
      ...(imageIcon && { image_Icon: imageIcon }),
      ...(bannerImage && { image_Background: bannerImage }),
    };

    dispatch(createCategoryStart(submitData));
    handleClose();
  };

  const handleImageUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setImageIcon(uploadResult);
    return uploadResult;
  };

  const handleBannerUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setBannerImage(uploadResult);
    return uploadResult;
  };

  const handleGalleryUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    return { url: result.url, publicId: result.publicId };
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", isActive: true, order_display: 0 });
    setErrors({});
    setImageIcon(null);
    setBannerImage(null);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="3xl"
      title={
        <div className="flex gap-3 items-center">
          <IconCircleWrapper size="md" color="info">
            <InfoIcon className="text-blue-500 dark:text-white" />
          </IconCircleWrapper>
          <div>
            <h2 className="text-xl font-bold text-neutral-9">Thêm danh mục mới</h2>
            <p className="text-sm text-neutral-6 mt-0.5">Nhập thông tin danh mục để thêm mới</p>
          </div>
        </div>
      }
      onConfirm={handleSubmit}
      onCancel={handleClose}
      hideFooter={false}
      testId="modal-add-category"
      closeText="Hủy"
      confirmText="Thêm danh mục"
      className="duration-200 animate-in fade-in-0 zoom-in-95"
      titleClassName="!text-2xl"
      headerPadding="pb-8"
    >
      <Form.Root>
        <ScrollView className="h-[500px]" hideScrollbarY={false}>
          <div className="space-y-6 p-0.5">
            {/* <div className="p-4 mb-2 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex gap-3 items-start">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">Thông tin quan trọng</p>
                <p className="mt-1 text-xs text-blue-700">
                  Tên danh mục là bắt buộc và sẽ được hiển thị trên hệ thống.
                </p>
              </div>
            </div>
          </div> */}

            <AlertMessage
              type="info"
              title="Thông tin quan trọng"
              message="Tên danh mục là bắt buộc và sẽ được hiển thị trên hệ thống."
            />

            <Input
              name="name"
              label="Tên danh mục"
              placeholder="Ví dụ: Điện tử, Quần áo, Thực phẩm..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
              className="transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500"
            />

            <div className="space-y-2">
              <AiCategoryDescriptionGenerator
                onGenerate={(description) => {
                  setFormData({ ...formData, description });
                }}
                categoryName={formData.name}
                language="vi"
                className="mb-2"
              />
              <TextArea
                name="description"
                label="Mô tả"
                placeholder="Nhập mô tả chi tiết về danh mục này hoặc nhấn nút AI để tạo tự động..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500"
              />
            </div>
            {/* Icon image */}
            <ImageIconUpload
              value={imageIcon}
              onChange={setImageIcon}
              onUpload={handleImageUpload}
              label="Icon danh mục (tối đa 5MB)"
              maxSizeInMB={5}
              testId="category-icon-upload"
            />

            <ImageUploadMulti
              value={galleryImages}
              onChange={setGalleryImages}
              onUpload={handleGalleryUpload}
              label="Bộ sưu tập ảnh danh mục (nhiều ảnh)"
              maxFiles={10}
              maxSizeInMB={8}
            />

            <ImageBannerUpdate
              value={bannerImage}
              onChange={setBannerImage}
              onUpload={handleBannerUpload}
              label="Banner danh mục (khuyến nghị 2100x900px)"
              aspectRatio="banner"
              maxSizeInMB={8}
              testId="category-banner-upload"
            />
          </div>
        </ScrollView>
      </Form.Root>
    </Modal>
  );
};

export default ModalAddCategory;
