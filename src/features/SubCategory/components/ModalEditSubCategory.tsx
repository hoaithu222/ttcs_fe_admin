import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import TextArea from "@/foundation/components/input/TextArea";
import Select from "@/foundation/components/input/Select";
import { SubCategory } from "@/core/api/sub-categories/type";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { updateSubCategoryStart } from "../slice/subCategory.slice";
import { selectCategories } from "@/features/Category/slice/category.selector";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { InfoIcon } from "lucide-react";
import AlertMessage from "@/foundation/components/info/AlertMessage";
import ImageUpload from "@/foundation/components/input/upload/ImageUpload";
import ImageIconUpload from "@/foundation/components/input/upload/ImageIconUpload";
import { imagesApi } from "@/core/api/images";
import ImageBannerUpdate from "@/foundation/components/input/upload/ImageBannerUpload";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import AiCategoryDescriptionGenerator from "@/foundation/components/ai/AiCategoryDescriptionGenerator";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategory: SubCategory | null;
};

const ModalEditSubCategory: React.FC<Props> = ({ open, onOpenChange, subCategory }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const [formData, setFormData] = useState({
    id: "",
    data: {
      name: "",
      description: "",
      categoryId: "",
      isActive: true as boolean | undefined,
      sortOrder: 0 as number | undefined,
      iconImage: null as { url: string; publicId?: string } | null,
      mainImage: null as { url: string; publicId?: string } | null,
      bannerImage: null as { url: string; publicId?: string } | null,
    },
  });
  const [errors, setErrors] = useState<{ name?: string; categoryId?: string }>({});
  // single image only, no gallery
  useEffect(() => {
    if (subCategory) {
      const rawImage: any = (subCategory as any).image;
      const normalizedImage =
        rawImage && rawImage.url ? { url: rawImage.url, publicId: rawImage.publicId } : null;
      const rawBanner: any = (subCategory as any).image_Background;
      const normalizedBanner =
        rawBanner && rawBanner.url ? { url: rawBanner.url, publicId: rawBanner.publicId } : null;
      const rawIcon: any = (subCategory as any).image_Icon;
      const normalizedIcon =
        rawIcon && rawIcon.url ? { url: rawIcon.url, publicId: rawIcon.publicId } : null;

      setFormData({
        id: subCategory._id,
        data: {
          name: subCategory.name,
          description: subCategory.description || "",
          categoryId: (subCategory as any).categoryId || (subCategory as any).parentId || "",
          isActive: subCategory.isActive,
          sortOrder: subCategory.sortOrder,
          iconImage: normalizedIcon,
          mainImage: normalizedImage,
          bannerImage: normalizedBanner,
        },
      });
      setErrors({});
    }
  }, [subCategory]);

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    if (!formData.data.name.trim()) nextErrors.name = "Tên danh mục con là bắt buộc";
    if (!formData.data.categoryId) nextErrors.categoryId = "Vui lòng chọn danh mục";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const submitData = {
      id: formData.id,
      data: {
        name: formData.data.name,
        description: formData.data.description || undefined,
        categoryId: formData.data.categoryId, // backend expects categoryId
        isActive: formData.data.isActive,
        sortOrder: formData.data.sortOrder,
        ...(formData.data.mainImage && {
          image: {
            url: formData.data.mainImage.url,
            publicId: formData.data.mainImage.publicId,
          },
        }),
        ...(formData.data.iconImage && {
          image_Icon: {
            url: formData.data.iconImage.url,
            publicId: formData.data.iconImage.publicId,
          },
        }),
        image_Background: formData.data.bannerImage
          ? { url: formData.data.bannerImage.url, publicId: formData.data.bannerImage.publicId }
          : undefined,
      },
    } as Record<string, unknown>;

    dispatch(updateSubCategoryStart(submitData));
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  const handleImageUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setFormData({ ...formData, data: { ...formData.data, mainImage: uploadResult } });
    return uploadResult;
  };

  const handleBannerUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setFormData({ ...formData, data: { ...formData.data, bannerImage: uploadResult } });
    return uploadResult;
  };

  const handleIconUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    const uploadResult = {
      url: result.url,
      publicId: result.publicId,
    };
    setFormData({ ...formData, data: { ...formData.data, iconImage: uploadResult } });
    return uploadResult;
  };

  if (!subCategory) return null;

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
            <h2 className="text-xl font-bold text-neutral-9">Sửa danh mục con</h2>
            <p className="text-sm text-neutral-6 mt-0.5">Cập nhật thông tin danh mục con</p>
          </div>
        </div>
      }
      onConfirm={handleSubmit}
      onCancel={handleClose}
      hideFooter={false}
      confirmText="Cập nhật"
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
              value={formData.data.name}
              onChange={(e) =>
                setFormData({ ...formData, data: { ...formData.data, name: e.target.value } })
              }
              error={errors.name}
              required
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
                placeholder="Nhập mô tả (không bắt buộc) hoặc nhấn nút AI để tạo tự động..."
                rows={4}
                value={formData.data.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: { ...formData.data, description: e.target.value },
                  })
                }
              />
            </div>

            <Select
              name="parentId"
              label="Danh mục cha"
              placeholder="Chọn danh mục"
              value={formData.data.categoryId}
              onChange={(v) =>
                setFormData({ ...formData, data: { ...formData.data, categoryId: v } })
              }
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              error={errors.categoryId}
              sizeSelect="md"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                name="isActive"
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                value={String(formData.data.isActive ?? "true")}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    data: {
                      ...formData.data,
                      isActive: v === "true" ? true : v === "false" ? false : undefined,
                    },
                  })
                }
                options={[
                  { value: "true", label: "Hoạt động" },
                  { value: "false", label: "Tạm dừng" },
                ]}
                sizeSelect="md"
              />

              {/* <Input
                name="sortOrder"
                label="Thứ tự"
                placeholder="0"
                type="number"
                value={String(formData.data.sortOrder ?? 0)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: { ...formData.data, sortOrder: Number(e.target.value) },
                  })
                }
              /> */}
            </div>
            <ImageIconUpload
              value={formData.data.iconImage}
              onChange={(v) =>
                setFormData({ ...formData, data: { ...formData.data, iconImage: v } })
              }
              onUpload={handleIconUpload}
              label="Icon danh mục con"
              maxSizeInMB={5}
              testId="subcategory-icon-upload"
            />
            <ImageUpload
              value={formData.data.mainImage}
              onChange={(v) =>
                setFormData({ ...formData, data: { ...formData.data, mainImage: v } })
              }
              onUpload={handleImageUpload}
              label="Hình ảnh danh mục con"
              width={160}
              height={160}
              padding="p-5"
              maxSizeInMB={5}
              testId="category-icon-upload"
            />

            <ImageBannerUpdate
              value={formData.data.bannerImage}
              onChange={(v) =>
                setFormData({ ...formData, data: { ...formData.data, bannerImage: v } })
              }
              onUpload={handleBannerUpload}
              label="Banner danh mục con"
              aspectRatio="banner"
              maxSizeInMB={8}
              testId="subcategory-banner-upload"
            />
            {/* no gallery for subcategory */}
          </div>
        </ScrollView>
      </Form.Root>
    </Modal>
  );
};

export default ModalEditSubCategory;
