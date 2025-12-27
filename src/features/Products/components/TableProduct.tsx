import React from "react";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import { Product } from "@/core/api/products/type";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Chip from "@/foundation/components/info/Chip";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { AlertTriangle, Eye, CheckCircle } from "lucide-react";

interface TableProductProps {
  data: Product[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onViolate?: (product: Product) => void;
  onViewViolation?: (product: Product) => void;
  onReopenViolation?: (product: Product) => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const TableProduct: React.FC<TableProductProps> = ({
  data,
  isLoading = false,
  onPageChange,
  onViolate,
  onViewViolation,
  onReopenViolation,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 20,
}) => {

  
  const getImageUrl = (images: any[]): string => {
    if (!images || images.length === 0) return "";
    const firstImage = images[0];
    if (typeof firstImage === "string") return firstImage;
    return (firstImage as any)?.url || "";
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: { label: "Đã duyệt", colorClass: "bg-success text-white border-none" },
      hidden: { label: "Đã ẩn", colorClass: "bg-gray-100 text-gray-800 border-none" },
      violated: { label: "Vi phạm", colorClass: "bg-error text-white border-none" },
    };
    const badge = badges[status as keyof typeof badges] || badges.approved;
    console.log("Badge for status", status, ":", badge);
    return (
      <Chip
        size="sm"
        colorClass={badge.colorClass}
        className="shadow-sm transition-all duration-200 hover:shadow-md"
        rounded="full"
      >
        {badge.label}
      </Chip>
    );
  };

  const columns: ColumnWithSummary<Product>[] = [
    {
      id: "image",
      header: "Hình ảnh",
      accessorKey: "images",
      cell: (info) => {
        const imageUrl = getImageUrl(info.row.original.images);
        return (
          <div className="flex justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={info.row.original.name}
                className="object-cover w-16 h-16 rounded-lg border shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            ) : null}
          </div>
        );
      },
      meta: { className: "text-center", align: "text-center" },
      size: 100,
    },
    {
      id: "name",
      header: "Tên sản phẩm",
      accessorKey: "name",
      cell: (info) => (
        <div className="max-w-[300px]">
          <p className="font-semibold text-sm text-neutral-10 truncate" title={info.row.original.name}>
            {info.row.original.name}
          </p>
         
        </div>
      ),
      size: 320,
    },
    {
      id: "shop",
      header: "Shop",
      cell: (info) => (
        <span className="text-sm font-medium text-neutral-9 line-clamp-1" title={info.row.original.shopId?.name || "N/A"}>
          {info.row.original.shopId?.name || "N/A"}
        </span>
      ),
      size: 180,
    },
    {
      id: "price",
      header: "Giá",
      cell: (info) => (
        <span className="text-sm font-semibold text-neutral-10">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(info.row.original.price)}
        </span>
      ),
      size: 150,
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: (info) => (
        <div className="flex justify-center">
          {getStatusBadge(info.row.original.status)}
        </div>
      ),
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 140,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (info) => {
        const product = info.row.original;
        return (
          <div className="flex gap-2 justify-center">
            {product.status === "violated" ? (
              <>
                <Tooltip content="Xem chi tiết vi phạm" side="top" delayDuration={100}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-colors duration-200 text-error hover:bg-error/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewViolation?.(product);
                    }}
                    testId="view-violation-btn"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Mở lại sản phẩm" side="top" delayDuration={100}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-colors duration-200 text-success hover:bg-success/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReopenViolation?.(product);
                    }}
                    testId="reopen-violation-btn"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip content="Đánh dấu vi phạm" side="top" delayDuration={100}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-colors duration-200 text-error hover:bg-error/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViolate?.(product);
                  }}
                  testId="violate-product-btn"
                >
                  <AlertTriangle className="w-4 h-4" />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 120,
    },
  ];

  

  return (
    <PaginatedTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      page={page}
      itemsPerPage={itemsPerPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      showIndex
      showPagination
      containerClassName="bg-background-1 border border-divider-1 rounded-lg shadow-sm overflow-x-auto"
      tableClassName="min-w-full"
      headerClassName="bg-gradient-to-r from-neutral-1 to-neutral-2 border-b border-divider-1"
      rowClassName="border-b border-divider-1 hover:bg-cell-header transition-colors duration-150"
      hideScrollbarX={false}
      testId="product-table"
    />
  );
};

export default TableProduct;
