import React from "react";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import { Category } from "@/core/api/categories/type";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Chip from "@/foundation/components/info/Chip";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { EditIcon, TrashIcon } from "lucide-react";

interface TableCategoryProps {
  data: Category[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const TableCategory: React.FC<TableCategoryProps> = ({
  data,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
}) => {
  const columns: ColumnWithSummary<Category>[] = [
    {
      id: "image_Icon",
      header: "Icon",
      accessorKey: "image_Icon",
      cell: (info) => (
        <div className="flex justify-center">
          {info.row.original.image_Icon && (
            <img
              src={info.row.original.image_Icon.url}
              alt={info.row.original.name}
              className="object-cover w-16 h-16 rounded-lg border shadow-sm transition-all duration-200 2xl:w-20 2xl:h-20 border-divider-1 hover:shadow-md"
            />
          )}
        </div>
      ),
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 100, // Fixed size instead of string
    },
    {
      id: "image",
      header: "Hình ảnh",
      accessorKey: "image",
      cell: (info) => {
        const gallery = info.row.original.image;
        const src = Array.isArray(gallery) && gallery.length > 0 ? gallery[0]?.url : undefined;
        return (
          <div className="flex justify-center">
            {src ? (
              <img
                src={src}
                alt={info.row.original.name}
                className="object-cover w-16 h-16 rounded-lg border shadow-sm transition-all duration-200 2xl:w-20 2xl:h-20 border-divider-1 hover:shadow-md"
              />
            ) : null}
          </div>
        );
      },
      meta: { className: "text-center", align: "text-center" },
      size: 150, // Fixed size instead of string
    },
    {
      id: "image_Background",
      header: "Banner",
      accessorKey: "image_Background",
      cell: (info) => (
        <div className="flex justify-center">
          {info.row.original.image_Background && (
            <img
              src={info.row.original.image_Background.url}
              alt={info.row.original.name}
              className="object-cover w-28 h-12 rounded-md border shadow-sm transition-all duration-200 2xl:w-36 2xl:h-14 border-divider-1 hover:shadow-md"
            />
          )}
        </div>
      ),
      meta: { className: "text-center", align: "text-center" },
      size: 200, // Fixed size instead of string
    },
    {
      id: "name",
      header: "Tên danh mục",
      accessorKey: "name",
      cell: (info) => (
        <div className="flex gap-3 items-center max-w-[240px]">
          <span
            className="font-semibold text-neutral-10 truncate"
            title={String(info.getValue() ?? "")}
          >
            {info.getValue() as string}
          </span>
        </div>
      ),
      size: 200, // Fixed size instead of string
    },
    {
      id: "description",
      header: "Mô tả",
      accessorKey: "description",
      cell: (info) => {
        const description = (info.getValue() as string) || "-";
        const truncatedDescription =
          description.length > 50 ? `${description.substring(0, 50)}...` : description;

        return (
          <Tooltip
            content={description !== "-" ? description : "Không có mô tả"}
            disabled={description === "-"}
            side="top"
          >
            <div className="py-2 max-w-xs truncate cursor-help text-neutral-6">
              {truncatedDescription}
            </div>
          </Tooltip>
        );
      },
      size: 300, // Fixed size instead of string
    },
    {
      id: "isActive",
      header: "Trạng thái",
      accessorKey: "isActive",
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <div className="flex justify-center">
            <Chip
              colorClass={
                isActive ? "bg-success text-white border-none" : "bg-error text-white border-none"
              }
              className="shadow-sm transition-all duration-200 hover:shadow-md"
              rounded="full"
              size="sm"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-xs">{isActive ? "✓" : "✗"}</span>
                <span>{isActive ? "Hoạt động" : "Tạm dừng"}</span>
              </span>
            </Chip>
          </div>
        );
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <Tooltip content="Chỉnh sửa danh mục" side="top" delayDuration={100}>
            <Button
              variant="ghost"
              size="sm"
              className="transition-colors duration-200 text-primary-6 hover:bg-primary-10"
              icon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(info.row.original);
              }}
              testId="edit-category-btn"
            />
          </Tooltip>
          <Tooltip content="Xóa danh mục" side="top" delayDuration={100}>
            <Button
              variant="ghost"
              size="sm"
              className="transition-colors duration-200 text-error hover:bg-error/10"
              icon={<TrashIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(info.row.original._id);
              }}
              testId="delete-category-btn"
            />
          </Tooltip>
        </div>
      ),
      meta: {
        className: "text-center",
        align: "text-center",
      },
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
      testId="category-table"
    />
  );
};

export default TableCategory;
