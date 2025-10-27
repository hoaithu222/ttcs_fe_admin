import React, { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  selectCategories,
  selectCategoryLoading,
  selectCategoryPagination,
} from "../slice/category.selector";
import { useCategoryActions } from "../hooks/useCategoryActions";
import TableCategory from "../components/TableCategory";
import ModalAddCategory from "../components/ModalAddCategory";
import ModalEditCategory from "../components/ModalEditCategory";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import Input from "@/foundation/components/input/Input";
import { Category } from "@/core/api/categories/type";
import { PlusIcon } from "lucide-react";

const CategoryPage: React.FC = () => {
  const dispatch = useAppDispatch(); // Not used but kept for future use
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoryLoading);
  const pagination = useAppSelector(selectCategoryPagination);
  const { fetchCategories, deleteCategory } = useCategoryActions();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories({ page: 1, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchCategories({ page, limit: pagination.limit, search: searchTerm });
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    fetchCategories({ page: pagination.page, limit: pagination.limit });
  };

  const handleAddSuccess = () => {
    fetchCategories({ page: pagination.page, limit: pagination.limit });
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    fetchCategories({ page: pagination.page, limit: pagination.limit });
  };

  const handleSearch = () => {
    fetchCategories({ page: 1, limit: pagination.limit, search: searchTerm });
  };

  return (
    <div className="p-6 min-h-screen bg-background-base">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="mb-0 text-xl font-bold text-neutral-10">Quản lý danh mục</h3>
        <Button
          variant="outlined"
          icon={<PlusIcon />}
          onClick={() => setIsAddModalOpen(true)}
          testId="add-category-btn"
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Table */}
      <TableCategory
        data={categories}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
      />

      {/* Modals */}
      <ModalAddCategory
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) handleAddSuccess();
        }}
      />

      <ModalEditCategory
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setSelectedCategory(null);
            handleEditSuccess();
          }
        }}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoryPage;
