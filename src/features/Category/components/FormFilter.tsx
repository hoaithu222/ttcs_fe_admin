import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { useAppSelector } from "@/app/store";
import { selectCategoryFilters } from "../slice/category.selector";

const FormFilter = () => {
  const { fetchCategories } = useCategoryActions();
  const filters = useAppSelector(selectCategoryFilters);

  const [searchValue, setSearchValue] = useState(filters.search);
  const [isActiveValue, setIsActiveValue] = useState<string>(
    filters.isActive !== undefined ? (filters.isActive ? "true" : "false") : ""
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleIsActiveChange = (value: string) => {
    setIsActiveValue(value);
  };

  const handleApplyFilter = () => {
    const isActive = isActiveValue === "" ? undefined : isActiveValue === "true";
    fetchCategories({
      page: 1,
      limit: 10,
      search: searchValue,
      isActive,
    });
  };

  const handleClearFilter = () => {
    setSearchValue("");
    setIsActiveValue("");
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
            options={[
              { value: "true", label: "Đang hoạt động" },
              { value: "false", label: "Không hoạt động" },
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
