import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { useAppSelector } from "@/app/store";
import { selectCategoryFilters } from "../slice/category.selector";
import { Activity } from "lucide-react";

const FormFilter = () => {
  const { fetchCategories } = useCategoryActions();
  const filters = useAppSelector(selectCategoryFilters);

  const [searchValue, setSearchValue] = useState(filters.search);
  const [isActiveValue, setIsActiveValue] = useState<string>(
    filters.isActive !== undefined ? (filters.isActive ? "true" : "false") : ""
  );
  const [limitValue, setLimitValue] = useState<string>("10");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleIsActiveChange = (value: string) => {
    setIsActiveValue(value === "all" ? "" : value);
  };

  const handleLimitChange = (value: string) => {
    setLimitValue(value);
  };

  const handleApplyFilter = () => {
    const isActive = isActiveValue === "" ? undefined : isActiveValue === "true";
    fetchCategories({
      page: 1,
      limit: parseInt(limitValue || "10", 10),
      search: searchValue,
      isActive,
    });
  };

  const handleClearFilter = () => {
    setSearchValue("");
    setIsActiveValue("");
    setLimitValue("10");
    fetchCategories({ page: 1, limit: 10 });
  };

  const hasActiveFilters = searchValue !== "" || isActiveValue !== "";

  return (
    <Form.Root>
      <div className="flex gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            name="search"
            placeholder="Tìm kiếm theo tên danh mục..."
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
        <div className="w-[300px]">
          <Select
            name="isActive"
            placeholder="Tất cả trạng thái"
            value={isActiveValue}
            onChange={handleIsActiveChange}
            defaultValue="all"
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "true", label: "Đang hoạt động" },
              { value: "false", label: "Không hoạt động" },
            ]}
            sizeSelect="md"
          />
        </div>
        {/* số items trên trang */}
        <div className="w-[300px]">
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
