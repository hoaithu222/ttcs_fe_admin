import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectProducts,
  selectProductLoading,
  selectProductPagination,
} from "../slice/product.selector";
import { useProductActions } from "../hooks/useProductActions";
import TableProduct from "../components/TableProduct";
import FormFilterProduct from "../components/FormFilterProduct";
import ModalViolateProduct from "../components/ModalViolateProduct";
import ModalViewViolation from "../components/ModalViewViolation";
import ModalReopenViolation from "../components/ModalReopenViolation";
import { Product } from "@/core/api/products/type";

const ProductsPage: React.FC = () => {
  const products = useAppSelector(selectProducts);
  const isLoading = useAppSelector(selectProductLoading);
  const pagination = useAppSelector(selectProductPagination);
  const { fetchProducts, updateProductStatus } = useProductActions();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showViolateModal, setShowViolateModal] = useState(false);
  const [showViewViolationModal, setShowViewViolationModal] = useState(false);
  const [showReopenViolationModal, setShowReopenViolationModal] = useState(false);

  // DEBUG LOGGING
  useEffect(() => {
    console.log("=== ProductsPage State ===");
    console.log("products length:", products?.length);
    console.log("pagination:", pagination);
    console.log("isLoading:", isLoading);
  }, [products, pagination, isLoading]);

  useEffect(() => {
    fetchProducts({ page: 1, limit: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchProducts({
      page,
      limit: pagination.limit,
    });
  };

  const handleViolateClick = (product: Product) => {
    setSelectedProduct(product);
    setShowViolateModal(true);
  };

  const handleViewViolation = (product: Product) => {
    setSelectedProduct(product);
    setShowViewViolationModal(true);
  };

  const handleViolateSubmit = (violationNote: string) => {
    if (!selectedProduct) return;
    updateProductStatus(selectedProduct._id, "violated", violationNote);
    setShowViolateModal(false);
    setSelectedProduct(null);
  };

  const handleReopenViolationClick = (product: Product) => {
    setSelectedProduct(product);
    setShowReopenViolationModal(true);
  };

  const handleReopenViolationSubmit = () => {
    if (!selectedProduct) return;
    updateProductStatus(selectedProduct._id, "approved");
    setShowReopenViolationModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-6 min-h-screen bg-background-base">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="mb-0 text-xl font-bold text-neutral-10">Quản lý sản phẩm</h3>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg border border-divider-1 mb-6">
        <FormFilterProduct />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-divider-1 overflow-hidden">
        <TableProduct
          data={products}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onViolate={handleViolateClick}
          onViewViolation={handleViewViolation}
          onReopenViolation={handleReopenViolationClick}
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      </div>

      {/* Violate Modal */}
      <ModalViolateProduct
        open={showViolateModal}
        onOpenChange={setShowViolateModal}
        product={selectedProduct}
        onConfirm={handleViolateSubmit}
        isLoading={isLoading}
      />

      {/* View Violation Modal */}
      <ModalViewViolation
        open={showViewViolationModal}
        onOpenChange={setShowViewViolationModal}
        product={selectedProduct}
      />

      {/* Reopen Violation Modal */}
      <ModalReopenViolation
        open={showReopenViolationModal}
        onOpenChange={setShowReopenViolationModal}
        product={selectedProduct}
        onConfirm={handleReopenViolationSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductsPage;
