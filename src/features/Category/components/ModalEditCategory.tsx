import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import TextArea from "@/foundation/components/input/TextArea";
import ImageIconUpload from "@/foundation/components/input/upload/ImageIconUpload";
import ImageUploadMulti from "@/foundation/components/input/upload/ImageUploadMulti";
import ImageBannerUpdate from "@/foundation/components/input/upload/ImageBannerUpload";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import { UpdateCategoryPayload } from "../slice/category.type";
import { useAppDispatch } from "@/app/store";
import { updateCategoryStart } from "../slice/category.slice";
import { Category } from "@/core/api/categories/type";
import { imagesApi } from "@/core/api/images";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { EditIcon } from "lucide-react";
import AlertMessage from "@/foundation/components/info/AlertMessage";
import AiCategoryDescriptionGenerator from "@/foundation/components/ai/AiCategoryDescriptionGenerator";

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
  const [bannerImage, setBannerImage] = useState<{ url: string; publicId?: string } | null>(null);
  const [galleryImages, setGalleryImages] = useState<Array<{
    url: string;
    publicId?: string;
  }> | null>(null);

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
      // Set gallery images if exists
      if (Array.isArray((category as any).image) && (category as any).image.length > 0) {
        const imgs = ((category as any).image as Array<{ url: string; publicId?: string }>).map(
          (i) => ({ url: i.url, publicId: i.publicId })
        );
        setGalleryImages(imgs);
      } else {
        setGalleryImages(null);
      }
      // Set banner from image_Background if exists
      if ((category as any).image_Background) {
        const b: any = (category as any).image_Background;
        const normalized = b?.url ? { url: b.url, publicId: b.publicId } : null;
        setBannerImage(normalized);
      }
    }
  }, [category]);

  const handleSubmit = () => {
    if (!formData.data.name?.trim()) {
      setErrors({ name: "Tên danh mục là bắt buộc" });
      return;
    }

    // Add image fields to formData if uploaded
    const submitData = {
      ...formData,
      data: {
        ...formData.data,
        ...(galleryImages && galleryImages.length > 0 && { image: galleryImages }),
        ...(imageIcon && { image_Icon: imageIcon }),
        ...(bannerImage && { image_Background: bannerImage }),
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

  const handleBannerUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setBannerImage(uploadResult);
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
          <IconCircleWrapper size="lg" color="info">
            <EditIcon className="text-info" />
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
        <ScrollView className="h-[500px]" hideScrollbarY={false}>
          <div className="space-y-6 p-0.5">
            <AlertMessage
              type="info"
              title="Thông tin quan trọng"
              message="Tên danh mục là bắt buộc và sẽ được hiển thị trên hệ thống."
            />

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

            <div className="space-y-2">
              <AiCategoryDescriptionGenerator
                onGenerate={(description) => {
                  setFormData({
                    ...formData,
                    data: { ...formData.data, description },
                  });
                }}
                categoryName={formData.data.name}
                language="vi"
                className="mb-2"
              />
              <TextArea
                name="description"
                label="Mô tả"
                placeholder="Nhập mô tả chi tiết về danh mục này hoặc nhấn nút AI để tạo tự động..."
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
            </div>

            <ImageIconUpload
              value={imageIcon}
              onChange={setImageIcon}
              onUpload={handleImageUpload}
              label="Icon danh mục"
              maxSizeInMB={5}
              testId="category-icon-upload"
            />
            <ImageUploadMulti
              value={galleryImages}
              onChange={setGalleryImages}
              onUpload={async (file) => {
                const result = await imagesApi.uploadImage(file);
                return { url: result.url, publicId: result.publicId };
              }}
              label="Bộ sưu tập ảnh danh mục (nhiều ảnh)"
              maxFiles={10}
              maxSizeInMB={8}
            />
            <ImageBannerUpdate
              value={bannerImage}
              onChange={setBannerImage}
              onUpload={handleBannerUpload}
              label="Banner danh mục"
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

export default ModalEditCategory;
