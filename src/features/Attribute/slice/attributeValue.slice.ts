import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AttributeValue } from "@/core/api/attribute-value/type";

export interface AttributeValueState {
  entities: Record<string, AttributeValue>;
  ids: string[];
  isLoading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: { search: string; isActive?: boolean; attributeTypeId?: string };
  selectedId: string | null;
  modal: false | "create" | "update";
}

const initialState: AttributeValueState = {
  entities: {},
  ids: [],
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  filters: { search: "" },
  selectedId: null,
  modal: false,
};

const attributeValueSlice = createSlice({
  name: "attributeValue",
  initialState,
  reducers: {
    // --- Saga triggers ---
    fetchAttributeValuesStart: (
      state,
      _action: PayloadAction<{
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
        attributeTypeId?: string;
      }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAttributeValuesSuccess: (
      state,
      action: PayloadAction<{
        attributeValues: AttributeValue[];
        pagination: AttributeValueState["pagination"];
      }>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.entities = {};
      state.ids = [];
      for (const item of action.payload.attributeValues) {
        state.entities[item._id] = item;
        state.ids.push(item._id);
      }
      state.pagination = action.payload.pagination;
    },
    fetchAttributeValuesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.entities = {};
      state.ids = [];
    },

    createAttributeValueStart: (
      state,
      _action: PayloadAction<{ data: Partial<AttributeValue> }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    createAttributeValueSuccess: (state, action: PayloadAction<AttributeValue>) => {
      state.isLoading = false;
      state.entities[action.payload._id] = action.payload;
      state.ids = [action.payload._id, ...state.ids];
    },
    createAttributeValueFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateAttributeValueStart: (
      state,
      _action: PayloadAction<{ id: string; data: Partial<AttributeValue> }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateAttributeValueSuccess: (state, action: PayloadAction<AttributeValue>) => {
      state.isLoading = false;
      state.entities[action.payload._id] = action.payload;
    },
    updateAttributeValueFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteAttributeValueStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteAttributeValueSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter((x) => x !== id);
    },
    deleteAttributeValueFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    openModal(state, action: PayloadAction<AttributeValueState["modal"]>) {
      state.modal = action.payload;
    },
    setFilters(state, action: PayloadAction<AttributeValueState["filters"]>) {
      state.filters = action.payload;
    },
  },
});

export const {
  fetchAttributeValuesStart,
  fetchAttributeValuesSuccess,
  fetchAttributeValuesFailure,
  createAttributeValueStart,
  createAttributeValueSuccess,
  createAttributeValueFailure,
  updateAttributeValueStart,
  updateAttributeValueSuccess,
  updateAttributeValueFailure,
  deleteAttributeValueStart,
  deleteAttributeValueSuccess,
  deleteAttributeValueFailure,
  setSelectedId,
  openModal,
  setFilters,
} = attributeValueSlice.actions;
export default attributeValueSlice.reducer;
