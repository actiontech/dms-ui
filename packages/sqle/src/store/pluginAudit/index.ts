import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ISqlDEVRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';

type PluginAuditReduxState = {
  modalStatus: ModalStatus;
  pluginAuditRecord: ISqlDEVRecord | null;
};

const initialState: PluginAuditReduxState = {
  pluginAuditRecord: null,
  modalStatus: {}
};

const pluginAudit = createSlice({
  name: 'pluginAudit',
  initialState,
  reducers: {
    updatePluginAuditRecord(
      state,
      {
        payload: { pluginAuditRecord }
      }: PayloadAction<{ pluginAuditRecord: ISqlDEVRecord | null }>
    ) {
      state.pluginAuditRecord = pluginAuditRecord;
    },
    ...commonModalReducer()
  }
});

export const {
  updatePluginAuditRecord,
  initModalStatus: initPluginAuditModalStatus,
  updateModalStatus: updatePluginAuditModalStatus
} = pluginAudit.actions;

export default pluginAudit.reducer;
