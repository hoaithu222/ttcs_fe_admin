import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectShops,
  selectShopLoading,
  selectShopPagination,
  selectShopFilters,
} from "../slice/Shop.selector";
import { useShopActions } from "../hooks/useShopActions";
import TableShop from "../components/TableShop";
import FormFilter from "../components/FormFilter";
import ConfirmModal from "@/foundation/components/modal/ModalConfirm";
import ModalViewShop from "../components/ModalViewShop";
import { Shop } from "@/core/api/shops/type";

const ShopPage: React.FC = () => {
  const shops = useAppSelector(selectShops);
  const isLoading = useAppSelector(selectShopLoading);
  const pagination = useAppSelector(selectShopPagination);
  const filters = useAppSelector(selectShopFilters);
  const { fetchShops, deleteShop, approveShop, rejectShop, suspendShop } = useShopActions();

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isConfirmApproveModalOpen, setIsConfirmApproveModalOpen] = useState(false);
  const [isConfirmRejectModalOpen, setIsConfirmRejectModalOpen] = useState(false);
  const [isConfirmSuspendModalOpen, setIsConfirmSuspendModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "delete" | "approve" | "reject" | "suspend" | null
  >(null);

  useEffect(() => {
    fetchShops({ page: 1, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchShops({
      page,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status as "pending" | "active" | "blocked" | undefined,
      isActive: filters.isActive,
      isVerified: filters.isVerified,
    });
  };

  const handleRequestDelete = (id: string) => {
    setPendingActionId(id);
    setPendingAction("delete");
    setIsConfirmDeleteModalOpen(true);
  };

  const handleRequestApprove = (id: string) => {
    setPendingActionId(id);
    setPendingAction("approve");
    setIsConfirmApproveModalOpen(true);
  };

  const handleRequestReject = (id: string) => {
    setPendingActionId(id);
    setPendingAction("reject");
    setIsConfirmRejectModalOpen(true);
  };

  const handleRequestSuspend = (id: string) => {
    setPendingActionId(id);
    setPendingAction("suspend");
    setIsConfirmSuspendModalOpen(true);
  };

  const handleViewShop = (shop: Shop) => {
    setSelectedShop(shop);
    setIsViewModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!pendingActionId || !pendingAction) return;

    switch (pendingAction) {
      case "delete":
        deleteShop(pendingActionId);
        setIsConfirmDeleteModalOpen(false);
        break;
      case "approve":
        approveShop(pendingActionId);
        setIsConfirmApproveModalOpen(false);
        break;
      case "reject":
        rejectShop(pendingActionId);
        setIsConfirmRejectModalOpen(false);
        break;
      case "suspend":
        suspendShop(pendingActionId);
        setIsConfirmSuspendModalOpen(false);
        break;
    }

    setPendingActionId(null);
    setPendingAction(null);

    // Refresh list after action
    setTimeout(() => {
      fetchShops({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status as "pending" | "active" | "blocked" | undefined,
        isActive: filters.isActive,
        isVerified: filters.isVerified,
      });
    }, 500);
  };

  const handleCancelAction = () => {
    setIsConfirmDeleteModalOpen(false);
    setIsConfirmApproveModalOpen(false);
    setIsConfirmRejectModalOpen(false);
    setIsConfirmSuspendModalOpen(false);
    setPendingActionId(null);
    setPendingAction(null);
  };

  return (
    <div className="p-6 min-h-screen bg-background-base">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="mb-0 text-xl font-bold text-neutral-10">Quản lý cửa hàng</h3>
      </div>

      <div className="my-3">
        <FormFilter />
      </div>

      {/* Table */}
      <div className="mt-4 h-[calc(100vh - 300px)] overflow-y-auto">
        <TableShop
          data={shops}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onView={handleViewShop}
          onApprove={handleRequestApprove}
          onReject={handleRequestReject}
          onSuspend={handleRequestSuspend}
          onDelete={handleRequestDelete}
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      </div>

      {/* View Modal */}
      <ModalViewShop
        open={isViewModalOpen}
        onOpenChange={(open) => {
          setIsViewModalOpen(open);
          if (!open) setSelectedShop(null);
        }}
        shop={selectedShop}
        onApprove={selectedShop?.status === "pending" ? handleRequestApprove : undefined}
        onReject={selectedShop?.status === "pending" ? handleRequestReject : undefined}
      />

      {/* Modals */}
      <ConfirmModal
        open={isConfirmDeleteModalOpen}
        onOpenChange={setIsConfirmDeleteModalOpen}
        title="Xác nhận xóa cửa hàng"
        content="Bạn có chắc chắn muốn xóa cửa hàng này? Hành động này không thể hoàn tác."
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

      <ConfirmModal
        open={isConfirmApproveModalOpen}
        onOpenChange={setIsConfirmApproveModalOpen}
        title="Xác nhận duyệt cửa hàng"
        content="Bạn có chắc chắn muốn duyệt cửa hàng này? Cửa hàng sẽ được kích hoạt và có thể bắt đầu hoạt động."
        confirmText="Duyệt"
        cancelText="Hủy"
        iconType="success"
        decorClasses={{
          container: "bg-background-1",
          border: "border-success",
          glow: "shadow-[0_0_0_6px_rgba(34,197,94,0.08)]",
        }}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      <ConfirmModal
        open={isConfirmRejectModalOpen}
        onOpenChange={setIsConfirmRejectModalOpen}
        title="Xác nhận từ chối cửa hàng"
        content="Bạn có chắc chắn muốn từ chối cửa hàng này? Cửa hàng sẽ bị từ chối và không thể hoạt động."
        confirmText="Từ chối"
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

      <ConfirmModal
        open={isConfirmSuspendModalOpen}
        onOpenChange={setIsConfirmSuspendModalOpen}
        title="Xác nhận khóa cửa hàng"
        content="Bạn có chắc chắn muốn khóa cửa hàng này? Cửa hàng sẽ bị tạm ngưng hoạt động."
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
    </div>
  );
};

export default ShopPage;
