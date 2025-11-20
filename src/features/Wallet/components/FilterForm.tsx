import React from "react";
import Select from "@/foundation/components/input/Select";
import { WalletTransaction } from "@/core/api/wallet/type";
import * as Form from "@radix-ui/react-form";

interface FilterFormProps {
  type?: WalletTransaction["type"];
  onTypeChange: (type: WalletTransaction["type"] | undefined) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ type, onTypeChange }) => {
  // Use "all" as special value instead of empty string
  const currentValue = type || "all";

  const handleChange = (value: string) => {
    if (value === "all") {
      onTypeChange(undefined);
    } else {
      onTypeChange(value as WalletTransaction["type"]);
    }
  };

  return (
    <Form.Root>
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-xs">
          <label className="block mb-2 text-sm font-medium text-neutral-10">Loại giao dịch</label>
          <Select
            name="type"
            value={currentValue}
            onChange={handleChange}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "deposit", label: "Nạp tiền" },
              { value: "withdraw", label: "Rút tiền" },
              { value: "payment", label: "Thanh toán" },
              { value: "refund", label: "Hoàn tiền" },
              { value: "transfer", label: "Chuyển tiền" },
            ]}
            sizeSelect="md"
          />
        </div>
      </div>
    </Form.Root>
  );
};

export default FilterForm;

