import React from "react";
import Modal from "@/foundation/components/modal/Modal";
import Button from "@/foundation/components/buttons/Button";
import { WalletTransaction } from "@/core/api/wallet/type";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ScrollView from "@/foundation/components/scroll/ScrollView";

interface ViewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: WalletTransaction | null;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({
  open,
  onOpenChange,
  transaction,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!transaction) return null;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success";
      case "pending":
        return "text-warning";
      case "failed":
        return "text-error";
      case "cancelled":
        return "text-neutral-6";
      default:
        return "text-neutral-7";
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      deposit: "Nạp tiền",
      withdraw: "Rút tiền",
      payment: "Thanh toán",
      refund: "Hoàn tiền",
      transfer: "Chuyển tiền",
    };
    return typeMap[type] || type;
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Chi tiết giao dịch"
      size="3xl"
    >
      <ScrollView className="h-[70vh]" hideScrollbarY={false}>
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-6 mb-1">Mã giao dịch</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-neutral-9">
                {transaction._id}
              </p>
              <button
                onClick={() => copyToClipboard(transaction._id, "id")}
                className="p-1 hover:bg-neutral-2 rounded transition-colors"
              >
                {copiedField === "id" ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-6" />
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-neutral-6 mb-1">Loại giao dịch</p>
            <p className="text-sm font-medium text-neutral-9">
              {getTypeLabel(transaction.type)}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-6 mb-1">Số tiền</p>
            <p className="text-lg font-bold text-primary-6">
              {formatPrice(transaction.amount)}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-6 mb-1">Trạng thái</p>
            <p className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-6 mb-1">Ngày tạo</p>
            <p className="text-sm text-neutral-7">{formatDate(transaction.createdAt)}</p>
          </div>

          {transaction.completedAt && (
            <div>
              <p className="text-sm text-neutral-6 mb-1">Ngày hoàn thành</p>
              <p className="text-sm text-neutral-7">{formatDate(transaction.completedAt)}</p>
            </div>
          )}
        </div>

        {/* Bank Account Info */}
        {transaction.bankAccount && (
          <div className="p-4 bg-background-2 rounded-lg">
            <p className="text-sm font-semibold text-neutral-9 mb-3">Thông tin ngân hàng</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-6">Ngân hàng:</span>
                <span className="text-sm font-medium text-neutral-9">
                  {transaction.bankAccount.bankName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-6">Số tài khoản:</span>
                <span className="text-sm font-medium text-neutral-9">
                  {transaction.bankAccount.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-6">Chủ tài khoản:</span>
                <span className="text-sm font-medium text-neutral-9">
                  {transaction.bankAccount.accountHolder}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* QR Code */}
        {transaction.qrCode && (
          <div className="p-4 bg-background-2 rounded-lg">
            <p className="text-sm font-semibold text-neutral-9 mb-3">QR Code</p>
            <div className="flex justify-center">
              <img
                src={transaction.qrCode}
                alt="QR Code"
                className="w-48 h-48 border border-border-1 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Description */}
        {transaction.description && (
          <div>
            <p className="text-sm font-semibold text-neutral-9 mb-2">Mô tả</p>
            <p className="text-sm text-neutral-7">{transaction.description}</p>
          </div>
        )}

        {/* Metadata */}
        {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
          <div className="p-4 bg-background-2 rounded-lg">
            <p className="text-sm font-semibold text-neutral-9 mb-3">Thông tin bổ sung</p>
            <pre className="text-xs text-neutral-7 overflow-auto">
              {JSON.stringify(transaction.metadata, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outlined" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </div>
      </ScrollView>
    </Modal>
  );
};

export default ViewTransactionModal;

