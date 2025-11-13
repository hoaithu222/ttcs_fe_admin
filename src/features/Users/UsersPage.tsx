import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectUsers,
  selectUserLoading,
  selectUserPagination,
  selectUserFilters,
} from "./slice/user.selector";
import { useUserActions } from "./hooks/useUserActions";
import UserTable from "./components/UserTable";
import FilterForm from "./components/FilterForm";
import ConfirmModal from "@/foundation/components/modal/ModalConfirm";
import Modal from "@/foundation/components/modal/Modal";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import { User } from "@/core/api/users/type";

const UsersPage: React.FC = () => {
  const users = useAppSelector(selectUsers);
  const isLoading = useAppSelector(selectUserLoading);
  const pagination = useAppSelector(selectUserPagination);
  const filters = useAppSelector(selectUserFilters);
  const { fetchUsers, deleteUser, suspendUser, updateUserRole } = useUserActions();

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isConfirmSuspendModalOpen, setIsConfirmSuspendModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"delete" | "suspend" | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchUsers({
      page,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status as "active" | "inactive" | "suspended" | undefined,
      role: filters.role as "admin" | "user" | "moderator" | undefined,
    });
  };

  const handleRequestDelete = (id: string) => {
    setPendingActionId(id);
    setPendingAction("delete");
    setIsConfirmDeleteModalOpen(true);
  };

  const handleRequestSuspend = (id: string) => {
    setPendingActionId(id);
    setPendingAction("suspend");
    setIsConfirmSuspendModalOpen(true);
  };

  const handleRequestEditRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsEditRoleModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!pendingActionId || !pendingAction) return;

    switch (pendingAction) {
      case "delete":
        deleteUser(pendingActionId);
        setIsConfirmDeleteModalOpen(false);
        break;
      case "suspend":
        suspendUser(pendingActionId);
        setIsConfirmSuspendModalOpen(false);
        break;
    }

    setPendingActionId(null);
    setPendingAction(null);

    // Refresh list after action
    setTimeout(() => {
      fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status as "active" | "inactive" | "suspended" | undefined,
        role: filters.role as "admin" | "user" | "moderator" | undefined,
      });
    }, 500);
  };

  const handleCancelAction = () => {
    setIsConfirmDeleteModalOpen(false);
    setIsConfirmSuspendModalOpen(false);
    setPendingActionId(null);
    setPendingAction(null);
  };

  const handleConfirmEditRole = () => {
    if (!selectedUser || !selectedRole) return;

    updateUserRole(selectedUser._id, selectedRole as "admin" | "user" | "moderator");
    setIsEditRoleModalOpen(false);
    setSelectedUser(null);
    setSelectedRole("");

    // Refresh list after action
    setTimeout(() => {
      fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status as "active" | "inactive" | "suspended" | undefined,
        role: filters.role as "admin" | "user" | "moderator" | undefined,
      });
    }, 500);
  };

  return (
    <div className="p-6 min-h-screen bg-background-base">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="mb-0 text-xl font-bold text-neutral-10">Quản lý người dùng</h3>
      </div>

      <div className="my-3">
        <FilterForm />
      </div>

      {/* Table */}
      <div className="mt-4">
        <UserTable
          data={users}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onView={handleViewUser}
          onDelete={handleRequestDelete}
          onSuspend={handleRequestSuspend}
          onEditRole={handleRequestEditRole}
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        open={isConfirmDeleteModalOpen}
        onOpenChange={setIsConfirmDeleteModalOpen}
        title="Xác nhận xóa người dùng"
        content="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        iconType="warning"
        decorClasses={{
          container: "bg-background-1",
          border: "border-warning",
          glow: "shadow-[0_0_0_6px_rgba(255,217,61,0.08)]",
        }}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      {/* Suspend Modal */}
      <ConfirmModal
        open={isConfirmSuspendModalOpen}
        onOpenChange={setIsConfirmSuspendModalOpen}
        title="Xác nhận khóa người dùng"
        content="Bạn có chắc chắn muốn khóa người dùng này? Người dùng sẽ không thể đăng nhập sau khi bị khóa."
        confirmText="Khóa"
        cancelText="Hủy"
        iconType="error"
        decorClasses={{
          container: "bg-background-1",
          border: "border-error",
          glow: "shadow-[0_0_0_6px_rgba(239,68,68,0.08)]",
        }}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      {/* Edit Role Modal */}
      <Modal
        open={isEditRoleModalOpen}
        onOpenChange={(open) => {
          setIsEditRoleModalOpen(open);
          if (!open) {
            setSelectedUser(null);
            setSelectedRole("");
          }
        }}
        title="Chỉnh sửa quyền người dùng"
      >
        <div className="space-y-4">
          {selectedUser && (
            <>
              <div>
                <p className="text-sm text-neutral-6 mb-2">Người dùng:</p>
                <p className="font-medium text-neutral-10">{selectedUser.name}</p>
                <p className="text-sm text-neutral-7">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-10 mb-2">
                  Vai trò
                </label>
                <Select
                  value={selectedRole}
                  onChange={setSelectedRole}
                  options={[
                    { value: "user", label: "Người dùng" },
                    { value: "moderator", label: "Điều hành viên" },
                    { value: "admin", label: "Quản trị viên" },
                  ]}
                  sizeSelect="md"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditRoleModalOpen(false);
                    setSelectedUser(null);
                    setSelectedRole("");
                  }}
                >
                  Hủy
                </Button>
                <Button onClick={handleConfirmEditRole}>Lưu thay đổi</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
