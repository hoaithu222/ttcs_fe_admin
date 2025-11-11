import React, { useMemo, useState } from "react";
import Button from "@/foundation/components/buttons/Button";
import { Card } from "@/foundation/components/info/Card";
import Input from "@/foundation/components/input/Input";
import Select from "@/foundation/components/input/Select";
import { PlusIcon, FilterIcon } from "lucide-react";
import * as Form from "@radix-ui/react-form";
import AttributeTypeTable from "../components/AttributeTypeTable";
import AttributeValuesListModal from "../components/AttributeValuesListModal";
import AttributeTypeModal from "../components/AttributeTypeModal";
import type { AttributeType } from "@/core/api/attribute-type/type";
import { useAttributeTypeTable } from "../hooks/useAttributeTypeTable";
import { useAttributeValueTable } from "../hooks/useAttributeValueTable";
// Avoid Tabs (Radix) for now to prevent optimize-dep crash; use simple toggle instead

const AttributePage: React.FC = () => {
  const [typeModalOpen, setTypeModalOpen] = useState<false | "create" | "update">(false);
  const [valueModalOpen, setValueModalOpen] = useState<false | "create" | "update">(false);
  const [selectedType, setSelectedType] = useState<AttributeType | null>(null);

  // Placeholder local states for filters and data; wire with Redux later
  const [typeSearch, setTypeSearch] = useState("");
  const [typeStatus, setTypeStatus] = useState<string | undefined>(undefined);

  const typeTable = useAttributeTypeTable({ initialPage: 1, initialLimit: 10 });

  // single table view

  return (
    <Form.Root>
      <div className="flex flex-col gap-6 p-4">
        <h2 className="text-2xl font-semibold text-neutral-10 text-start">Quản lý Thuộc tính</h2>
        <div className="flex items-center justify-between"></div>

        <Card className="p-4 border border-divider-1">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Input
                name="type-search"
                value={typeSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTypeSearch(e.target.value);
                  typeTable.setSearch(e.target.value);
                }}
                iconLeft={<FilterIcon size={16} />}
                placeholder="Tìm kiếm theo tên/mã"
                className="w-64"
              />
              <Select
                name="type-status"
                value={typeStatus ?? "all"}
                onChange={(v: string) => {
                  const next = v === "all" ? undefined : v;
                  setTypeStatus(next);
                  typeTable.setIsActive(next as any);
                }}
                className="w-40"
                options={[
                  { label: "Tất cả trạng thái", value: "all" },
                  { label: "Hoạt động", value: "active" },
                  { label: "Tạm dừng", value: "inactive" },
                ]}
              />
            </div>
            <Button
              variant="primary"
              icon={<PlusIcon />}
              onClick={() => setTypeModalOpen("create")}
            >
              Thêm loại thuộc tính
            </Button>
          </div>

          <AttributeTypeTable
            data={typeTable.data as unknown as AttributeType[]}
            isLoading={typeTable.isLoading}
            onEdit={(item) => {
              setSelectedType(item);
              setTypeModalOpen("update");
            }}
            onDelete={(id) => {
              typeTable.deleteType(id);
            }}
            onSelectType={(item) => {
              setSelectedType(item);
              setValueModalOpen("create");
            }}
            selectedId={selectedType?._id}
            page={typeTable.page}
            totalPages={typeTable.totalPages}
            totalItems={typeTable.total}
            itemsPerPage={typeTable.limit}
            onPageChange={typeTable.onPageChange}
          />
        </Card>

        {/* Modals */}
        <AttributeTypeModal
          open={!!typeModalOpen}
          mode={typeModalOpen || "create"}
          onOpenChange={(open) => setTypeModalOpen(open ? typeModalOpen : false)}
          initialData={typeModalOpen === "update" ? (selectedType ?? undefined) : undefined}
          onSubmit={async (payload, mode) => {
            if (mode === "update") {
              const p = payload as any;
              await typeTable.updateType(p._id, p);
            } else {
              await typeTable.createType(payload as any);
            }
          }}
        />
        <AttributeValuesListModal
          open={!!valueModalOpen}
          onOpenChange={(open) => setValueModalOpen(open ? valueModalOpen : false)}
          attributeType={selectedType}
        />
      </div>
    </Form.Root>
  );
};

export default AttributePage;
