import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import * as Form from "@radix-ui/react-form";
import Input from "@/foundation/components/input/Input";
import TextArea from "@/foundation/components/input/TextArea";
import ImageUpload from "@/foundation/components/input/upload/ImageUpload";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import { HomeConfiguration, MainBanner, SideBanner, Feature, DisplayType } from "@/core/api/home/type";
import { imagesApi } from "@/core/api/images";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Card } from "@/foundation/components/info/Card";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import AlertMessage from "@/foundation/components/info/AlertMessage";
import { useAppSelector } from "@/app/store";
import { selectCategories } from "@/features/Category/slice/category.selector";
import { useCategoryActions } from "@/features/Category/hooks/useCategoryActions";

interface HomeConfigurationFormProps {
  initialData?: HomeConfiguration | null;
  onSubmit: (data: {
    mainBanners: MainBanner[];
    sideBanners: SideBanner[];
    features: Feature[];
    settings: {
      autoSlideInterval: number;
      showCounter: boolean;
      showDots: boolean;
    };
    isActive: boolean;
    displayType: DisplayType;
  }) => void;
}

export interface HomeConfigurationFormRef {
  submit: () => void;
}

const HomeConfigurationForm = forwardRef<HomeConfigurationFormRef, HomeConfigurationFormProps>(
  ({ initialData, onSubmit }, ref) => {
  const categories = useAppSelector(selectCategories);
  const { fetchCategories } = useCategoryActions();
  const [mainBanners, setMainBanners] = useState<MainBanner[]>([]);
  const [sideBanners, setSideBanners] = useState<SideBanner[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [settings, setSettings] = useState({
    autoSlideInterval: 5000,
    showCounter: true,
    showDots: true,
  });
  const [isActive, setIsActive] = useState(true);
  const [displayType, setDisplayType] = useState<DisplayType>("default");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories({ page: 1, limit: 100, isActive: true });
  }, [fetchCategories]);

  useEffect(() => {
    if (initialData) {
      setMainBanners(initialData.mainBanners || []);
      // Map sideBanners to include categoryId
      setSideBanners(
        (initialData.sideBanners || []).map((banner) => ({
          categoryId: banner.categoryId || "",
          order: banner.order || 0,
          isActive: banner.isActive ?? true,
          category: banner.category,
          image: banner.image,
        }))
      );
      setFeatures(initialData.features || []);
      setSettings({
        autoSlideInterval: initialData.settings?.autoSlideInterval ?? 5000,
        showCounter: initialData.settings?.showCounter ?? true,
        showDots: initialData.settings?.showDots ?? true,
      });
      setIsActive(initialData.isActive ?? true);
      setDisplayType(initialData.displayType || "default");
    }
  }, [initialData]);

  const handleImageUpload = async (file: File) => {
    const result = await imagesApi.uploadImage(file);
    return { url: result.url, publicId: result.publicId };
  };

  const addMainBanner = () => {
    setMainBanners([
      ...mainBanners,
      {
        image: { url: "", publicId: "" },
        title: "",
        description: "",
        link: "",
        order: mainBanners.length,
        isActive: true,
      },
    ]);
  };

  const updateMainBanner = (index: number, field: keyof MainBanner, value: any) => {
    const updated = [...mainBanners];
    updated[index] = { ...updated[index], [field]: value };
    setMainBanners(updated);
  };

  const removeMainBanner = (index: number) => {
    setMainBanners(mainBanners.filter((_, i) => i !== index));
  };

  const addSideBanner = () => {
    // Limit to 2 side banners
    if (sideBanners.length >= 2) {
      return;
    }
    setSideBanners([
      ...sideBanners,
      {
        categoryId: "",
        order: sideBanners.length,
        isActive: true,
      },
    ]);
  };

  const updateSideBanner = (index: number, categoryId: string) => {
    const updated = [...sideBanners];
    const selectedCategory = categories.find((c) => c._id === categoryId);
    updated[index] = {
      ...updated[index],
      categoryId,
      category: selectedCategory
        ? {
            _id: selectedCategory._id,
            name: selectedCategory.name,
            image_Background: selectedCategory.image_Background,
          }
        : undefined,
      image: selectedCategory?.image_Background,
    };
    setSideBanners(updated);
  };

  const removeSideBanner = (index: number) => {
    setSideBanners(sideBanners.filter((_, i) => i !== index));
  };

  // Get available categories (exclude already selected ones)
  const getAvailableCategories = (currentIndex: number) => {
    const selectedCategoryIds = sideBanners
      .map((b, i) => (i !== currentIndex ? b.categoryId : null))
      .filter(Boolean);
    return categories.filter((c) => !selectedCategoryIds.includes(c._id) && c.isActive);
  };

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        icon: "Check",
        text: "",
        iconBg: "from-success to-success/80",
        hoverColor: "text-success",
        order: features.length,
        isActive: true,
      },
    ]);
  };

  const updateFeature = (index: number, field: keyof Feature, value: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Validate sideBanners have categoryId
    const validSideBanners = sideBanners.filter((b) => b.categoryId);
    if (validSideBanners.length === 0 && sideBanners.length > 0) {
      // Show error or prevent submit
      return;
    }

    onSubmit({
      mainBanners: mainBanners.map((b, i) => ({ ...b, order: i })),
      sideBanners: validSideBanners.map((b, i) => ({
        categoryId: b.categoryId,
        order: i,
        isActive: b.isActive ?? true,
      })),
      features: features.map((f, i) => ({ ...f, order: i })),
      settings,
      isActive,
      displayType,
    });
  };

  // Expose submit handler via ref
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  return (
    <Form.Root>
      <ScrollView className="h-[500px]" hideScrollbarY={false}>
        <div className="space-y-6 p-0.5">
          <AlertMessage
            type="info"
            title="Thông tin quan trọng"
            message="Cấu hình này sẽ được hiển thị trên trang chủ. Chỉ một cấu hình có thể được kích hoạt tại một thời điểm."
          />
        {/* Main Banners */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-neutral-10">Banner chính (Carousel)</h3>
            <Button
              type="button"
              variant="outlined"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={addMainBanner}
            >
              Thêm banner
            </Button>
          </div>
          <div className="space-y-4">
            {mainBanners.map((banner, index) => (
              <div key={index} className="p-4 border border-divider-1 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-neutral-5" />
                    <span className="text-sm font-medium text-neutral-7">Banner {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => removeMainBanner(index)}
                  >
                    Xóa
                  </Button>
                </div>
                <ImageUpload
                  value={banner.image.url ? banner.image : null}
                  onChange={(img) => updateMainBanner(index, "image", img || { url: "", publicId: "" })}
                  onUpload={handleImageUpload}
                  label="Ảnh banner"
                  aspectRatio="wide"
                  width="w-full"
                />
                <Input
                  name={`mainBanner-title-${index}`}
                  label="Tiêu đề"
                  value={banner.title || ""}
                  onChange={(e) => updateMainBanner(index, "title", e.target.value)}
                />
                <TextArea
                  name={`mainBanner-description-${index}`}
                  label="Mô tả"
                  value={banner.description || ""}
                  onChange={(e) => updateMainBanner(index, "description", e.target.value)}
                  rows={3}
                />
                <Input
                  name={`mainBanner-link-${index}`}
                  label="Link (tùy chọn)"
                  value={banner.link || ""}
                  onChange={(e) => updateMainBanner(index, "link", e.target.value)}
                  placeholder="https://..."
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={banner.isActive ?? true}
                    onChange={(e) => updateMainBanner(index, "isActive", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-neutral-7">Kích hoạt</label>
                </div>
              </div>
            ))}
            {mainBanners.length === 0 && (
              <p className="text-sm text-neutral-6 text-center py-4">Chưa có banner nào</p>
            )}
          </div>
        </Card>

        {/* Side Banners - Chọn 2 danh mục */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Banner phụ (Bên phải)</h3>
              <p className="text-sm text-neutral-6 mt-1">
                Chọn 2 danh mục để hiển thị banner (tự động lấy banner từ danh mục)
              </p>
            </div>
            <Button
              type="button"
              variant="outlined"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={addSideBanner}
              disabled={sideBanners.length >= 2}
            >
              Thêm danh mục
            </Button>
          </div>
          <div className="space-y-4">
            {sideBanners.map((banner, index) => {
              const availableCategories = getAvailableCategories(index);
              const selectedCategory = categories.find((c) => c._id === banner.categoryId);

              return (
                <div key={index} className="p-4 border border-divider-1 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-5 h-5 text-neutral-5" />
                      <span className="text-sm font-medium text-neutral-7">Danh mục {index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => removeSideBanner(index)}
                    >
                      Xóa
                    </Button>
                  </div>

                  <Select
                    name={`sideBanner-${index}`}
                    label="Chọn danh mục"
                    placeholder="Chọn danh mục để hiển thị banner"
                    value={banner.categoryId || ""}
                    onChange={(categoryId) => updateSideBanner(index, categoryId)}
                    options={availableCategories.map((c) => ({
                      value: c._id,
                      label: c.name,
                    }))}
                    required
                    sizeSelect="md"
                  />

                  {/* Preview banner từ category */}
                  {selectedCategory?.image_Background && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-7">Preview banner:</label>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-divider-1">
                        <img
                          src={selectedCategory.image_Background.url}
                          alt={selectedCategory.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-neutral-6">
                        Banner sẽ tự động lấy từ danh mục: <strong>{selectedCategory.name}</strong>
                      </p>
                    </div>
                  )}

                  {!selectedCategory && banner.categoryId && (
                    <p className="text-sm text-warning">
                      Danh mục đã chọn không còn tồn tại hoặc đã bị xóa
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={banner.isActive ?? true}
                      onChange={(e) => {
                        const updated = [...sideBanners];
                        updated[index] = { ...updated[index], isActive: e.target.checked };
                        setSideBanners(updated);
                      }}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-neutral-7">Kích hoạt</label>
                  </div>
                </div>
              );
            })}
            {sideBanners.length === 0 && (
              <p className="text-sm text-neutral-6 text-center py-4">
                Chưa chọn danh mục nào. Chọn tối đa 2 danh mục để hiển thị banner phụ.
              </p>
            )}
            {sideBanners.length >= 2 && (
              <p className="text-sm text-neutral-6 text-center py-2">
                Đã chọn đủ 2 danh mục (tối đa)
              </p>
            )}
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-neutral-10">Tính năng nổi bật</h3>
            <Button
              type="button"
              variant="outlined"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={addFeature}
            >
              Thêm tính năng
            </Button>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="p-4 border border-divider-1 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-neutral-5" />
                    <span className="text-sm font-medium text-neutral-7">Tính năng {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => removeFeature(index)}
                  >
                    Xóa
                  </Button>
                </div>
                <Input
                  name={`feature-icon-${index}`}
                  label="Icon (tên icon từ lucide-react)"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, "icon", e.target.value)}
                  placeholder="Check, Truck, etc."
                />
                <Input
                  name={`feature-text-${index}`}
                  label="Text"
                  value={feature.text}
                  onChange={(e) => updateFeature(index, "text", e.target.value)}
                  placeholder="100% hàng thật"
                />
                <Input
                  name={`feature-iconBg-${index}`}
                  label="Icon Background (Tailwind gradient)"
                  value={feature.iconBg}
                  onChange={(e) => updateFeature(index, "iconBg", e.target.value)}
                  placeholder="from-success to-success/80"
                />
                <Input
                  name={`feature-hoverColor-${index}`}
                  label="Hover Color (Tailwind class)"
                  value={feature.hoverColor}
                  onChange={(e) => updateFeature(index, "hoverColor", e.target.value)}
                  placeholder="text-success"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feature.isActive ?? true}
                    onChange={(e) => updateFeature(index, "isActive", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-neutral-7">Kích hoạt</label>
                </div>
              </div>
            ))}
            {features.length === 0 && (
              <p className="text-sm text-neutral-6 text-center py-4">Chưa có tính năng nào</p>
            )}
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-10 mb-4">Cài đặt</h3>
          <div className="space-y-4">
            <Input
              name="autoSlideInterval"
              type="number"
              label="Thời gian tự động chuyển slide (ms)"
              value={settings.autoSlideInterval.toString()}
              onChange={(e) => setSettings({ ...settings, autoSlideInterval: Number(e.target.value) })}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showCounter}
                onChange={(e) => setSettings({ ...settings, showCounter: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm text-neutral-7">Hiển thị số thứ tự</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showDots}
                onChange={(e) => setSettings({ ...settings, showDots: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm text-neutral-7">Hiển thị dots indicator</label>
            </div>
            <Select
              name="displayType"
              label="Loại hiển thị"
              description="Chọn loại layout hiển thị cho trang chủ"
              value={displayType}
              onChange={(value) => setDisplayType(value as DisplayType)}
              options={[
                { value: "default", label: "Mặc định - Layout tiêu chuẩn" },
                { value: "compact", label: "Gọn - Layout gọn gàng, tiết kiệm không gian" },
                { value: "modern", label: "Hiện đại - Layout hiện đại với nhiều hiệu ứng" },
                { value: "classic", label: "Cổ điển - Layout truyền thống" },
              ]}
              sizeSelect="md"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-neutral-7">Kích hoạt cấu hình này</label>
            </div>
          </div>
        </Card>
        </div>
      </ScrollView>
    </Form.Root>
  );
});

HomeConfigurationForm.displayName = "HomeConfigurationForm";

export default HomeConfigurationForm;

