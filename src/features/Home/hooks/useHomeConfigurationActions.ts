import { useAppDispatch } from "@/app/store";
import {
  fetchConfigurationsStart,
  fetchConfigurationByIdStart,
  createConfigurationStart,
  updateConfigurationStart,
  deleteConfigurationStart,
  clearError,
  resetState,
} from "../slice/home-configuration.slice";
import type {
  FetchConfigurationByIdPayload,
  CreateConfigurationPayload,
  UpdateConfigurationPayload,
  DeleteConfigurationPayload,
} from "../slice/home-configuration.type";

export const useHomeConfigurationActions = () => {
  const dispatch = useAppDispatch();

  return {
    fetchConfigurations: () => {
      dispatch(fetchConfigurationsStart());
    },
    fetchConfigurationById: (payload: FetchConfigurationByIdPayload) => {
      dispatch(fetchConfigurationByIdStart(payload as any));
    },
    createConfiguration: (payload: CreateConfigurationPayload) => {
      dispatch(createConfigurationStart(payload as any));
    },
    updateConfiguration: (payload: UpdateConfigurationPayload) => {
      dispatch(updateConfigurationStart(payload as any));
    },
    deleteConfiguration: (payload: DeleteConfigurationPayload) => {
      dispatch(deleteConfigurationStart(payload as any));
    },
    clearError: () => {
      dispatch(clearError());
    },
    resetState: () => {
      dispatch(resetState());
    },
  };
};

