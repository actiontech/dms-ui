import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IViewRoleReply, IViewUserReply } from '../../api/common';

type UserManagementState = {
  modalStatus: ModalStatus;
  selectUserData: IViewUserReply | null;
  selectRoleData: IViewRoleReply | null;
  permissionRoleId: string;
};

const initialState: UserManagementState = {
  modalStatus: {},
  selectUserData: null,
  selectRoleData: null,
  permissionRoleId: ''
};

const userManagement = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    ...commonModalReducer(),
    updateSelectUserData: (
      state,
      { payload: selectUserData }: PayloadAction<IViewUserReply | null>
    ) => {
      state.selectUserData = selectUserData;
    },
    updateSelectRoleData: (
      state,
      { payload: selectRoleData }: PayloadAction<IViewRoleReply | null>
    ) => {
      state.selectRoleData = selectRoleData;
    },
    updatePermissionRoleId: (
      state,
      { payload: permissionRoleId }: PayloadAction<string>
    ) => {
      state.permissionRoleId = permissionRoleId;
    }
  }
});

export const {
  initModalStatus: initUserManagementModalStatus,
  updateModalStatus: updateUserManagementModalStatus,
  updateSelectUserData,
  updateSelectRoleData,
  updatePermissionRoleId
} = userManagement.actions;

export default userManagement.reducer;
