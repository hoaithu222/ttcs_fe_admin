import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectTransactions,
  selectWalletLoading,
  selectWalletPagination,
  selectWalletFilters,
} from "../slice/wallet.selector";
import { useWalletActions } from "../hooks/useWalletActions";
import TransactionTable from "../components/TransactionTable";
import FilterForm from "../components/FilterForm";
import UpdateStatusModal from "../components/UpdateStatusModal";
import ViewTransactionModal from "../components/ViewTransactionModal";
import ConfirmModal from "@/foundation/components/modal/ModalConfirm";
import { WalletTransaction } from "@/core/api/wallet/type";
import { Wallet } from "lucide-react";

const WalletPage: React.FC = () => {
  const transactions = useAppSelector(selectTransactions);
  const isLoading = useAppSelector(selectWalletLoading);
  const pagination = useAppSelector(selectWalletPagination);
  const filters = useAppSelector(selectWalletFilters);
  const { fetchPendingTransactions, updateTransaction, testWebhook } = useWalletActions();

  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isTestWebhookModalOpen, setIsTestWebhookModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);

  useEffect(() => {
    fetchPendingTransactions({ page: 1, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchPendingTransactions({
      page,
      limit: pagination.limit,
      type: filters.type,
    });
  };

  const handleTypeFilterChange = (type: WalletTransaction["type"] | undefined) => {
    fetchPendingTransactions({
      page: 1,
      limit: pagination.limit,
      type,
    });
  };

  const handleRequestUpdateStatus = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateStatusModalOpen(true);
  };

  const handleRequestView = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleRequestTestWebhook = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setIsTestWebhookModalOpen(true);
  };

  const handleConfirmUpdateStatus = (status: WalletTransaction["status"], notes?: string) => {
    if (!selectedTransaction) return;
    updateTransaction(selectedTransaction._id, { status, notes });
    setIsUpdateStatusModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleConfirmTestWebhook = () => {
    if (!selectedTransaction) return;
    testWebhook(selectedTransaction._id, selectedTransaction.amount, "completed");
    setIsTestWebhookModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="p-6 min-h-screen bg-background-base">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-6 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="mb-0 text-xl font-bold text-neutral-10">Quản lý giao dịch ví</h3>
            <p className="text-sm text-neutral-6">Xem và cập nhật trạng thái giao dịch nạp tiền</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="my-3">
        <FilterForm
          type={filters.type}
          onTypeChange={handleTypeFilterChange}
        />
      </div>

      {/* Table */}
      <div className="mt-4">
        <TransactionTable
          data={Array.isArray(transactions) ? transactions : []}
          isLoading={Boolean(isLoading)}
          onPageChange={handlePageChange}
          onView={handleRequestView}
          onUpdateStatus={handleRequestUpdateStatus}
          onTestWebhook={handleRequestTestWebhook}
          page={pagination?.page ?? 1}
          totalPages={pagination?.totalPages ?? 1}
          totalItems={pagination?.total ?? 0}
          itemsPerPage={pagination?.limit ?? 10}
        />
      </div>

      {/* Update Status Modal */}
      <UpdateStatusModal
        open={isUpdateStatusModalOpen}
        onOpenChange={setIsUpdateStatusModalOpen}
        transaction={selectedTransaction}
        onConfirm={handleConfirmUpdateStatus}
        isLoading={isLoading}
      />

      {/* View Transaction Modal */}
      <ViewTransactionModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        transaction={selectedTransaction}
      />

      {/* Test Webhook Modal */}
      <ConfirmModal
        open={isTestWebhookModalOpen}
        onOpenChange={setIsTestWebhookModalOpen}
        title="Test Webhook (Demo)"
        content={`Bạn có chắc muốn test webhook cho giao dịch này? Hệ thống sẽ simulate việc xác nhận chuyển khoản thành công.`}
        confirmText="Test"
        cancelText="Hủy"
        iconType="info"
        onConfirm={handleConfirmTestWebhook}
        onCancel={() => {
          setIsTestWebhookModalOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};

export default WalletPage;

