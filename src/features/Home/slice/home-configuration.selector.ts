import { RootState } from "@/app/store";

export const selectHomeConfigurations = (state: RootState) =>
  state.homeConfiguration.configurations;

export const selectCurrentHomeConfiguration = (state: RootState) =>
  state.homeConfiguration.currentConfiguration;

export const selectHomeConfigurationLoading = (state: RootState) =>
  state.homeConfiguration.isLoading;

export const selectHomeConfigurationError = (state: RootState) =>
  state.homeConfiguration.error;

export const selectFetchConfigurationsStatus = (state: RootState) =>
  state.homeConfiguration.fetchConfigurations;

export const selectFetchConfigurationByIdStatus = (state: RootState) =>
  state.homeConfiguration.fetchConfigurationById;

export const selectCreateConfigurationStatus = (state: RootState) =>
  state.homeConfiguration.createConfiguration;

export const selectUpdateConfigurationStatus = (state: RootState) =>
  state.homeConfiguration.updateConfiguration;

export const selectDeleteConfigurationStatus = (state: RootState) =>
  state.homeConfiguration.deleteConfiguration;

