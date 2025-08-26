import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { ICBOperationLog } from '@actiontech/shared/lib/api/base/service/common';

type MemberReduxState = {
  modalStatus: ModalStatus;
  cloudBeaverSqlOperationRecord: ICBOperationLog | null;
};

const initialState: MemberReduxState = {
  modalStatus: {},
  cloudBeaverSqlOperationRecord: null
};

const dmsCloudBeaver = createSlice({
  name: 'cloudBeaver',
  initialState,
  reducers: {
    updateCBSqlOperationRecord(
      state,
      {
        payload: { cbSqlOperationRecord }
      }: PayloadAction<{ cbSqlOperationRecord: ICBOperationLog | null }>
    ) {
      state.cloudBeaverSqlOperationRecord = cbSqlOperationRecord;
    },
    ...commonModalReducer()
  }
});

export const {
  updateCBSqlOperationRecord,
  initModalStatus: initCloudBeaverModalStatus,
  updateModalStatus: updateCloudBeaverModalStatus
} = dmsCloudBeaver.actions;

export default dmsCloudBeaver.reducer;
