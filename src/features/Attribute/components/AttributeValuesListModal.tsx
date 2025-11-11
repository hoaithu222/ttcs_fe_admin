import React, { useEffect } from "react";
import Modal from "@/foundation/components/modal/Modal";
import type { AttributeType } from "@/core/api/attribute-type/type";
import AttributeValueTable from "./AttributeValueTable";
import { useAttributeValueTable } from "../hooks/useAttributeValueTable";
import Button from "@/foundation/components/buttons/Button";
import AttributeValueModal from "./AttributeValueModal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attributeType?: AttributeType | null;
}

const AttributeValuesListModal: React.FC<Props> = ({ open, onOpenChange, attributeType }) => {
  const table = useAttributeValueTable({
    attributeTypeId: attributeType?._id,
    initialPage: 1,
    initialLimit: 10,
  });
  const [addOpen, setAddOpen] = React.useState(false);

  useEffect(() => {
    if (open && attributeType?._id) {
      table.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, attributeType?._id]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Giá trị của: ${attributeType?.name ?? "-"}`}
      size="3xl"
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setAddOpen(true)} disabled={!attributeType}>
            Thêm giá trị
          </Button>
        </div>
        <AttributeValueTable
          data={table.data}
          isLoading={table.isLoading}
          page={table.page}
          totalPages={table.totalPages}
          totalItems={table.total}
          itemsPerPage={table.limit}
          onPageChange={table.onPageChange}
          onDelete={(id) => {
            table.deleteValue(id);
            table.refetch();
          }}
        />
        <AttributeValueModal
          open={addOpen}
          mode="create"
          onOpenChange={setAddOpen}
          attributeType={attributeType as any}
          onSubmit={async (payload) => {
            await table.createValue(payload as any);
            setAddOpen(false);
            table.refetch();
          }}
        />
      </div>
    </Modal>
  );
};

export default AttributeValuesListModal;
