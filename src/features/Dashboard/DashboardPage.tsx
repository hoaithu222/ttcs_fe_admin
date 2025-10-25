import { Card } from "@/foundation/components/info/Card";
import { Users, Package, ShoppingCart } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Users</h3>
              <p className="text-gray-500">Manage user accounts</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Package className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Products</h3>
              <p className="text-gray-500">Manage product catalog</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <ShoppingCart className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-gray-500">View order history</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
