import { Card } from "@/foundation/components/info/Card";
import { Package, Plus } from "lucide-react";
import Button from "@/foundation/components/buttons/Button";

const ProductsPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Package className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold">Product Catalog</h2>
        </div>
        <p className="text-gray-500">Product management functionality will be implemented here.</p>
      </Card>
    </div>
  );
};

export default ProductsPage;
