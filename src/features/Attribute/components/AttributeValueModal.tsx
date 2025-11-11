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
    value: initialData?.value || "",
  });

  React.useEffect(() => {
    setForm({
      attributeTypeId: attributeType?._id || initialData?.attributeTypeId || "",
      value: initialData?.value || "",
    });
  }, [attributeType, initialData]);

  const handleChange = (key: keyof CreateAttributeValueRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Thêm giá trị" : "Cập nhật giá trị"}
    >
      <Form.Root>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <Input
              name="attrValue-type"
              label="Loại thuộc tính"
              value={attributeType?.name || "Chưa chọn"}
              disabled
            />
            <Input
              name="attrValue-value"
              label="Giá trị"
              value={form.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("value", e.target.value)
              }
              required
            />
          </div>
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
