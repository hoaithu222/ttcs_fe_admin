import React, { useEffect } from "react";
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
import { Wallet } from "lucide-react";
import { WalletTransaction } from "@/core/api/wallet/type";

const WalletPage: React.FC = () => {
  const transactions = useAppSelector(selectTransactions);
  const isLoading = useAppSelector(selectWalletLoading);
  const pagination = useAppSelector(selectWalletPagination);
  const filters = useAppSelector(selectWalletFilters);
  const { fetchPendingTransactions } = useWalletActions();

  useEffect(() => {
    fetchPendingTransactions({ page: 1, limit: 10, status: "all" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchPendingTransactions({
      page,
      limit: pagination.limit,
      type: filters.type,
      status: "all", // Lấy tất cả giao dịch
    });
  };

  const handleTypeFilterChange = (type: WalletTransaction["type"] | undefined) => {
    fetchPendingTransactions({
      page: 1,
      limit: pagination.limit,
      type,
      status: "all", // Lấy tất cả giao dịch
    });
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
            <h3 className="mb-0 text-xl font-bold text-start text-neutral-10">Quản lý giao dịch ví</h3>
            <p className="text-sm text-neutral-6 text-start">Xem danh sách giao dịch và trạng thái từ hệ thống</p>
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
          page={pagination?.page ?? 1}
          totalPages={pagination?.totalPages ?? 1}
          totalItems={pagination?.total ?? 0}
          itemsPerPage={pagination?.limit ?? 10}
        />
      </div>
    </div>
  );
};

export default WalletPage;

