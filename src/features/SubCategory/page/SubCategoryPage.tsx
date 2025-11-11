import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectSubCategories,
  selectSubCategoryLoading,
  selectSubCategoryPagination,
  selectSubCategoryFilters,
} from "../slice/subCategory.selector";
import { useSubCategoryActions } from "../hooks/useSubCategoryActions";
import SubCategoryTable from "../components/SubCategoryTable";
import ModalAddSubCategory from "../components/ModalAddSubCategory";
import ModalEditSubCategory from "../components/ModalEditSubCategory";
import Button from "@/foundation/components/buttons/Button";
import Icon from "@/foundation/components/icons/Icon";
import SubCategoryFilter from "../components/SubCategoryFilter";
import { SubCategory } from "@/core/api/sub-categories/type";
import { useCategoryActions } from "@/features/Category/hooks/useCategoryActions";
import { selectCategories } from "@/features/Category/slice/category.selector";
import ConfirmModal from "@/foundation/components/modal/ModalConfirm";

const SubCategoryPage: React.FC = () => {
  const subCategories = useAppSelector(selectSubCategories);
  const isLoading = useAppSelector(selectSubCategoryLoading);
  const pagination = useAppSelector(selectSubCategoryPagination);
  const filters = useAppSelector(selectSubCategoryFilters);
  const { fetchSubCategories, deleteSubCategory } = useSubCategoryActions();
  const { fetchCategories } = useCategoryActions();
  const categories = useAppSelector(selectCategories);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubCategories({ page: 1, limit: 10 });
    if (!categories || categories.length === 0) {
      fetchCategories({ page: 1, limit: 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchSubCategories({
      page,
      limit: pagination.limit,
      search: filters.search,
      isActive: filters.isActive,
      parentId: filters.parentId,
    });
  };

  const handleEdit = (item: SubCategory) => {
    setSelectedSubCategory(item);
    setIsEditModalOpen(true);
  };

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteSubCategory(pendingDeleteId);
    setIsConfirmDeleteModalOpen(false);
    setPendingDeleteId(null);
    fetchSubCategories({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      isActive: filters.isActive,
      parentId: filters.parentId,
    });
  };

  const handleAddSuccess = () => {
    fetchSubCategories({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      isActive: filters.isActive,
      parentId: filters.parentId,
    });
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedSubCategory(null);
    fetchSubCategories({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      isActive: filters.isActive,
      parentId: filters.parentId,
    });
  };

  console.log(categories, "categories");
  console.log(subCategories, "subCategories");

  return (
    <div className="p-6 min-h-screen bg-background-base">
      <div className="flex justify-between items-center mb-6">
        <h3 className="mb-0 text-xl font-bold text-neutral-10">Quản lý danh mục con</h3>
        <Button
          variant="outlined"
          icon={<Icon name="Plus" size="sm" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Thêm danh mục con
        </Button>
      </div>

      <div className="my-3">
        <SubCategoryFilter />
      </div>

      <div className="mt-4 h-[calc(100vh - 300px)] overflow-y-auto">
        <SubCategoryTable
          data={Array.isArray(subCategories) ? subCategories : []}
          isLoading={Boolean(isLoading)}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleRequestDelete}
          page={pagination?.page ?? 1}
          totalPages={pagination?.totalPages ?? 1}
          totalItems={pagination?.total ?? 0}
          itemsPerPage={pagination?.limit ?? 10}
          category={categories}
        />
      </div>

      <ModalAddSubCategory
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) handleAddSuccess();
        }}
      />

      <ModalEditSubCategory
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setSelectedSubCategory(null);
            handleEditSuccess();
          }
        }}
        subCategory={selectedSubCategory}
      />

      <ConfirmModal
        open={isConfirmDeleteModalOpen}
        onOpenChange={setIsConfirmDeleteModalOpen}
        title="Xác nhận xóa danh mục con"
        content="Bạn có chắc chắn muốn xóa danh mục con này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        iconType="warning"
        decorClasses={{
          container: "bg-background-1",
          border: "border-warning",
          glow: "shadow-[0_0_0_6px_rgba(255,217,61,0.08)]",
        }}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmDeleteModalOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
};

export default SubCategoryPage;
