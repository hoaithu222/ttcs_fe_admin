import React from "react";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import { Shop } from "@/core/api/shops/type";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Chip from "@/foundation/components/info/Chip";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { CheckCircle2, XCircle, Ban, TrashIcon, Eye, Unlock } from "lucide-react";

interface TableShopProps {
  data: Shop[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onView?: (shop: Shop) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onUnlock?: (id: string) => void;
  onDelete?: (id: string) => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const TableShop: React.FC<TableShopProps> = ({
  data,
  isLoading = false,
  onPageChange,
  onView,
  onApprove,
  onReject,
  onSuspend,
  onUnlock,
  onDelete,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
}) => {
  const getStatusChip = (status?: string) => {
    switch (status) {
      case "pending":
        return (
          <Chip
            colorClass="bg-warning text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">⏳</span>
              <span>Chờ duyệt</span>
            </span>
          </Chip>
        );
      case "active":
        return (
          <Chip
            colorClass="bg-success text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">✓</span>
              <span>Đang hoạt động</span>
            </span>
          </Chip>
        );
      case "blocked":
        return (
          <Chip
            colorClass="bg-error text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">✗</span>
              <span>Bị khóa</span>
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

  const columns: ColumnWithSummary<Shop>[] = [
    {
      id: "logo",
      header: "Logo",
      accessorKey: "logo",
      cell: (info) => {
        const formatImageUrl = (url: string) => {
          if (url.startsWith("http")) return url;
          return `https://res.cloudinary.com/dor0kslle/image/upload/${url}`;
        };
        return (
          <div className="flex justify-center">
            {info.row.original.logo ? (
              <img
                src={formatImageUrl(info.row.original.logo)}
                alt={info.row.original.name}
                className="object-cover w-16 h-16 rounded-lg border shadow-sm transition-all duration-200 2xl:w-20 2xl:h-20 border-divider-1 hover:shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
                }}
              />
            ) : (
              <div className="flex justify-center items-center w-16 h-16 rounded-lg border bg-neutral-2 border-divider-1">
                <span className="text-xs text-neutral-6">No Logo</span>
              </div>
            )}
          </div>
        );
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 100,
    },
    {
      id: "name",
      header: "Tên cửa hàng",
      accessorKey: "name",
      cell: (info) => {
        const name = info.getValue() as string;
        const description = info.row.original.description;
        return (
          <div className="flex flex-col gap-1 max-w-[240px]">
            <span className="font-semibold truncate text-neutral-10" title={name}>
              {name}
            </span>
            {description && (
              <span className="text-xs truncate text-neutral-6" title={description}>
                {description.length > 50 ? `${description.substring(0, 50)}...` : description}
              </span>
            )}
          </div>
        );
      },
      size: 250,
    },
    {
      id: "owner",
      header: "Chủ sở hữu",
      accessorKey: "owner",
      cell: (info) => {
        const shop = info.row.original;
        const owner = shop.owner;
        const contactName = (shop as any).contactName;
        const contactEmail = (shop as any).contactEmail;
        return (
          <div className="max-w-[200px]">
            <div
              className="font-medium truncate text-neutral-10"
              title={owner?.name || contactName || "N/A"}
            >
              {owner?.name || contactName || "N/A"}
            </div>
            <div
              className="text-sm truncate text-neutral-6"
              title={owner?.email || contactEmail || ""}
            >
              {owner?.email || contactEmail || ""}
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "status",
      cell: (info) => {
        const status = info.row.original.status;
        return <div className="flex justify-center">{getStatusChip(status)}</div>;
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 200,
    },
  
    {
      id: "actions",
      header: "Thao tác",
      cell: (info) => {
        const shop = info.row.original;
        const status = shop.status;
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {/* Xem chi tiết - luôn hiển thị */}
            <Tooltip content="Xem chi tiết" side="top" delayDuration={100}>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 transition-colors duration-200 hover:bg-blue-50"
                icon={<Eye className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(shop);
                }}
                testId="view-shop-btn"
              />
            </Tooltip>

            {/* Duyệt/Từ chối - chỉ hiển thị khi pending */}
            {status === "pending" && (
              <>
                <Tooltip content="Duyệt cửa hàng" side="top" delayDuration={100}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-colors duration-200 text-success hover:bg-success/10"
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove?.(shop._id);
                    }}
                    testId="approve-shop-btn"
                  />
                </Tooltip>
                <Tooltip content="Từ chối cửa hàng" side="top" delayDuration={100}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-colors duration-200 text-warning hover:bg-warning/10"
                    icon={<XCircle className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject?.(shop._id);
                    }}
                    testId="reject-shop-btn"
                  />
                </Tooltip>
              </>
            )}

            {/* Khóa - chỉ hiển thị khi active */}
            {status === "active" && (
              <Tooltip content="Khóa cửa hàng" side="top" delayDuration={100}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-colors duration-200 text-error hover:bg-error/10"
                  icon={<Ban className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSuspend?.(shop._id);
                  }}
                  testId="suspend-shop-btn"
                />
              </Tooltip>
            )}

            {/* Mở khóa - chỉ hiển thị khi blocked */}
            {status === "blocked" && (
              <Tooltip content="Mở khóa cửa hàng" side="top" delayDuration={100}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-colors duration-200 text-success hover:bg-success/10"
                  icon={<Unlock className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnlock?.(shop._id);
                  }}
                  testId="unlock-shop-btn"
                />
              </Tooltip>
            )}

            {/* Xóa - luôn hiển thị */}
            <Tooltip content="Xóa cửa hàng" side="top" delayDuration={100}>
              <Button
                variant="ghost"
                size="sm"
                className="transition-colors duration-200 text-error hover:bg-error/10"
                icon={<TrashIcon className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(shop._id);
                }}
                testId="delete-shop-btn"
              />
            </Tooltip>
          </div>
        );
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 300,
    },
  ];

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
      testId="shop-table"
    />
  );
};

export default TableShop;
