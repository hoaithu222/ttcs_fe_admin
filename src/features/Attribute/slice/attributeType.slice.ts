import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AttributeType } from "@/core/api/attribute-type/type";

export interface AttributeTypeState {
  entities: Record<string, AttributeType>;
  ids: string[];
  isLoading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: { search: string; isActive?: boolean; inputType?: AttributeType["inputType"] };
  selectedId: string | null;
  modal: false | "create" | "update";
}

const initialState: AttributeTypeState = {
  entities: {},
  ids: [],
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  filters: { search: "" },
  selectedId: null,
  modal: false,
};

const attributeTypeSlice = createSlice({
  name: "attributeType",
  initialState,
  reducers: {
    // --- Saga triggers ---
    fetchAttributeTypesStart:
      (
        state,
        _action: PayloadAction<{
          page?: number;
          limit?: number;
          search?: string;
          isActive?: boolean;
          inputType?: AttributeType["inputType"];
        }>
      ) => {
        state.isLoading = true;
        state.error = null;
      },
    fetchAttributeTypesSuccess:
      (
        state,
        action: PayloadAction<{ attributeTypes: AttributeType[]; pagination: AttributeTypeState["pagination"] }>
      ) => {
        state.isLoading = false;
        state.error = null;
        state.entities = {};
        state.ids = [];
        for (const item of action.payload.attributeTypes) {
          state.entities[item._id] = item;
          state.ids.push(item._id);
        }
        state.pagination = action.payload.pagination;
      },
    fetchAttributeTypesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.entities = {};
      state.ids = [];
    },

    createAttributeTypeStart: (state, _action: PayloadAction<{ data: Partial<AttributeType> }>) => {
      state.isLoading = true;
      state.error = null;
    },
    createAttributeTypeSuccess: (state, action: PayloadAction<AttributeType>) => {
      state.isLoading = false;
      state.entities[action.payload._id] = action.payload;
      state.ids = [action.payload._id, ...state.ids];
    },
    createAttributeTypeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateAttributeTypeStart: (
      state,
      _action: PayloadAction<{ id: string; data: Partial<AttributeType> }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateAttributeTypeSuccess: (state, action: PayloadAction<AttributeType>) => {
      state.isLoading = false;
      state.entities[action.payload._id] = action.payload;
    },
    updateAttributeTypeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteAttributeTypeStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteAttributeTypeSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter((x) => x !== id);
    },
    deleteAttributeTypeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    openModal(state, action: PayloadAction<AttributeTypeState["modal"]>) {
      state.modal = action.payload;
    },
    setFilters(state, action: PayloadAction<AttributeTypeState["filters"]>) {
      state.filters = action.payload;
    },
  },
});

export const {
  fetchAttributeTypesStart,
  fetchAttributeTypesSuccess,
  fetchAttributeTypesFailure,
  createAttributeTypeStart,
  createAttributeTypeSuccess,
  createAttributeTypeFailure,
  updateAttributeTypeStart,
  updateAttributeTypeSuccess,
  updateAttributeTypeFailure,
  deleteAttributeTypeStart,
  deleteAttributeTypeSuccess,
  deleteAttributeTypeFailure,
  setSelectedId,
  openModal,
  setFilters,
} = attributeTypeSlice.actions;
export default attributeTypeSlice.reducer;


