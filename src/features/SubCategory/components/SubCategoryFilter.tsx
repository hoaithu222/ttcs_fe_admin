import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import { useSubCategoryActions } from "../hooks/useSubCategoryActions";
import { useAppSelector } from "@/app/store";
import { selectSubCategoryFilters } from "../slice/subCategory.selector";
import { selectCategories } from "@/features/Category/slice/category.selector";

const SubCategoryFilter = () => {
  const { fetchSubCategories } = useSubCategoryActions();
  const filters = useAppSelector(selectSubCategoryFilters);
  const categories = useAppSelector(selectCategories);

  const [searchValue, setSearchValue] = useState(filters.search);
  const [isActiveValue, setIsActiveValue] = useState<string>(
    filters.isActive !== undefined ? (filters.isActive ? "true" : "false") : ""
  );
  const [limitValue, setLimitValue] = useState<string>("10");
  const [parentIdValue, setParentIdValue] = useState<string>(filters.parentId || "all");

  const handleApplyFilter = () => {
    const isActive = isActiveValue === "" ? undefined : isActiveValue === "true";
    const parentId = parentIdValue === "all" ? undefined : parentIdValue;
    fetchSubCategories({
      page: 1,
      limit: parseInt(limitValue || "10", 10),
      search: searchValue,
      isActive,
      parentId,
    });
  };

  const handleClearFilter = () => {
    setSearchValue("");
    setIsActiveValue("");
    setParentIdValue("all");
    setLimitValue("10");
    fetchSubCategories({ page: 1, limit: 10 });
  };

  const hasActiveFilters = searchValue !== "" || isActiveValue !== "" || parentIdValue !== "";

  return (
    <Form.Root>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Input
            name="search"
            placeholder="Tìm kiếm theo tên danh mục con..."
            iconLeft={<Icon name="MagnifyingGlass" size="sm" color="neutral" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyFilter();
              }
            }}
          />
        </div>

        <div className="w-[260px]">
          <Select
            name="parentId"
            placeholder="Tất cả danh mục"
            value={parentIdValue}
            onChange={(v) => setParentIdValue(v)}
            options={[
              { value: "all", label: "Tất cả danh mục" },
              ...categories.map((c) => ({ value: c._id, label: c.name })),
            ]}
            sizeSelect="md"
          />
        </div>

        <div className="w-[220px]">
          <Select
            name="isActive"
            placeholder="Tất cả trạng thái"
            value={isActiveValue}
            onChange={(v) => setIsActiveValue(v === "all" ? "" : v)}
            defaultValue="all"
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "true", label: "Đang hoạt động" },
              { value: "false", label: "Không hoạt động" },
            ]}
            sizeSelect="md"
          />
        </div>

        <div className="w-[160px]">
          <Select
            name="limit"
            placeholder="Số items"
            value={limitValue}
            onChange={(v) => setLimitValue(v)}
            options={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ]}
            sizeSelect="md"
          />
        </div>

        <Button onClick={handleApplyFilter} variant="outlined">
          Tìm kiếm
        </Button>

        {hasActiveFilters && (
          <Button
            onClick={handleClearFilter}
            variant="text"
            icon={<Icon name="XMark" size="sm" className="text-neutral-9" />}
            className="text-neutral-9"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </Form.Root>
  );
};

export default SubCategoryFilter;
