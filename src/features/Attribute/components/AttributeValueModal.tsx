import React from "react";
import Modal from "@/foundation/components/modal/Modal";
import Input from "@/foundation/components/input/Input";
import Switch from "@/foundation/components/input/Switch";
import Button from "@/foundation/components/buttons/Button";
import * as Form from "@radix-ui/react-form";
import type { AttributeType } from "@/core/api/attribute-type/type";
import type {
  AttributeValue,
  CreateAttributeValueRequest,
  UpdateAttributeValueRequest,
} from "@/core/api/attribute-value/type";
import { slugify } from "@/shared/utils/slugify";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import AlertMessage from "@/foundation/components/info/AlertMessage";

interface Props {
  open: boolean;
  mode: "create" | "update";
  onOpenChange: (open: boolean) => void;
  attributeType?: AttributeType;
  initialData?: AttributeValue;
  onSubmit?: (
    payload: CreateAttributeValueRequest | UpdateAttributeValueRequest,
    mode: "create" | "update"
  ) => Promise<void> | void;
}

const AttributeValueModal: React.FC<Props> = ({
  open,
  mode,
  onOpenChange,
  attributeType,
  initialData,
  onSubmit,
}) => {
  const [form, setForm] = React.useState<CreateAttributeValueRequest>({
    attributeTypeId: attributeType?._id || initialData?.attributeTypeId || "",
    label: initialData?.label || initialData?.value || "",
    value: initialData?.value || "",
    colorCode: initialData?.colorCode || "",
    isActive: initialData?.isActive ?? true,
  });
  const [isValueManual, setIsValueManual] = React.useState(false);

  React.useEffect(() => {
    setForm({
      attributeTypeId: attributeType?._id || initialData?.attributeTypeId || "",
      label: initialData?.label || initialData?.value || "",
      value: initialData?.value || "",
      colorCode: initialData?.colorCode || "",
      isActive: initialData?.isActive ?? true,
    });
    setIsValueManual(false);
  }, [attributeType, initialData]);

  React.useEffect(() => {
    if (!isValueManual && form.label) {
      setForm((prev) => ({ ...prev, value: slugify(prev.label, "_") }));
    }
  }, [form.label, isValueManual]);

  const handleChange = (key: keyof CreateAttributeValueRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Thêm giá trị" : "Cập nhật giá trị"}
      size="xl"
    >
      <Form.Root>
        <div className="flex flex-col gap-6">
          <ScrollView className="!h-[520px] max-h-[70vh]" hideScrollbarY={false}>
            <div className="flex flex-col gap-6 p-0.5">
              <AlertMessage
                type="info"
                title="Thông tin giá trị"
                message="Tên hiển thị và mã hệ thống sẽ được dùng để đồng bộ với SKU. Vui lòng kiểm tra kỹ trước khi lưu."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="attrValue-type"
                  label="Loại thuộc tính"
                  value={attributeType?.name || "Chưa chọn"}
                  disabled
                  className="md:col-span-2"
                />
                <Input
                  name="attrValue-label"
                  label="Tên hiển thị"
                  placeholder="vd: Xanh Midnight"
                  value={form.label || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("label", e.target.value)
                  }
                  required
                />
                <Input
                  name="attrValue-value"
                  label="Mã hệ thống (slug)"
                  value={form.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setIsValueManual(true);
                    handleChange("value", slugify(e.target.value, "_"));
                  }}
                  required
                  placeholder="vd: midnight_blue"
                  description="Tên không dấu để mapping với SKU/SKU seed."
                />
                <Input
                  name="attrValue-color"
                  label="Mã màu (tuỳ chọn)"
                  placeholder="#000000 hoặc rgba(...)"
                  value={form.colorCode || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("colorCode", e.target.value)
                  }
                />
                <div className="flex items-center justify-between rounded-lg border border-divider-1 px-4 py-3 md:col-span-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-9">Trạng thái hiển thị</span>
                    <span className="text-xs text-neutral-6">
                      Tắt nếu giá trị này không còn áp dụng cho sản phẩm.
                    </span>
                  </div>
                  <Switch
                    name="attrValue-active"
                    label="Hoạt động"
                    labelPosition="left"
                    checked={!!form.isActive}
                    onChange={(checked) => handleChange("isActive", !!checked)}
                  />
                </div>
              </div>
            </div>
          </ScrollView>
          <div className="flex justify-end gap-3 pt-4 border-t border-divider-1">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              disabled={!attributeType}
              onClick={async () => {
                if (mode === "update" && initialData?._id) {
                  const payload: UpdateAttributeValueRequest = { _id: initialData._id, ...form };
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

export default AttributeValueModal;
