import { ReduxStateType } from "@/app/store/types";
import {
  HomeConfiguration,
  CreateHomeConfigurationRequest,
  UpdateHomeConfigurationRequest,
} from "@/core/api/home/type";

export interface HomeConfigurationState {
  configurations: HomeConfiguration[];
  currentConfiguration: HomeConfiguration | null;
  isLoading: boolean;
  error: string | null;
  fetchConfigurations: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  fetchConfigurationById: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  createConfiguration: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  updateConfiguration: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  deleteConfiguration: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
}

export interface FetchConfigurationsPayload {}

export interface FetchConfigurationByIdPayload {
  id: string;
}

export interface CreateConfigurationPayload extends CreateHomeConfigurationRequest {}

export interface UpdateConfigurationPayload {
  id: string;
  data: UpdateHomeConfigurationRequest;
}

export interface DeleteConfigurationPayload {
  id: string;
}

