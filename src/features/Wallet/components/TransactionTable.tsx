import React from "react";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import { WalletTransaction } from "@/core/api/wallet/type";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Chip from "@/foundation/components/info/Chip";
import { CheckCircle2, XCircle, Clock, Eye, TestTube, AlertCircle, User } from "lucide-react";

interface TransactionTableProps {
  data: WalletTransaction[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onView?: (transaction: WalletTransaction) => void;
  onUpdateStatus?: (transaction: WalletTransaction) => void;
  onTestWebhook?: (transaction: WalletTransaction) => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  isLoading = false,
  onPageChange,
  onView,
  onUpdateStatus,
  onTestWebhook,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
}) => {
  // Calculate remaining time for pending deposits (30 minutes expiry)
  const getRemainingTime = (createdAt: string): { minutes: number; isExpiringSoon: boolean; isExpired: boolean } | null => {
    const created = new Date(createdAt);
    const now = new Date();
    const elapsed = now.getTime() - created.getTime();
    const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
    const remainingMinutes = 30 - elapsedMinutes;
    
    // Nếu đã quá 30 phút
    if (remainingMinutes <= 0) {
      return {
        minutes: 0,
        isExpiringSoon: true,
        isExpired: true,
      };
    }
    
    return {
      minutes: remainingMinutes,
      isExpiringSoon: remainingMinutes <= 5, // Cảnh báo khi còn <= 5 phút
      isExpired: false,
    };
  };

  const getStatusChip = (status: string, createdAt?: string, type?: string) => {
    switch (status) {
      case "completed":
        return (
          <Chip
            colorClass="bg-success text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Hoàn thành</span>
            </span>
          </Chip>
        );
      case "pending":
        const remainingTime = createdAt && type === "deposit" ? getRemainingTime(createdAt) : null;
        const isExpiringSoon = remainingTime?.isExpiringSoon || false;
        const isExpired = remainingTime?.isExpired || false;
        
        return (
          <div className="flex flex-col items-center gap-1">
            <Chip
              colorClass={isExpired ? "bg-error text-white border-none" : isExpiringSoon ? "bg-error text-white border-none" : "bg-warning text-white border-none"}
              className="shadow-sm transition-all duration-200 hover:shadow-md"
              rounded="full"
              size="sm"
            >
              <span className="flex items-center gap-1.5">
                {isExpired || isExpiringSoon ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                <span>{isExpired ? "Đã hết hạn" : "Đang chờ"}</span>
              </span>
            </Chip>
            {remainingTime && !isExpired && (
              <span className={`text-xs font-medium ${isExpiringSoon ? "text-error" : "text-warning"}`}>
                Còn {remainingTime.minutes} phút
              </span>
            )}
            {/* {isExpired && (
              <span className="text-xs font-medium text-error">
                Sẽ tự động hủy
              </span>
            )} */}
          </div>
        );
      case "failed":
        return (
          <Chip
            colorClass="bg-error text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <XCircle className="w-3 h-3" />
              <span>Thất bại</span>
            </span>
          </Chip>
        );
      case "cancelled":
        return (
          <Chip
            colorClass="bg-neutral-4 text-neutral-10 border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <XCircle className="w-3 h-3" />
              <span>Đã hủy</span>
            </span>
          </Chip>
        );
      default:
        return (
          <Chip
            colorClass="bg-neutral-4 text-neutral-10 border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span>Chưa xác định</span>
          </Chip>
        );
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
    });
  };

  const getUserDisplay = (userId: WalletTransaction["userId"]) => {
    if (!userId) return null;
    
    if (typeof userId === "string") {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-2">
            <User className="w-4 h-4 text-neutral-6" />
          </div>
          <span className="text-xs font-mono text-neutral-6">{userId.slice(-8)}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        {userId.avatar ? (
          <img
            src={userId.avatar}
            alt={userId.name || "User"}
            className="w-8 h-8 rounded-full object-cover border border-border-1"
          />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-1">
            <User className="w-4 h-4 text-primary-6" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-neutral-9 truncate">
            {userId.name || "Người dùng"}
          </span>
          {userId.email && (
            <span className="text-xs text-neutral-6 truncate">{userId.email}</span>
          )}
        </div>
      </div>
    );
  };

  const columns: ColumnWithSummary<WalletTransaction>[] = [
    {
      id: "_id",
      header: "Mã giao dịch",
      accessorKey: "_id",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <span className="font-mono text-xs text-neutral-7">
            {transaction._id.slice(-8)}
          </span>
        );
      },
      size: 150,
    },
    {
      id: "user",
      header: "Người dùng",
      accessorKey: "userId",
      cell: (info) => {
        const transaction = info.row.original;
        return getUserDisplay(transaction.userId) || (
          <span className="text-sm text-neutral-5">-</span>
        );
      },
      size: 220,
    },
    {
      id: "type",
      header: "Loại",
      accessorKey: "type",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <span className="text-sm font-medium text-neutral-9">
            {getTypeLabel(transaction.type)}
          </span>
        );
      },
      size: 120,
    },
    {
      id: "amount",
      header: "Số tiền",
      accessorKey: "amount",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <span className="font-semibold text-primary-6">
            {formatPrice(transaction.metadata?.originalAmount || transaction.amount)}
          </span>
        );
      },
      size: 150,
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "status",
      cell: (info) => {
        const transaction = info.row.original;
        return getStatusChip(transaction.status, transaction.createdAt, transaction.type);
      },
      size: 200,
      meta: {
        className: "text-center",
        align: "text-center",
      },
    },
    {
      id: "bankAccount",
      header: "Ngân hàng",
      accessorKey: "bankAccount",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <div className="text-sm text-neutral-7">
            {transaction.bankAccount ? (
              <>
                <p className="font-medium">{transaction.bankAccount.bankName}</p>
                <p className="text-xs">{transaction.bankAccount.accountNumber}</p>
              </>
            ) : (
              <span className="text-neutral-5">-</span>
            )}
          </div>
        );
      },
      size: 180,
    },
    {
      id: "createdAt",
      header: "Ngày tạo",
      accessorKey: "createdAt",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <span className="text-sm text-neutral-7">{formatDate(transaction.createdAt)}</span>
        );
      },
      size: 160,
    },
  ];

  if (onView || onUpdateStatus || onTestWebhook) {
    columns.push({
      id: "actions",
      header: "Thao tác",
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <div className="flex gap-2 items-center">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(transaction)}
                className="p-2"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {transaction.status === "pending" && onUpdateStatus && (
              <Button
                variant="outlined"
                size="sm"
                onClick={() => onUpdateStatus(transaction)}
                className="gap-1"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Cập nhật
              </Button>
            )}
            {transaction.status === "pending" && onTestWebhook && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTestWebhook(transaction)}
                className="gap-1 text-primary-6"
                title="Test webhook (demo)"
                icon={<TestTube className="w-4 h-4" />}
              />
            )}
          </div>
        );
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 400,
    });
  }

  return (
    <PaginatedTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      showIndex
      showPagination
      containerClassName="bg-background-1 border border-divider-1 rounded-lg shadow-sm overflow-x-auto"
      tableClassName="min-w-full"
      headerClassName="bg-gradient-to-r from-neutral-1 to-neutral-2 border-b border-divider-1"
      rowClassName="border-b border-divider-1 hover:bg-cell-header transition-colors duration-150"
      hideScrollbarX={false}
      testId="transaction-table"
    />
  );
};

export default TransactionTable;

