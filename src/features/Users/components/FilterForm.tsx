import * as Form from "@radix-ui/react-form";
import React, { useState } from "react";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import { useUserActions } from "../hooks/useUserActions";
import { useAppSelector } from "@/app/store";
import { selectUserFilters } from "../slice/user.selector";

const FilterForm = () => {
  const { fetchUsers } = useUserActions();
  const filters = useAppSelector(selectUserFilters);

  const [searchValue, setSearchValue] = useState(filters.search);
  const [statusValue, setStatusValue] = useState<string>(filters.status || "");
  const [roleValue, setRoleValue] = useState<string>(filters.role || "");
  const [limitValue, setLimitValue] = useState<string>("10");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusValue(value === "all" ? "" : value);
  };

  const handleRoleChange = (value: string) => {
    setRoleValue(value === "all" ? "" : value);
  };

  const handleLimitChange = (value: string) => {
    setLimitValue(value);
  };

  const handleApplyFilter = () => {
    const status =
      statusValue === "" ? undefined : (statusValue as "active" | "inactive" | "suspended");
    const role = roleValue === "" ? undefined : (roleValue as "admin" | "user" | "moderator");
    fetchUsers({
      page: 1,
      limit: parseInt(limitValue || "10", 10),
      search: searchValue,
      status,
      role,
    });
  };

  const handleClearFilter = () => {
    setSearchValue("");
    setStatusValue("");
    setRoleValue("");
    setLimitValue("10");
    fetchUsers({ page: 1, limit: 10 });
  };

  const hasActiveFilters = searchValue !== "" || statusValue !== "" || roleValue !== "";

  return (
    <Form.Root>
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            name="search"
            placeholder="Tìm kiếm theo tên, email..."
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
              { value: "active", label: "Đang hoạt động" },
              { value: "inactive", label: "Không hoạt động" },
              { value: "suspended", label: "Bị khóa" },
            ]}
            sizeSelect="md"
          />
        </div>

        {/* Role Select */}
        <div className="w-[200px]">
          <Select
            name="role"
            placeholder="Tất cả vai trò"
            value={roleValue}
            onChange={handleRoleChange}
            defaultValue="all"
            options={[
              { value: "all", label: "Tất cả vai trò" },
              { value: "admin", label: "Quản trị viên" },
              { value: "user", label: "Người dùng" },
              { value: "moderator", label: "Điều hành viên" },
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

export default FilterForm;
