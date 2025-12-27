import React from "react";
import * as Form from "@radix-ui/react-form";
import Modal from "@/foundation/components/modal/Modal";
import Button from "@/foundation/components/buttons/Button";
import { Product } from "@/core/api/products/type";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { CheckCircle } from "lucide-react";

interface ModalReopenViolationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ModalReopenViolation: React.FC<ModalReopenViolationProps> = ({
  open,
  onOpenChange,
  product,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={
        <div className="flex gap-3 items-center">
          <IconCircleWrapper size="md" color="success">
            <CheckCircle className="text-green-500" />
          </IconCircleWrapper>
          <span>Mở lại sản phẩm vi phạm</span>
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
              {product.shopId && (
                <p className="text-sm text-gray-600 mt-2">
                  Shop: <span className="font-medium">{product.shopId.name}</span>
                </p>
              )}
            </div>
          )}

          {product?.violationNote && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do vi phạm trước đó
              </label>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {product.violationNote}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Bạn có chắc chắn muốn mở lại sản phẩm này không? Sản phẩm sẽ được chuyển sang trạng thái "Đã duyệt" và có thể hiển thị lại cho người dùng. Shop sẽ nhận được thông báo về việc mở lại sản phẩm.
            </p>
          </div>

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
              color="green"
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Xác nhận mở lại
            </Button>
          </div>
        </div>
      </Form.Root>
    </Modal>
  );
};

export default ModalReopenViolation;

