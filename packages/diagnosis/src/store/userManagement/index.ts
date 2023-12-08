import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IViewRoleReply, IViewUserReply } from '../../api/common';

type UserManagementState = {
  modalStatus: ModalStatus;
  selectUserData: IViewUserReply | null;
  selectRoleData: IViewRoleReply | null;
};

const initialState: UserManagementState = {
  modalStatus: {},
  selectUserData: null,
  selectRoleData: null
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
    }
  }
});

export const {
  initModalStatus: initUserManagementModalStatus,
  updateModalStatus: updateUserManagementModalStatus,
  updateSelectUserData,
  updateSelectRoleData
} = userManagement.actions;

export default userManagement.reducer;
