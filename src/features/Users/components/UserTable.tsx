import React from "react";
import type { ColumnWithSummary } from "@/foundation/components/table/PaginatedTable";
import { User } from "@/core/api/users/type";
import PaginatedTable from "@/foundation/components/table/PaginatedTable";
import Button from "@/foundation/components/buttons/Button";
import Chip from "@/foundation/components/info/Chip";
import Tooltip from "@/foundation/components/tooltip/Tooltip";
import { TrashIcon, Eye, Ban, Edit } from "lucide-react";

interface UserTableProps {
  data: User[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onView?: (user: User) => void;
  onDelete?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onEditRole?: (user: User) => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  isLoading = false,
  onPageChange,
  onView,
  onDelete,
  onSuspend,
  onEditRole,
  page = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
}) => {
  const getStatusChip = (status?: string) => {
    switch (status) {
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
      case "inactive":
        return (
          <Chip
            colorClass="bg-warning text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">⏸</span>
              <span>Không hoạt động</span>
            </span>
          </Chip>
        );
      case "suspended":
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

  const getRoleChip = (role?: string) => {
    switch (role) {
      case "admin":
        return (
          <Chip
            colorClass="bg-primary-6 text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span>Quản trị viên</span>
          </Chip>
        );
      case "moderator":
        return (
          <Chip
            colorClass="bg-primary-7 text-white border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span>Điều hành viên</span>
          </Chip>
        );
      case "user":
      default:
        return (
          <Chip
            colorClass="bg-neutral-4 text-neutral-10 border-none"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            rounded="full"
            size="sm"
          >
            <span>Người dùng</span>
          </Chip>
        );
    }
  };

  const columns: ColumnWithSummary<User>[] = [
    {
      id: "avatar",
      header: "Avatar",
      accessorKey: "avatar",
      cell: (info) => {
        const avatar = info.getValue() as string | undefined;
        return (
          <div className="flex justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="object-cover w-10 h-10 rounded-full border-2 border-divider-1"
              />
            ) : (
              <div className="flex justify-center items-center w-10 h-10 rounded-full border-2 bg-neutral-3 border-divider-1">
                <span className="text-sm font-semibold text-neutral-6">
                  {(info.row.original.name || "U")[0].toUpperCase()}
                </span>
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
      header: "Tên",
      accessorKey: "name",
      cell: (info) => {
        const name = info.getValue() as string;
        return <div className="font-medium text-neutral-10">{name || "N/A"}</div>;
      },
      size: 200,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      cell: (info) => {
        const email = info.getValue() as string;
        return <div className="text-neutral-7">{email || "N/A"}</div>;
      },
      size: 250,
    },
    {
      id: "phone",
      header: "Số điện thoại",
      accessorKey: "phone",
      cell: (info) => {
        const phone = info.getValue() as string | undefined;
        return <div className="text-neutral-7">{phone || "N/A"}</div>;
      },
      size: 150,
    },
    {
      id: "role",
      header: "Vai trò",
      accessorKey: "role",
      cell: (info) => {
        const role = info.getValue() as string;
        return <div className="flex justify-center">{getRoleChip(role)}</div>;
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 150,
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "status",
      cell: (info) => {
        const status = info.getValue() as string;
        return <div className="flex justify-center">{getStatusChip(status)}</div>;
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 250,
    },
    {
      id: "isEmailVerified",
      header: "Xác thực Email",
      accessorKey: "isEmailVerified",
      cell: (info) => {
        const isEmailVerified = info.getValue() as boolean;
        return (
          <div className="flex justify-center">
            <Chip
              colorClass={
                isEmailVerified
                  ? "bg-primary-6 text-white border-none"
                  : "bg-neutral-4 text-neutral-10 border-none"
              }
              className="shadow-sm transition-all duration-200 hover:shadow-md"
              rounded="full"
              size="sm"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-xs">{isEmailVerified ? "✓" : "✗"}</span>
                <span>{isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}</span>
              </span>
            </Chip>
          </div>
        );
      },
      meta: {
        className: "text-center",
        align: "text-center",
      },
      size: 180,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (info) => {
        const user = info.row.original;
        const status = user.status;
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {/* Xem chi tiết */}
            <Tooltip content="Xem chi tiết" side="top" delayDuration={100}>
              <Button
                variant="ghost"
                size="sm"
                className="transition-colors duration-200 text-primary-6 hover:bg-primary-10"
                icon={<Eye className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(user);
                }}
                testId="view-user-btn"
              />
            </Tooltip>

            {/* Chỉnh sửa quyền */}
            <Tooltip content="Chỉnh sửa quyền" side="top" delayDuration={100}>
              <Button
                variant="ghost"
                size="sm"
                className="transition-colors duration-200 text-primary-7 hover:bg-primary-10"
                icon={<Edit className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRole?.(user);
                }}
                testId="edit-role-user-btn"
              />
            </Tooltip>

            {/* Khóa - chỉ hiển thị khi active hoặc inactive */}
            {(status === "active" || status === "inactive") && (
              <Tooltip content="Khóa người dùng" side="top" delayDuration={100}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-colors duration-200 text-warning hover:bg-warning/10"
                  icon={<Ban className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSuspend?.(user._id);
                  }}
                  testId="suspend-user-btn"
                />
              </Tooltip>
            )}

            {/* Xóa */}
            <Tooltip content="Xóa người dùng" side="top" delayDuration={100}>
              <Button
                variant="ghost"
                size="sm"
                className="transition-colors duration-200 text-error hover:bg-error/10"
                icon={<TrashIcon className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(user._id);
                }}
                testId="delete-user-btn"
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
      testId="user-table"
    />
  );
};

export default UserTable;
