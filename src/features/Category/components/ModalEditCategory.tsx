import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import TextArea from "@/foundation/components/input/TextArea";
import ImageUpload from "@/foundation/components/input/ImageUpload";
import { UpdateCategoryPayload } from "../slice/category.type";
import { useAppDispatch } from "@/app/store";
import { updateCategoryStart } from "../slice/category.slice";
import { Category } from "@/core/api/categories/type";
import { imagesApi } from "@/core/api/images";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import Icon from "@/foundation/components/icons/Icon";

interface ModalEditCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

const ModalEditCategory: React.FC<ModalEditCategoryProps> = ({ open, onOpenChange, category }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<UpdateCategoryPayload>({
    id: "",
    data: {
      name: "",
      description: "",
      isActive: true,
      order_display: 0,
    },
  });

  const [errors, setErrors] = useState<{ name?: string }>({});
  const [imageIcon, setImageIcon] = useState<{ url: string; publicId?: string } | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        id: category._id,
        data: {
          name: category.name,
          description: category.description,
          isActive: category.isActive,
          order_display: category.order_display,
        },
      });
      // Set image icon if exists
      if (category.image_Icon) {
        setImageIcon({
          url: category.image_Icon.url,
          publicId: category.image_Icon.publicId,
        });
      }
    }
  }, [category]);

  const handleSubmit = () => {
    if (!formData.data.name?.trim()) {
      setErrors({ name: "Tên danh mục là bắt buộc" });
      return;
    }

    // Add image_Icon to formData if uploaded
    const submitData = {
      ...formData,
      data: {
        ...formData.data,
        ...(imageIcon && { image_Icon: imageIcon }),
      },
    };

    dispatch(updateCategoryStart(submitData));
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

  const handleClose = () => {
    setErrors({});
    setImageIcon(null);
    onOpenChange(false);
  };

  if (!category) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="3xl"
      title={
        <div className="flex gap-3 items-center">
          <IconCircleWrapper
            size="lg"
            color="primary"
            glow={true}
            hoverEffect="lift"
            shadowSize="lg"
          >
            <Icon name="Pencil" size="md" color="primary" />
          </IconCircleWrapper>
          <div>
            <h2 className="text-xl font-bold text-neutral-9">Chỉnh sửa danh mục</h2>
            <p className="text-sm text-neutral-6 mt-0.5">Cập nhật thông tin danh mục</p>
          </div>
        </div>
      }
      onConfirm={handleSubmit}
      onCancel={handleClose}
      hideFooter={false}
      testId="modal-edit-category"
      closeText="Hủy"
      confirmText="Cập nhật"
      className="duration-200 animate-in fade-in-0 zoom-in-95"
      titleClassName="!text-2xl"
      headerPadding="pb-8"
    >
      <Form.Root>
        <div className="space-y-6">
          <div className="p-4 mb-2 bg-blue-50 rounded-lg border border-blue-100">
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
          </div>

          <Input
            name="name"
            label="Tên danh mục"
            placeholder="Ví dụ: Điện tử, Quần áo, Thực phẩm..."
            value={formData.data.name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                data: { ...formData.data, name: e.target.value },
              })
            }
            error={errors.name}
            required
            className="transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500"
          />

          <TextArea
            name="description"
            label="Mô tả"
            placeholder="Nhập mô tả chi tiết về danh mục này..."
            value={formData.data.description || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                data: { ...formData.data, description: e.target.value },
              })
            }
            rows={4}
            className="transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500"
          />

          <ImageUpload
            value={imageIcon}
            onChange={setImageIcon}
            onUpload={handleImageUpload}
            label="Icon danh mục"
            width={160}
            height={160}
            padding="p-5"
            maxSizeInMB={5}
            testId="category-icon-upload"
          />

          <div className="pt-2">
            <div className="flex gap-2 items-center text-sm text-neutral-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Icon sẽ được hiển thị trong danh sách danh mục</span>
            </div>
          </div>
        </div>
      </Form.Root>
    </Modal>
  );
};

export default ModalEditCategory;
