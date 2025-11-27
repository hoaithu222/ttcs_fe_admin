import React from "react";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { EditIcon, TrashIcon } from "lucide-react";
import type { AttributeValue } from "@/core/api/attribute-value/type";

interface Props {
  data: AttributeValue[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onEdit?: (item: AttributeValue) => void;
  onDelete?: (id: string) => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  disabled?: boolean;
}

const AttributeValueTable: React.FC<Props> = ({
  data = [],
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  disabled = false,
}) => {
  const columns: ColumnWithSummary<AttributeValue>[] = [
    {
      id: "label",
      header: "Tên hiển thị",
      accessorKey: "label",
      cell: (info) => (
        <div className="flex items-center gap-2 max-w-[240px]">
          <div className="flex flex-col">
            <span
              className="font-semibold text-neutral-10 truncate"
              title={String(info.getValue() ?? "")}
            >
              {(info.getValue() as string) || "-"}
            </span>
            <span className="text-[11px] font-mono text-neutral-5">
              {(info.row.original.value as string) || ""}
            </span>
          </div>
        </div>
      ),
      size: 300,
      meta: { sticky: "left", className: "z-[1]" },
    },
    {
      id: "colorCode",
      header: "Màu sắc",
      accessorKey: "colorCode",
      cell: (info) =>
        info.getValue() ? (
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full border border-border-1"
              style={{ backgroundColor: info.getValue() as string }}
            />
            <span className="text-xs font-mono text-neutral-7">{info.getValue() as string}</span>
          </div>
        ) : (
          <span className="text-neutral-4 text-xs">-</span>
        ),
      size: 160,
    },
    {
      id: "isActive",
      header: "Trạng thái",
      accessorKey: "isActive",
      cell: (info) => (
        <span className={`text-xs font-semibold ${info.getValue() ? "text-success" : "text-error"}`}>
          {info.getValue() ? "Hoạt động" : "Ẩn"}
        </span>
      ),
      size: 120,
      meta: { className: "text-center", align: "text-center" },
    },
    {
      id: "createdAt",
      header: "Tạo lúc",
      accessorKey: "createdAt",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 200,
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
      idCol={"_id"}
      containerClassName={
        (disabled ? "opacity-60 pointer-events-none " : "") +
        "bg-background-1 border border-divider-1 rounded-lg shadow-sm overflow-x-auto"
      }
      tableClassName="min-w-full"
      headerClassName="bg-gradient-to-r from-neutral-1 to-neutral-2 border-b border-divider-1"
      rowClassName="border-b border-divider-1 hover:bg-cell-header transition-colors duration-150"
      hideScrollbarX={false}
    />
  );
};

export default AttributeValueTable;
