import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import TextArea from "@/foundation/components/input/TextArea";
import Select from "@/foundation/components/input/Select";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { createSubCategoryStart } from "../slice/subCategory.slice";
import { selectCategories } from "@/features/Category/slice/category.selector";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { InfoIcon } from "lucide-react";
import AlertMessage from "@/foundation/components/info/AlertMessage";
import ImageUpload from "@/foundation/components/input/upload/ImageUpload";
import { imagesApi } from "@/core/api/images";
import ImageBannerUpdate from "@/foundation/components/input/upload/ImageBannerUpload";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import ImageIconUpload from "@/foundation/components/input/upload/ImageIconUpload";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ModalAddSubCategory: React.FC<Props> = ({ open, onOpenChange }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    isActive: true as boolean | undefined,
    sortOrder: 0 as number | undefined,
    iconImage: null as { url: string; publicId?: string } | null,
    mainImage: null as { url: string; publicId?: string } | null,
    bannerImage: null as { url: string; publicId?: string } | null,
  });
  // single image only, no gallery
  const [errors, setErrors] = useState<{ name?: string; parentId?: string }>({});

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    if (!formData.name.trim()) nextErrors.name = "Tên danh mục con là bắt buộc";
    if (!formData.parentId) nextErrors.parentId = "Vui lòng chọn danh mục";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      categoryId: formData.parentId, // backend expects categoryId
      isActive: formData.isActive,
      sortOrder: formData.sortOrder,
      image: formData.mainImage
        ? { url: formData.mainImage.url, publicId: formData.mainImage.publicId }
        : undefined,
      image_Icon: formData.iconImage
        ? { url: formData.iconImage.url, publicId: formData.iconImage.publicId }
        : undefined,
      image_Background: formData.bannerImage
        ? { url: formData.bannerImage.url, publicId: formData.bannerImage.publicId }
        : undefined,
    } as Record<string, unknown>;
    dispatch(createSubCategoryStart(payload));
    handleClose();
  };

  const handleIconUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setFormData({ ...formData, iconImage: uploadResult });
    return uploadResult;
  };

  const handleMainImageUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setFormData({ ...formData, mainImage: uploadResult });
    return uploadResult;
  };

  const handleBannerUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setFormData({ ...formData, bannerImage: uploadResult });
    return uploadResult;
  };

  // no gallery upload for subcategory

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      parentId: "",
      isActive: true,
      sortOrder: 0,
      iconImage: null,
      mainImage: null,
      bannerImage: null,
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex gap-3 items-center">
          <IconCircleWrapper size="md" color="info">
            <InfoIcon className="text-blue-500 dark:text-white" />
          </IconCircleWrapper>
          <div>
            <h2 className="text-xl font-bold text-neutral-9">Thêm danh mục con</h2>
            <p className="text-sm text-neutral-6 mt-0.5">Nhập thông tin danh mục con để thêm mới</p>
          </div>
        </div>
      }
      onConfirm={handleSubmit}
      onCancel={handleClose}
      hideFooter={false}
      confirmText="Thêm"
      closeText="Hủy"
      size="2xl"
    >
      <Form.Root>
        <ScrollView className="h-[500px]" hideScrollbarY={false}>
          <div className="space-y-5 p-0.5">
            <AlertMessage
              type="info"
              title="Thông tin quan trọng"
              message="Tên danh mục con là bắt buộc và sẽ được hiển thị trên hệ thống."
            />
            <Input
              name="name"
              label="Tên danh mục con"
              placeholder="Nhập tên danh mục con"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <TextArea
              name="description"
              label="Mô tả"
              placeholder="Nhập mô tả (không bắt buộc)"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Select
              name="parentId"
              label="Danh mục cha"
              placeholder="Chọn danh mục"
              value={formData.parentId}
              onChange={(v) => setFormData({ ...formData, parentId: v })}
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              error={errors.parentId}
              sizeSelect="md"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                name="isActive"
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                value={String(formData.isActive ?? "true")}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    isActive: v === "true" ? true : v === "false" ? false : undefined,
                  })
                }
                options={[
                  { value: "true", label: "Hoạt động" },
                  { value: "false", label: "Tạm dừng" },
                ]}
                sizeSelect="md"
              />

              <Input
                name="sortOrder"
                label="Thứ tự"
                placeholder="0"
                type="number"
                value={String(formData.sortOrder ?? 0)}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              />
            </div>
            {/* Image Icon */}
            <ImageIconUpload
              value={formData.iconImage}
              onChange={(v) => setFormData({ ...formData, iconImage: v })}
              onUpload={handleIconUpload}
              label="Icon danh mục con"
              maxSizeInMB={5}
              testId="subcategory-icon-upload"
            />

            {/* Single image for SubCategory */}
            <ImageUpload
              value={formData.mainImage}
              onChange={(v) => setFormData({ ...formData, mainImage: v })}
              onUpload={handleMainImageUpload}
              label="Hình ảnh danh mục con"
              width={160}
              height={160}
              padding="p-5"
              maxSizeInMB={5}
              testId="subcategory-image-upload"
            />

            <ImageBannerUpdate
              value={formData.bannerImage}
              onChange={(v) => setFormData({ ...formData, bannerImage: v })}
              onUpload={handleBannerUpload}
              label="Banner danh mục con"
              aspectRatio="banner"
              maxSizeInMB={8}
              testId="subcategory-banner-upload"
            />
          </div>
        </ScrollView>
      </Form.Root>
    </Modal>
  );
};

export default ModalAddSubCategory;
