import React, { useState, useEffect } from "react";
import Modal from "@/foundation/components/modal/Modal";
import Button from "@/foundation/components/buttons/Button";
import Select from "@/foundation/components/input/Select";
import Input from "@/foundation/components/input/Input";
import * as Form from "@radix-ui/react-form";
import { WalletTransaction } from "@/core/api/wallet/type";

interface UpdateStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: WalletTransaction | null;
  onConfirm: (status: WalletTransaction["status"], notes?: string) => void;
  isLoading?: boolean;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  open,
  onOpenChange,
  transaction,
  onConfirm,
  isLoading = false,
}) => {
  const [status, setStatus] = useState<WalletTransaction["status"]>("pending");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (transaction) {
      setStatus(transaction.status);
      setNotes("");
    }
  }, [transaction]);

  const handleConfirm = () => {
    if (!transaction) return;
    onConfirm(status, notes.trim() || undefined);
  };

  if (!transaction) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Cập nhật trạng thái giao dịch"
      size="md"
    >
      <Form.Root>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-neutral-6">Thông tin giao dịch:</p>
            <div className="p-3 bg-background-2 rounded-lg space-y-1">
              <p className="text-sm">
                <span className="font-medium">Mã GD:</span>{" "}
                <span className="font-mono text-xs">{transaction._id}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Loại:</span> {transaction.type}
              </p>
              <p className="text-sm">
                <span className="font-medium">Số tiền:</span>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(transaction.amount)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Trạng thái hiện tại:</span> {transaction.status}
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-10">
              Trạng thái mới *
            </label>
            <Select
              name="status"
              value={status}
              onChange={(value) => setStatus(value as WalletTransaction["status"])}
              options={[
                { value: "pending", label: "Đang chờ" },
                { value: "completed", label: "Hoàn thành" },
                { value: "failed", label: "Thất bại" },
                { value: "cancelled", label: "Đã hủy" },
              ]}
              sizeSelect="md"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-10">
              Ghi chú (tùy chọn)
            </label>
            <Input
              name="notes"
              type="text"
              placeholder="Nhập ghi chú..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outlined"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm} loading={isLoading}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Form.Root>
    </Modal>
  );
};

export default UpdateStatusModal;

