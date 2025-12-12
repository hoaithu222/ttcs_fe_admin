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
import * as Form from "@radix-ui/react-form";
import { User } from "@/core/api/users/type";
import { UserCog, Mail, User as UserIcon, Shield } from "lucide-react";

const UsersPage: React.FC = () => {
  const users = useAppSelector(selectUsers);
  const isLoading = useAppSelector(selectUserLoading);
  const pagination = useAppSelector(selectUserPagination);
  const filters = useAppSelector(selectUserFilters);
  const { fetchUsers, deleteUser, suspendUser, unlockUser, updateUserRole } = useUserActions();

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isConfirmSuspendModalOpen, setIsConfirmSuspendModalOpen] = useState(false);
  const [isConfirmUnlockModalOpen, setIsConfirmUnlockModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"delete" | "suspend" | "unlock" | null>(null);
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

  const handleRequestUnlock = (id: string) => {
    setPendingActionId(id);
    setPendingAction("unlock");
    setIsConfirmUnlockModalOpen(true);
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
      case "unlock":
        unlockUser(pendingActionId);
        setIsConfirmUnlockModalOpen(false);
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
    setIsConfirmUnlockModalOpen(false);
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
          data={Array.isArray(users) ? users : []}
          isLoading={Boolean(isLoading)}
          onPageChange={handlePageChange}
          onView={handleViewUser}
          onDelete={handleRequestDelete}
          onSuspend={handleRequestSuspend}
          onUnlock={handleRequestUnlock}
          onEditRole={handleRequestEditRole}
          page={pagination?.page ?? 1}
          totalPages={pagination?.totalPages ?? 1}
          totalItems={pagination?.total ?? 0}
          itemsPerPage={pagination?.limit ?? 10}
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

      {/* Unlock Modal */}
      <ConfirmModal
        open={isConfirmUnlockModalOpen}
        onOpenChange={setIsConfirmUnlockModalOpen}
        title="Xác nhận mở khóa người dùng"
        content="Bạn có chắc chắn muốn mở khóa người dùng này? Người dùng sẽ có thể đăng nhập lại sau khi được mở khóa."
        confirmText="Mở khóa"
        cancelText="Hủy"
        iconType="success"
        decorClasses={{
          container: "bg-background-1",
          border: "border-success",
          glow: "shadow-[0_0_0_6px_rgba(45,208,132,0.08)]",
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
        size="md"
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-1">
              <UserCog className="w-5 h-5 text-primary-6" />
            </div>
            <span className="text-xl font-semibold text-neutral-10">Chỉnh sửa quyền người dùng</span>
          </div>
        }
        padding="p-6"
      >
        <Form.Root>
          <div className="space-y-6">
            {selectedUser && (
              <>
                {/* User Info Card */}
                <div className="rounded-xl border border-border-1 bg-background-1 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-1 border border-primary-3">
                      <UserIcon className="w-6 h-6 text-primary-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-xs font-medium text-neutral-6 uppercase tracking-wide">
                        Người dùng
                      </p>
                      <p className="mb-2 text-base font-semibold text-neutral-10 truncate">
                        {selectedUser.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-5 flex-shrink-0" />
                        <p className="text-sm text-neutral-7 truncate">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-neutral-10">
                    <Shield className="w-4 h-4 text-primary-6" />
                    Vai trò
                  </label>
                  <Select
                    name="role"
                    value={selectedRole}
                    onChange={setSelectedRole}
                    options={[
                      { value: "user", label: "Người dùng" },
                      // { value: "moderator", label: "Điều hành viên" },
                      { value: "admin", label: "Quản trị viên" },
                    ]}
                    sizeSelect="md"
                  />
                  <p className="text-xs text-neutral-6 mt-1">
                    Vai trò hiện tại: <span className="font-medium text-neutral-8">{selectedUser.role === "admin" ? "Quản trị viên" : "Người dùng"}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-border-1">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditRoleModalOpen(false);
                      setSelectedUser(null);
                      setSelectedRole("");
                    }}
                    className="min-w-[100px]"
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleConfirmEditRole}
                    className="min-w-[140px]"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </>
            )}
          </div>
        </Form.Root>
      </Modal>
    </div>
  );
};

export default UsersPage;
