import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import { useShopActions } from "../hooks/useShopActions";
import { useAppSelector } from "@/app/store";
import { selectShopFilters } from "../slice/Shop.selector";

const FormFilter = () => {
  const { fetchShops } = useShopActions();
  const filters = useAppSelector(selectShopFilters);

  const [searchValue, setSearchValue] = useState(filters.search);
  const [statusValue, setStatusValue] = useState<string>(filters.status || "");
  const [isActiveValue, setIsActiveValue] = useState<string>(
    filters.isActive !== undefined ? (filters.isActive ? "true" : "false") : ""
  );
  const [isVerifiedValue, setIsVerifiedValue] = useState<string>(
    filters.isVerified !== undefined ? (filters.isVerified ? "true" : "false") : ""
  );
  const [limitValue, setLimitValue] = useState<string>("10");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusValue(value === "all" ? "" : value);
  };

  const handleIsActiveChange = (value: string) => {
    setIsActiveValue(value === "all" ? "" : value);
  };

  const handleIsVerifiedChange = (value: string) => {
    setIsVerifiedValue(value === "all" ? "" : value);
  };

  const handleLimitChange = (value: string) => {
    setLimitValue(value);
  };

  const handleApplyFilter = () => {
    const status =
      statusValue === "" ? undefined : (statusValue as "pending" | "active" | "blocked");
    const isActive = isActiveValue === "" ? undefined : isActiveValue === "true";
    const isVerified = isVerifiedValue === "" ? undefined : isVerifiedValue === "true";
    fetchShops({
      page: 1,
      limit: parseInt(limitValue || "10", 10),
      search: searchValue,
      status,
      isActive,
      isVerified,
    });
  };

  const handleClearFilter = () => {
    setSearchValue("");
    setStatusValue("");
    setIsActiveValue("");
    setIsVerifiedValue("");
    setLimitValue("10");
    fetchShops({ page: 1, limit: 10 });
  };

  const hasActiveFilters =
    searchValue !== "" || statusValue !== "" || isActiveValue !== "" || isVerifiedValue !== "";

  return (
    <Form.Root>
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            name="search"
            placeholder="Tìm kiếm theo tên cửa hàng..."
            iconLeft={<Icon name="MagnifyingGlass" size="sm" color="neutral" />}
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyFilter();
              }
            }}
          />
        </div>

        {/* Status Select */}
        <div className="w-[200px]">
          <Select
            name="status"
            placeholder="Tất cả trạng thái"
            value={statusValue}
            onChange={handleStatusChange}
            defaultValue="all"
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "pending", label: "Chờ duyệt" },
              { value: "active", label: "Đang hoạt động" },
              { value: "blocked", label: "Bị khóa" },
            ]}
            sizeSelect="md"
          />
        </div>

        {/* IsActive Select */}
        <div className="w-[200px]">
          <Select
            name="isActive"
            placeholder="Tất cả hoạt động"
            value={isActiveValue}
            onChange={handleIsActiveChange}
            defaultValue="all"
            options={[
              { value: "all", label: "Tất cả hoạt động" },
              { value: "true", label: "Đang hoạt động" },
              { value: "false", label: "Không hoạt động" },
            ]}
            sizeSelect="md"
          />
        </div>

        {/* IsVerified Select */}
        <div className="w-[200px]">
          <Select
            name="isVerified"
            placeholder="Tất cả xác thực"
            value={isVerifiedValue}
            onChange={handleIsVerifiedChange}
            defaultValue="all"
            options={[
              { value: "all", label: "Tất cả xác thực" },
              { value: "true", label: "Đã xác thực" },
              { value: "false", label: "Chưa xác thực" },
            ]}
            sizeSelect="md"
          />
        </div>

        {/* số items trên trang */}
        <div className="w-[150px]">
          <Select
            name="limit"
            placeholder="Số items trên trang"
            value={limitValue}
            onChange={handleLimitChange}
            options={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ]}
            sizeSelect="md"
          />
        </div>

        {/* Apply Button */}
        <Button onClick={handleApplyFilter} variant="outlined">
          Tìm kiếm
        </Button>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button onClick={handleClearFilter} variant="text" icon={<Icon name="XMark" size="sm" />}>
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </Form.Root>
  );
};

export default FormFilter;
