import React from "react";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { EditIcon, TrashIcon } from "lucide-react";
import { SubCategory } from "@/core/api/sub-categories/type";
import { Category } from "@/core/api/categories/type";

interface Props {
  data: SubCategory[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onEdit?: (item: SubCategory) => void;
  onDelete?: (id: string) => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  category?: Category[];
}

const SubCategoryTable: React.FC<Props> = ({
  data,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  category = [],
}) => {
  const columns: ColumnWithSummary<SubCategory>[] = [
    {
      id: "image_Icon",
      header: "Icon",
      accessorKey: "image_Icon",
      cell: (info) => (
        <div className="flex justify-center">
          {(info.row.original as any).image_Icon && (info.row.original as any).image_Icon.url ? (
            <img
              src={(info.row.original as any).image_Icon.url as string}
              alt={info.row.original.name}
              className="object-cover w-12 h-12 rounded-lg border shadow-sm transition-all duration-200 2xl:w-14 2xl:h-14 border-divider-1 hover:shadow-md"
            />
          ) : null}
        </div>
      ),
      meta: { className: "text-center", align: "text-center" },
      size: 100, // Fixed size instead of string
    },
    {
      id: "image",
      header: "Hình ảnh",
      accessorKey: "image",
      cell: (info) => {
        const original = info.row.original as unknown as { image?: string | { url?: string } };
        const src = typeof original.image === "string" ? original.image : original.image?.url;
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
      cell: (info) => {
        const original = info.row.original as unknown as {
          image_Background?: string | { url?: string };
        };
        const src =
          typeof original.image_Background === "string"
            ? original.image_Background
            : original.image_Background?.url;
        return (
          <div className="flex justify-center">
            {src ? (
              <img
                src={src}
                alt={info.row.original.name}
                className="object-cover w-28 h-12 rounded-md border shadow-sm transition-all duration-200 2xl:w-36 2xl:h-14 border-divider-1 hover:shadow-md"
              />
            ) : null}
          </div>
        );
      },
      meta: { className: "text-center", align: "text-center" },
      size: 200, // Fixed size instead of string
    },
    {
      id: "name",
      header: "Tên danh mục con",
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
      id: "parentCategory",
      header: "Danh mục",
      cell: (info) => {
        const original = info.row.original as SubCategory;
        console.log(original, "original");
        console.log(category, "category");
        const categoryName = category.find((c: Category) => c._id === original.categoryId);
        return <span>{categoryName?.name || "-"}</span>;
      },
      size: 200, // Fixed size instead of string
    },
    {
      id: "isActive",
      header: "Trạng thái",
      accessorKey: "isActive",
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <div className="flex justify-center">
            <span className={isActive ? "text-green-600" : "text-error"}>
              {isActive ? "Hoạt động" : "Tạm dừng"}
            </span>
          </div>
        );
      },
      meta: { className: "text-center", align: "text-center" },
    },
    {
      id: "createdAt",
      header: "Ngày tạo",
      accessorKey: "createdAt",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 200, // Fixed size instead of string
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (info) => (
        <div className="flex gap-2 justify-center">
          <Tooltip content="Chỉnh sửa" side="top" delayDuration={100}>
            <Button
              variant="ghost"
              size="sm"
              className="transition-colors duration-200 text-primary-6 hover:bg-primary-10"
              icon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(info.row.original);
              }}
            />
          </Tooltip>
          <Tooltip content="Xóa" side="top" delayDuration={100}>
            <Button
              variant="ghost"
              size="sm"
              className="transition-colors duration-200 text-error hover:bg-error/10"
              icon={<TrashIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(info.row.original._id);
              }}
            />
          </Tooltip>
        </div>
      ),
      meta: { className: "text-center", align: "text-center" },
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
    />
  );
};

export default SubCategoryTable;
