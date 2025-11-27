import React from "react";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Chip from "@/foundation/components/info/Chip";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { EditIcon, TrashIcon, MousePointerClick } from "lucide-react";
import type { AttributeType } from "@/core/api/attribute-type/type";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchCategoriesStart } from "@/features/Category/slice/category.slice";

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
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);

  React.useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategoriesStart({ page: 1, limit: 500 }));
    }
  }, [categories?.length, dispatch]);

  const categoryNameMap = React.useMemo(
    () =>
      (categories || []).reduce<Record<string, string>>((acc, cat) => {
        if (cat?._id) acc[cat._id] = cat.name;
        return acc;
      }, {}),
    [categories]
  );

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
      size: 300,
      meta: {  className: "z-[1]" },
    },
    {
      id: "code",
      header: "Mã chuẩn",
      accessorKey: "code",
      cell: (info) => (
        <span className="text-xs font-mono text-neutral-7 bg-neutral-2 px-2 py-1 rounded">
          {info.getValue() as string}
        </span>
      ),
      size: 180,
    },
    {
      id: "categories",
      header: "Danh mục",
      accessorKey: "categoryIds",
      cell: (info) => {
        const original = info.row.original;
        const categoryArray =
          (Array.isArray((original as any).categoryIds) && (original as any).categoryIds.length
            ? (original as any).categoryIds
            : (Array.isArray((original as any).categories) && (original as any).categories.length
              ? (original as any).categories
              : [original.categoryId].filter(Boolean))) || [];
        const names =
          categoryArray.length > 0
            ? categoryArray
                .map((cat: any) => {
                  if (!cat) return undefined;
                  if (typeof cat === "string") {
                    return categoryNameMap[cat] || cat;
                  }
                  if (typeof cat === "object") {
                    return cat.name || categoryNameMap[cat._id] || cat._id;
                  }
                  return undefined;
                })
                .filter((name: any): name is string => Boolean(name))
            : [];
        if (names.length === 0) {
          return <span className="text-neutral-8">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {names.map((name: string, idx: number) => (
              <span
                key={`${name}-${idx}`}
                className="px-2 py-0.5 rounded-full bg-neutral-2 text-xs text-neutral-8"
              >
                {name}
              </span>
            ))}
          </div>
        );
      },
      size: 220,
    },
    {
      id: "description",
      header: "Mô tả",
      accessorKey: "description",
      cell: (info) => (
        <span
          className="text-neutral-8 truncate max-w-[300px]"
          title={(info.getValue() as string) || "-"}
        >
          {(info.getValue() as string) || "-"}
        </span>
      ),
      size: 560,
    },
    {
      id: "inputType",
      header: "Kiểu nhập",
      accessorKey: "inputType",
      cell: (info) => (
        <span className="text-neutral-8 capitalize">{info.getValue()?.toString() || "-"}</span>
      ),
      size: 120,
      meta: { className: "text-center", align: "text-center" },
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
