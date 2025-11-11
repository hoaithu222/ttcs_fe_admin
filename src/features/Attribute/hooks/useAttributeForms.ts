import { useMemo } from "react";
import type { CreateAttributeTypeRequest } from "@/core/api/attribute-type/type";
import type { CreateAttributeValueRequest } from "@/core/api/attribute-value/type";

export function useAttributeForms() {
  const inputTypeOptions = useMemo(
    () => [
      { label: "Text", value: "text" },
      { label: "Number", value: "number" },
      { label: "Select", value: "select" },
      { label: "Multi Select", value: "multiselect" },
      { label: "Boolean", value: "boolean" },
      { label: "Date", value: "date" },
      { label: "Color", value: "color" },
    ],
    []
  );

  const getDefaultTypeForm = (): CreateAttributeTypeRequest => ({
    name: "",
    categoryId: "",
    description: "",
    isActive: true,
    is_multiple: false,
    values: [],
  });

  const getDefaultValueForm = (attributeTypeId: string): CreateAttributeValueRequest => ({
    attributeTypeId,
    value: "",
  });

  return {
    inputTypeOptions,
    getDefaultTypeForm,
    getDefaultValueForm,
  };
}

export default useAttributeForms;
