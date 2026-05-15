import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import {
  IListUser,
  IListUserGroup,
  IListRole
} from '@actiontech/shared/lib/api/base/service/common';

type UserManageReduxState = {
  modalStatus: ModalStatus;
  selectUser: IListUser | null;
  selectUserGroup: IListUserGroup | null;
  selectRole: IListRole | null;
};

const initialState: UserManageReduxState = {
  modalStatus: {},
  selectUser: null,
  selectUserGroup: null,
  selectRole: null
};

const userCenter = createSlice({
  name: 'userCenter',
  initialState,
  reducers: {
    updateSelectUser(
      state,
      { payload: { user } }: PayloadAction<{ user: IListUser | null }>
    ) {
      state.selectUser = user;
    },
    updateSelectUserGroup(
      state,
      {
        payload: { userGroup }
      }: PayloadAction<{ userGroup: IListUserGroup | null }>
    ) {
      state.selectUserGroup = userGroup;
    },
    updateSelectRole(
      state,
      { payload: { role } }: PayloadAction<{ role: IListRole | null }>
    ) {
      state.selectRole = role;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectUser,
  updateSelectUserGroup,
  updateSelectRole,
  initModalStatus: initUserManageModalStatus,
  updateModalStatus: updateUserManageModalStatus
} = userCenter.actions;

export default userCenter.reducer;
