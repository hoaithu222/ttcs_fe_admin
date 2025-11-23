import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  HomeConfigurationState,
  FetchConfigurationByIdPayload,
  CreateConfigurationPayload,
  UpdateConfigurationPayload,
  DeleteConfigurationPayload,
} from "./home-configuration.type";
import { HomeConfiguration } from "@/core/api/home/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: HomeConfigurationState = {
  configurations: [],
  currentConfiguration: null,
  isLoading: false,
  error: null,
  fetchConfigurations: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  fetchConfigurationById: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  createConfiguration: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  updateConfiguration: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  deleteConfiguration: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
};

const homeConfigurationSlice = createSlice({
  name: "homeConfiguration",
  initialState,
  reducers: {
    // Fetch all configurations
    fetchConfigurationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.fetchConfigurations.status = ReduxStateType.LOADING;
      state.fetchConfigurations.error = null;
      state.fetchConfigurations.message = null;
    },
    fetchConfigurationsSuccess: (
      state,
      action: PayloadAction<HomeConfiguration[]>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.configurations = action.payload;
      state.fetchConfigurations.status = ReduxStateType.SUCCESS;
      state.fetchConfigurations.error = null;
      state.fetchConfigurations.message = null;
    },
    fetchConfigurationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.fetchConfigurations.status = ReduxStateType.ERROR;
      state.fetchConfigurations.error = action.payload;
      state.fetchConfigurations.message = action.payload;
    },

    // Fetch configuration by ID
    fetchConfigurationByIdStart: (state, _action: PayloadAction<FetchConfigurationByIdPayload>) => {
      state.isLoading = true;
      state.error = null;
      state.fetchConfigurationById.status = ReduxStateType.LOADING;
      state.fetchConfigurationById.error = null;
      state.fetchConfigurationById.message = null;
    },
    fetchConfigurationByIdSuccess: (
      state,
      action: PayloadAction<HomeConfiguration>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.currentConfiguration = action.payload;
      state.fetchConfigurationById.status = ReduxStateType.SUCCESS;
      state.fetchConfigurationById.error = null;
      state.fetchConfigurationById.message = null;
    },
    fetchConfigurationByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.fetchConfigurationById.status = ReduxStateType.ERROR;
      state.fetchConfigurationById.error = action.payload;
      state.fetchConfigurationById.message = action.payload;
    },

    // Create configuration
    createConfigurationStart: (state, _action: PayloadAction<CreateConfigurationPayload>) => {
      state.isLoading = true;
      state.error = null;
      state.createConfiguration.status = ReduxStateType.LOADING;
      state.createConfiguration.error = null;
      state.createConfiguration.message = null;
    },
    createConfigurationSuccess: (
      state,
      action: PayloadAction<HomeConfiguration>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.configurations.unshift(action.payload);
      state.currentConfiguration = action.payload;
      state.createConfiguration.status = ReduxStateType.SUCCESS;
      state.createConfiguration.error = null;
      state.createConfiguration.message = null;
    },
    createConfigurationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.createConfiguration.status = ReduxStateType.ERROR;
      state.createConfiguration.error = action.payload;
      state.createConfiguration.message = action.payload;
    },

    // Update configuration
    updateConfigurationStart: (state, _action: PayloadAction<UpdateConfigurationPayload>) => {
      state.isLoading = true;
      state.error = null;
      state.updateConfiguration.status = ReduxStateType.LOADING;
      state.updateConfiguration.error = null;
      state.updateConfiguration.message = null;
    },
    updateConfigurationSuccess: (
      state,
      action: PayloadAction<HomeConfiguration>
    ) => {
      state.isLoading = false;
      state.error = null;
      const index = state.configurations.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) {
        state.configurations[index] = action.payload;
      }
      if (state.currentConfiguration?._id === action.payload._id) {
        state.currentConfiguration = action.payload;
      }
      state.updateConfiguration.status = ReduxStateType.SUCCESS;
      state.updateConfiguration.error = null;
      state.updateConfiguration.message = null;
    },
    updateConfigurationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.updateConfiguration.status = ReduxStateType.ERROR;
      state.updateConfiguration.error = action.payload;
      state.updateConfiguration.message = action.payload;
    },

    // Delete configuration
    deleteConfigurationStart: (state, _action: PayloadAction<DeleteConfigurationPayload>) => {
      state.isLoading = true;
      state.error = null;
      state.deleteConfiguration.status = ReduxStateType.LOADING;
      state.deleteConfiguration.error = null;
      state.deleteConfiguration.message = null;
    },
    deleteConfigurationSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = null;
      state.configurations = state.configurations.filter(
        (c) => c._id !== action.payload
      );
      if (state.currentConfiguration?._id === action.payload) {
        state.currentConfiguration = null;
      }
      state.deleteConfiguration.status = ReduxStateType.SUCCESS;
      state.deleteConfiguration.error = null;
      state.deleteConfiguration.message = null;
    },
    deleteConfigurationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.deleteConfiguration.status = ReduxStateType.ERROR;
      state.deleteConfiguration.error = action.payload;
      state.deleteConfiguration.message = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.currentConfiguration = null;
      state.fetchConfigurations.status = ReduxStateType.INIT;
      state.fetchConfigurationById.status = ReduxStateType.INIT;
      state.createConfiguration.status = ReduxStateType.INIT;
      state.updateConfiguration.status = ReduxStateType.INIT;
      state.deleteConfiguration.status = ReduxStateType.INIT;
    },
  },
});

export const {
  fetchConfigurationsStart,
  fetchConfigurationsSuccess,
  fetchConfigurationsFailure,
  fetchConfigurationByIdStart,
  fetchConfigurationByIdSuccess,
  fetchConfigurationByIdFailure,
  createConfigurationStart,
  createConfigurationSuccess,
  createConfigurationFailure,
  updateConfigurationStart,
  updateConfigurationSuccess,
  updateConfigurationFailure,
  deleteConfigurationStart,
  deleteConfigurationSuccess,
  deleteConfigurationFailure,
  clearError,
  resetState,
} = homeConfigurationSlice.actions;

export default homeConfigurationSlice.reducer;

