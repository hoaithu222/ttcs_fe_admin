import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import {
  fetchUsersStart,
  deleteUserStart,
  suspendUserStart,
  unlockUserStart,
  updateUserStart,
  setSelectedUser,
} from "../slice/user.slice";
import { User } from "@/core/api/users/type";
import {
  selectCreateUserStatus,
  selectUpdateUserStatus,
  selectDeleteUserStatus,
  selectSuspendUserStatus,
  selectUnlockUserStatus,
} from "../slice/user.selector";
import { useSelector } from "react-redux";
import { ReduxStateType } from "@/app/store/types";

export const useUserActions = () => {
  const dispatch = useAppDispatch();
  const createUserStatus = useSelector(selectCreateUserStatus);
  const updateUserStatus = useSelector(selectUpdateUserStatus);
  const deleteUserStatus = useSelector(selectDeleteUserStatus);
  const suspendUserStatus = useSelector(selectSuspendUserStatus);
  const unlockUserStatus = useSelector(selectUnlockUserStatus);

  const fetchUsers = useCallback(
    (payload: {
      page?: number;
      limit?: number;
      search?: string;
      status?: "active" | "inactive" | "suspended";
      role?: "admin" | "user" | "moderator";
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }) => {
      dispatch(fetchUsersStart(payload));
    },
    [dispatch]
  );

  // lắng nghe khi thành công thêm/sửa/xóa/khóa/mở khóa user thì sẽ fetch lại danh sách
  useEffect(() => {
    if (
      createUserStatus === ReduxStateType.SUCCESS ||
      updateUserStatus === ReduxStateType.SUCCESS ||
      deleteUserStatus === ReduxStateType.SUCCESS ||
      suspendUserStatus === ReduxStateType.SUCCESS ||
      unlockUserStatus === ReduxStateType.SUCCESS
    ) {
      dispatch(fetchUsersStart({ page: 1, limit: 10 }));
    }
  }, [
    createUserStatus,
    updateUserStatus,
    deleteUserStatus,
    suspendUserStatus,
    unlockUserStatus,
    dispatch,
  ]);

  const deleteUser = useCallback(
    (id: string) => {
      dispatch(deleteUserStart(id));
    },
    [dispatch]
  );

  const suspendUser = useCallback(
    (id: string) => {
      dispatch(suspendUserStart(id));
    },
    [dispatch]
  );

  const unlockUser = useCallback(
    (id: string) => {
      dispatch(unlockUserStart(id));
    },
    [dispatch]
  );

  const updateUserRole = useCallback(
    (id: string, role: "admin" | "user" | "moderator") => {
      dispatch(updateUserStart({ id, data: { role } }));
    },
    [dispatch]
  );

  const selectUser = useCallback(
    (user: User | null) => {
      dispatch(setSelectedUser(user));
    },
    [dispatch]
  );

  return {
    fetchUsers,
    deleteUser,
    suspendUser,
    unlockUser,
    updateUserRole,
    selectUser,
  };
};

