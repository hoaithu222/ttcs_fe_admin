import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import { useProductActions } from "../hooks/useProductActions";
import { useAppSelector } from "@/app/store";
import { selectProductFilters } from "../slice/product.selector";

const FormFilterProduct = () => {
  const { fetchProducts } = useProductActions();
  const filters = useAppSelector(selectProductFilters);

  const [searchValue, setSearchValue] = useState(filters.search);
  const [statusValue, setStatusValue] = useState<string>(filters.status || "");
  const [limitValue, setLimitValue] = useState<string>("20");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusValue(value === "all" ? "" : value);
  };

  const handleLimitChange = (value: string) => {
    setLimitValue(value);
  };

  const handleApplyFilter = () => {
    const status = statusValue === "" ? undefined : (statusValue as "approved" | "hidden" | "violated");
    const limit = parseInt(limitValue || "20", 10);
    
    console.log("=== FormFilterProduct Apply Filter ===");
    console.log("Applying filter with:", { page: 1, limit, search: searchValue, status });
    
    fetchProducts({
      page: 1,
      limit,
      search: searchValue,
      status,
    });
  };

  const handleClearFilter = () => {
    setSearchValue("");
    setStatusValue("");
    setLimitValue("20");
    fetchProducts({ page: 1, limit: 20 });
  };

  const hasActiveFilters = searchValue !== "" || statusValue !== "";

  return (
    <Form.Root>
      <div className="flex gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            name="search"
            placeholder="Tìm kiếm theo tên sản phẩm..."
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
        <div className="w-[250px]">
          <Select
            name="status"
            placeholder="Tất cả trạng thái"
            value={statusValue}
            onChange={handleStatusChange}
            defaultValue="all"
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Đã duyệt", value: "approved" },
              { label: "Đã ẩn", value: "hidden" },
              { label: "Vi phạm", value: "violated" },
            ]}
          />
        </div>

        {/* Limit Select */}
        <div className="w-[120px]">
          <Select
            name="limit"
            placeholder="Số lượng"
            value={limitValue}
            onChange={handleLimitChange}
            options={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "50", value: "50" },
              { label: "100", value: "100" },
            ]}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleApplyFilter}
            icon={<Icon name="MagnifyingGlass" size="sm" />}
          >
            Lọc
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={handleClearFilter}
              icon={<Icon name="X" size="sm" />}
            >
              Xóa
            </Button>
          )}
        </div>
      </div>
    </Form.Root>
  );
};

export default FormFilterProduct;
