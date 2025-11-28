import React from "react";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Switch from "@/foundation/components/input/Switch";
import Button from "@/foundation/components/buttons/Button";
import TextArea from "@/foundation/components/input/TextArea";
import MultiSelect from "@/foundation/components/input/MultiSelect";
import type {
  AttributeType,
  CreateAttributeTypeRequest,
  UpdateAttributeTypeRequest,
} from "@/core/api/attribute-type/type";
import { attributeTypesApi } from "@/core/api/attribute-type";
import { categoriesApi } from "@/core/api/categories";
import type { Category } from "@/core/api/categories/type";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as Form from "@radix-ui/react-form";
import useAttributeForms from "../hooks/useAttributeForms";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import AlertMessage from "@/foundation/components/info/AlertMessage";

const normalizeId = (value: any): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (typeof value._id === "string") return value._id;
    if (typeof value.id === "string") return value.id;
    if (typeof value.toString === "function") {
      const str = value.toString();
      return typeof str === "string" && str !== "[object Object]" ? str : undefined;
    }
  }
  return undefined;
};

const getCategoryIdsFromAttribute = (attribute?: AttributeType): string[] => {
  if (!attribute) return [];

  const fromField = (attribute as any)?.categoryIds;
  if (Array.isArray(fromField) && fromField.length) {
    return fromField
      .map((item: unknown) => normalizeId(item))
      .filter((id): id is string => typeof id === "string" && !!id);
  }

  const fromCategories = (attribute as any)?.categories;
  if (Array.isArray(fromCategories) && fromCategories.length) {
    return fromCategories
      .map((cat: any) => normalizeId(cat) || normalizeId(cat?._id))
      .filter((id): id is string => typeof id === "string" && !!id);
  }

  const single = normalizeId(attribute.categoryId);
  return single ? [single] : [];
};

interface Props {
  open: boolean;
  mode: "create" | "update";
  onOpenChange: (open: boolean) => void;
  initialData?: AttributeType;
  onSubmit?: (
    payload: CreateAttributeTypeRequest | UpdateAttributeTypeRequest,
    mode: "create" | "update"
  ) => Promise<void> | void;
}

const buildFormState = (attribute?: AttributeType): CreateAttributeTypeRequest => {
  const categoryIds = getCategoryIdsFromAttribute(attribute);

  return {
    name: attribute?.name || "",
    code: attribute?.code || "",
    description: attribute?.description || "",
    helperText: attribute?.helperText || "",
    inputType: attribute?.inputType || "select",
    categoryId: categoryIds[0] || "",
    categoryIds,
    isActive: attribute?.isActive ?? true,
    is_multiple: (attribute as any)?.is_multiple ?? false,
    values: [],
  };
};

const AttributeTypeModal: React.FC<Props> = ({
  open,
  mode,
  onOpenChange,
  initialData,
  onSubmit,
}) => {
  const { inputTypeOptions, slugify } = useAttributeForms();
  const [form, setForm] = React.useState<CreateAttributeTypeRequest>(() => buildFormState(initialData));
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [newValue, setNewValue] = React.useState("");
  const [isCodeManual, setIsCodeManual] = React.useState(false);
  const [isDetailLoading, setIsDetailLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      categoriesApi.getCategories().then((res) => {
        if (res.data) setCategories(res.data);
      });
    }
  }, [open]);

  React.useEffect(() => {
    let isMounted = true;
    const resetForm = (data?: AttributeType) => {
      setForm(buildFormState(data));
      setNewValue("");
      setIsCodeManual(false);
    };

    if (!open) {
      resetForm(initialData);
      return () => {
        isMounted = false;
      };
    }

    if (mode === "update" && initialData?._id) {
      setIsDetailLoading(true);
      attributeTypesApi
        .getAttributeType(initialData._id)
        .then((res) => {
          if (!isMounted) return;
          resetForm(res.data || initialData);
        })
        .catch(() => {
          if (!isMounted) return;
          resetForm(initialData);
        })
        .finally(() => {
          if (!isMounted) return;
          setIsDetailLoading(false);
        });
    } else {
      resetForm(initialData);
    }

    return () => {
      isMounted = false;
    };
  }, [initialData, mode, open]);

  React.useEffect(() => {
    if (!isCodeManual && form.name && !form.code) {
      setForm((prev) => ({ ...prev, code: slugify(prev.name) }));
    }
  }, [form.name, form.code, isCodeManual, slugify]);

  const handleChange = (key: keyof CreateAttributeTypeRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryIdsChange = (values: string[]) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: values,
      categoryId: values[0] || "",
    }));
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      const label = newValue.trim();
      const value = slugify(label, "_");
      setForm((prev) => ({
        ...prev,
        values: [...(prev.values || []), { value: value || label, label }],
      }));
      setNewValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    setForm((prev) => ({
      ...prev,
      values: prev.values?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Thêm loại thuộc tính" : "Cập nhật loại thuộc tính"}
      size="2xl"
    >
      <Form.Root>
        <div className="flex flex-col gap-6">
          <ScrollView className="!h-[520px] max-h-[70vh]" hideScrollbarY={false}>
            <div className="flex flex-col gap-6 p-0.5">
              <AlertMessage
                type="info"
                title="Thiết lập loại thuộc tính"
                message="Chọn danh mục áp dụng và loại trường nhập để đảm bảo dữ liệu đồng bộ giữa các shop và SKU."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="attrType-name"
                  label="Tên loại"
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("name", e.target.value)
                  }
                />
                <Input
                  name="attrType-code"
                  label="Mã hệ thống (slug)"
                  value={form.code || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setIsCodeManual(true);
                    handleChange("code", slugify(e.target.value));
                  }}
                  placeholder="vd: color, storage_capacity"
                  description="Dùng tiếng Anh không dấu để đồng bộ với SKU/seed."
                />
                <div className="md:col-span-2">
                  <MultiSelect
                    name="attrType-categories"
                    label="Danh mục áp dụng"
                    value={form.categoryIds || []}
                    onChange={handleCategoryIdsChange}
                    options={categories.map((cat) => ({ label: cat.name, value: cat._id }))}
                    placeholder="Chọn một hoặc nhiều danh mục"
                    disabled={isDetailLoading}
                    searchable
                    clearable
                    description="Thuộc tính này sẽ xuất hiện trong tất cả danh mục đã chọn."
                  />
                </div>
                <Select
                  name="attrType-inputType"
                  label="Loại trường nhập"
                  value={form.inputType || "select"}
                  onChange={(v: string) => handleChange("inputType", v)}
                  options={inputTypeOptions}
                  description="Xác định cách shop chọn giá trị cho thuộc tính này."
                />
                <div className="md:col-span-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border border-divider-1 px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-neutral-9">Cho phép chọn nhiều</div>
                      <div className="text-xs text-neutral-6">
                        Bật nếu sản phẩm có thể gán nhiều giá trị cùng lúc.
                      </div>
                    </div>
                    <Switch
                      name="attrType-multi"
                      checked={!!form.is_multiple}
                      onChange={(v: boolean) => handleChange("is_multiple", !!v)}
                      label="Chọn nhiều"
                      labelPosition="left"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-divider-1 px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-neutral-9">Trạng thái thuộc tính</div>
                      <div className="text-xs text-neutral-6">
                        Tắt nếu không muốn thuộc tính xuất hiện trong tạo sản phẩm.
                      </div>
                    </div>
                    <Switch
                      name="attrType-active"
                      checked={!!form.isActive}
                      onChange={(v: boolean) => handleChange("isActive", !!v)}
                      label="Hoạt động"
                      labelPosition="left"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Input
                    name="attrType-description"
                    label="Mô tả"
                    value={form.description || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    name="attrType-helper"
                    label="Hướng dẫn cho shop"
                    placeholder="Ví dụ: 'Chọn đúng dung lượng bộ nhớ theo thông số chính thức'"
                    value={form.helperText || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleChange("helperText", e.target.value)
                    }
                  />
                </div>
              </div>
              {mode === "create" && (
                <div className="border-t border-divider-1 pt-6">
                  <div className="text-lg font-semibold text-neutral-9 mb-4">
                    Giá trị thuộc tính
                  </div>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <Input
                      name="new-value"
                      placeholder="Nhập giá trị"
                      value={newValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddValue();
                        }
                      }}
                      className="flex-1 min-w-[220px]"
                    />
                    <Button variant="outlined" icon={<PlusIcon />} onClick={handleAddValue}>
                      Thêm
                    </Button>
                  </div>
                  {form.values && form.values.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.values.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-neutral-2 rounded-full border border-divider-1"
                        >
                          <span className="text-xs font-semibold text-neutral-9">{item.label}</span>
                          <span className="text-[11px] text-neutral-5">({item.value})</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<TrashIcon size={14} />}
                            onClick={() => handleRemoveValue(index)}
                            className="h-5 w-5 p-0"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollView>
          <div className="flex justify-end gap-3 pt-4 border-t border-divider-1">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              disabled={isDetailLoading}
              onClick={async () => {
                if (mode === "update" && initialData?._id) {
                  const payload: UpdateAttributeTypeRequest = { _id: initialData._id, ...form };
                  await onSubmit?.(payload, mode);
                } else {
                  await onSubmit?.(form, mode);
                }
                onOpenChange(false);
              }}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Form.Root>
    </Modal>
  );
};

export default AttributeTypeModal;
