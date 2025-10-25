import { Card } from "@/foundation/components/info/Card";
import { Users, UserPlus } from "lucide-react";
import Button from "@/foundation/components/buttons/Button";

const UsersPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button className="flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Users className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">User List</h2>
        </div>
        <p className="text-gray-500">User management functionality will be implemented here.</p>
      </Card>
    </div>
  );
};

export default UsersPage;
