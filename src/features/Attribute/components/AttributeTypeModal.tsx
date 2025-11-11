import React from "react";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Switch from "@/foundation/components/input/Switch";
import Button from "@/foundation/components/buttons/Button";
import type {
  AttributeType,
  CreateAttributeTypeRequest,
  UpdateAttributeTypeRequest,
} from "@/core/api/attribute-type/type";
import { categoriesApi } from "@/core/api/categories";
import type { Category } from "@/core/api/categories/type";
import { PlusIcon, TrashIcon } from "lucide-react";
import * as Form from "@radix-ui/react-form";

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

const AttributeTypeModal: React.FC<Props> = ({
  open,
  mode,
  onOpenChange,
  initialData,
  onSubmit,
}) => {
  const [form, setForm] = React.useState<CreateAttributeTypeRequest>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    categoryId:
      typeof initialData?.categoryId === "string"
        ? initialData.categoryId
        : initialData?.categoryId?._id || "",
    isActive: initialData?.isActive ?? true,
    is_multiple: (initialData as any)?.is_multiple ?? false,
    values: [],
  });
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [newValue, setNewValue] = React.useState("");

  React.useEffect(() => {
    if (open) {
      categoriesApi.getCategories().then((res) => {
        if (res.data) setCategories(res.data);
      });
    }
  }, [open]);

  React.useEffect(() => {
    setForm({
      name: initialData?.name || "",
      description: initialData?.description || "",
      categoryId:
        typeof initialData?.categoryId === "string"
          ? initialData.categoryId
          : initialData?.categoryId?._id || "",
      isActive: initialData?.isActive ?? true,
      is_multiple: (initialData as any)?.is_multiple ?? false,
      values: [],
    });
    setNewValue("");
  }, [initialData, open]);

  const handleChange = (key: keyof CreateAttributeTypeRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      setForm((prev) => ({
        ...prev,
        values: [...(prev.values || []), { value: newValue.trim() }],
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
      size="xl"
    >
      <Form.Root>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="attrType-name"
              label="Tên loại"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("name", e.target.value)
              }
            />
            <Select
              name="attrType-category"
              label="Danh mục"
              value={form.categoryId || "none"}
              onChange={(v: string) => handleChange("categoryId", v === "none" ? undefined : v)}
              options={[
                { label: "Chọn danh mục", value: "none" },
                ...categories.map((cat) => ({ label: cat.name, value: cat._id })),
              ]}
            />
            <div className="flex items-center gap-6">
              <Switch
                name="attrType-multi"
                checked={!!form.is_multiple}
                onChange={(v: boolean) => handleChange("is_multiple", !!v)}
                label="Chọn nhiều"
                labelPosition="left"
              />
              <Switch
                name="attrType-active"
                checked={!!form.isActive}
                onChange={(v: boolean) => handleChange("isActive", !!v)}
                label="Hoạt động"
                labelPosition="left"
              />
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
          </div>

          {mode === "create" && (
            <div className="border-t border-divider-1 pt-6">
              <div className="text-body-14 font-semibold text-neutral-9 mb-4">
                Giá trị thuộc tính
              </div>
              <div className="flex gap-2 mb-3">
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
                  className="flex-1"
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
                      <span className="text-sm text-neutral-10">{item.value}</span>
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
          <div className="flex justify-end gap-3 pt-4 border-t border-divider-1">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
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
