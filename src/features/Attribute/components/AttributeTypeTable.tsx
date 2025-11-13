import React from "react";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Chip from "@/foundation/components/info/Chip";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { EditIcon, TrashIcon, MousePointerClick } from "lucide-react";
import type { AttributeType } from "@/core/api/attribute-type/type";

import { useAttributeValueTable } from "../hooks/useAttributeValueTable";

interface Props {
  data: AttributeType[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onEdit?: (item: AttributeType) => void;
  onDelete?: (id: string) => void;
  onSelectType?: (item: AttributeType) => void;
  selectedId?: string;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const AttributeTypeTable: React.FC<Props> = ({
  data = [],
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onSelectType,
  selectedId,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
}) => {
  const [expanded, setExpanded] = React.useState<AttributeType | null>(null);

  const columns: ColumnWithSummary<AttributeType>[] = [
    {
      id: "name",
      header: "Tên loại",
      accessorKey: "name",
      cell: (info) => (
        <div className="flex items-center gap-2 max-w-[240px]">
          <span
            className="font-semibold truncate text-neutral-10"
            title={String(info.getValue() ?? "")}
          >
            {info.getValue() as string}
          </span>
          {/* no extra badge for now */}
        </div>
      ),
      size: 220,
      meta: { sticky: "left", className: "z-[1]" },
    },
    {
      id: "categoryId",
      header: "Danh mục",
      accessorKey: "categoryId",
      cell: (info) => {
        const category = info.row.original.categoryId;
        const name = typeof category === "object" && category ? category.name : "-";
        return <span className="text-neutral-8">{name}</span>;
      },
      size: 180,
    },
    {
      id: "description",
      header: "Mô tả",
      accessorKey: "description",
      cell: (info) => (
        <span
          className="text-neutral-8 truncate max-w-[260px]"
          title={(info.getValue() as string) || "-"}
        >
          {(info.getValue() as string) || "-"}
        </span>
      ),
      size: 260,
    },
    {
      id: "is_multiple",
      header: "Nhiều giá trị",
      accessorKey: "is_multiple",
      cell: (info) => (
        <span className="text-neutral-8">{(info.getValue() as boolean) ? "Có" : "Không"}</span>
      ),
      size: 140,
      meta: { align: "text-center", className: "text-center" },
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
              rounded="full"
              size="sm"
            >
              {isActive ? "Hoạt động" : "Tạm dừng"}
            </Chip>
          </div>
        );
      },
      meta: { className: "text-center", align: "text-center" },
      size: 140,
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
          <Tooltip content="Chọn loại" side="top" delayDuration={100}>
            <Button
              variant="ghost"
              size="sm"
              className="transition-colors duration-200 text-primary-6 hover:bg-primary-10"
              icon={<MousePointerClick />}
              onClick={(e) => {
                e.stopPropagation();
                onSelectType?.(info.row.original);
              }}
            />
          </Tooltip>
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
    <>
      <PaginatedTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onPageChange={onPageChange}
        onRowClick={(row) => {
          const item = row as AttributeType;
          setExpanded((prev) => (prev?._id === item._id ? null : item));
          onSelectType?.(item);
        }}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        scrollHeightOffset={280}
        itemsPerPage={itemsPerPage}
        showIndex
        showPagination
        idCol={"_id"}
        containerClassName="bg-background-1 border border-divider-1 rounded-lg shadow-sm overflow-x-auto"
        tableClassName="min-w-full"
        headerClassName="bg-gradient-to-r from-neutral-1 to-neutral-2 border-b border-divider-1"
        rowClassName={
          (selectedId ? "" : "") +
          " border-b border-divider-1 hover:bg-cell-header transition-colors duration-150"
        }
        hideScrollbarX={false}
      />
    </>
  );
};

export default AttributeTypeTable;
