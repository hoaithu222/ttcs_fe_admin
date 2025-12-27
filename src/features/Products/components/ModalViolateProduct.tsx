import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Modal from "@/foundation/components/modal/Modal";
import TextArea from "@/foundation/components/input/TextArea";
import Button from "@/foundation/components/buttons/Button";
import { Product } from "@/core/api/products/type";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { AlertTriangle } from "lucide-react";

interface ModalViolateProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: (violationNote: string) => void;
  isLoading?: boolean;
}

const ModalViolateProduct: React.FC<ModalViolateProductProps> = ({
  open,
  onOpenChange,
  product,
  onConfirm,
  isLoading = false,
}) => {
  const [violationNote, setViolationNote] = useState("");

  const handleConfirm = () => {
    if (!violationNote.trim()) {
      return;
    }
    onConfirm(violationNote);
    handleClose();
  };

  const handleClose = () => {
    setViolationNote("");
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={
        <div className="flex gap-3 items-center">
          <IconCircleWrapper size="md" color="error">
            <AlertTriangle className="text-red-500" />
          </IconCircleWrapper>
          <span>Đánh dấu vi phạm</span>
        </div>
      }
    >
      <Form.Root
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleConfirm();
        }}
      >
        <div className="space-y-4">
          {product && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Sản phẩm:</p>
              <p className="font-medium text-gray-900">{product.name}</p>
            </div>
          )}

          <TextArea
            name="violationNote"
            label="Lý do vi phạm"
            placeholder="Nhập chi tiết lý do vi phạm..."
            value={violationNote}
            onChange={(e) => setViolationNote(e.target.value)}
            rows={5}
            required
            error={violationNote === "" ? "Vui lòng nhập lý do vi phạm" : undefined}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              type="button"
            >
              Hủy
            </Button>
            <Button
              color="red"
              type="submit"
              disabled={!violationNote.trim() || isLoading}
              loading={isLoading}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Form.Root>
    </Modal>
  );
};

export default ModalViolateProduct;
