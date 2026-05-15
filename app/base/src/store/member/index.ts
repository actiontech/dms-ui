import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import {
  IListMember,
  IListMemberGroup
} from '@actiontech/shared/lib/api/base/service/common';

type MemberReduxState = {
  modalStatus: ModalStatus;
  selectMember: IListMember | null;
  selectMemberGroup: IListMemberGroup | null;
};

const initialState: MemberReduxState = {
  modalStatus: {},
  selectMember: null,
  selectMemberGroup: null
};

const dmsMember = createSlice({
  name: 'member',
  initialState,
  reducers: {
    updateSelectMember(
      state,
      { payload: { member } }: PayloadAction<{ member: IListMember | null }>
    ) {
      state.selectMember = member;
    },
    updateSelectMemberGroup(
      state,
      {
        payload: { memberGroup }
      }: PayloadAction<{ memberGroup: IListMemberGroup | null }>
    ) {
      state.selectMemberGroup = memberGroup;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectMember,
  updateSelectMemberGroup,
  initModalStatus: initMemberModalStatus,
  updateModalStatus: updateMemberModalStatus
} = dmsMember.actions;

export default dmsMember.reducer;
