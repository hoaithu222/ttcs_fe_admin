import React from "react";
import Modal from "@/foundation/components/modal/Modal";
import Button from "@/foundation/components/buttons/Button";
import { Product } from "@/core/api/products/type";
import IconCircleWrapper from "@/foundation/components/icons/IconCircleWrapper";
import { AlertTriangle } from "lucide-react";

interface ModalViewViolationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const ModalViewViolation: React.FC<ModalViewViolationProps> = ({
  open,
  onOpenChange,
  product,
}) => {
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
          <span>Chi tiết vi phạm</span>
        </div>
      }
    >
      <div className="space-y-4">
        {product && (
          <>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Sản phẩm:</p>
              <p className="font-medium text-gray-900">{product.name}</p>
              {product.shopId && (
                <p className="text-sm text-gray-600 mt-2">
                  Shop: <span className="font-medium">{product.shopId.name}</span>
                </p>
              )}
            </div>

            {product.violationNote ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do vi phạm
                </label>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {product.violationNote}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Sản phẩm này đã bị đánh dấu vi phạm nhưng chưa có lý do cụ thể.
                </p>
              </div>
            )}

            {product.reviewedAt && (
              <div className="text-sm text-gray-600">
                <p>
                  Đánh dấu vi phạm vào:{" "}
                  <span className="font-medium">
                    {new Date(product.reviewedAt).toLocaleString("vi-VN")}
                  </span>
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalViewViolation;

