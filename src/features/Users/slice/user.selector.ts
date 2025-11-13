import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const userState = (state: RootState) => state.user;

export const selectUsers = createSelector([userState], (user) => user.users);

export const selectSelectedUser = createSelector([userState], (user) => user.selectedUser);

export const selectUserLoading = createSelector([userState], (user) => user.isLoading);

export const selectUserError = createSelector([userState], (user) => user.error);

export const selectUserPagination = createSelector([userState], (user) => user.pagination);

export const selectUserFilters = createSelector([userState], (user) => user.filters);

export const selectCreateUserStatus = createSelector([userState], (user) => user.createUser.status);

export const selectUpdateUserStatus = createSelector([userState], (user) => user.updateUser.status);

export const selectDeleteUserStatus = createSelector([userState], (user) => user.deleteUser.status);

export const selectCreateUserError = createSelector([userState], (user) => user.createUser.error);

export const selectUpdateUserError = createSelector([userState], (user) => user.updateUser.error);

export const selectDeleteUserError = createSelector([userState], (user) => user.deleteUser.error);

export const selectSuspendUserStatus = createSelector(
  [userState],
  (user) => user.suspendUser.status
);

export const selectSuspendUserError = createSelector([userState], (user) => user.suspendUser.error);
