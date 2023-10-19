import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';
import {
  IAuditPlanResV2,
  IAuditPlanReportSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
type AuditPlanReduxState = {
  modalStatus: ModalStatus;
  selectAuditPlan: IAuditPlanResV2 | null;
  selectAuditReport: IAuditPlanReportSQLResV2 | null;
};

const initialState: AuditPlanReduxState = {
  modalStatus: {},
  selectAuditPlan: null,
  selectAuditReport: null
};
const auditPlan = createSlice({
  name: 'auditPlan',
  initialState,
  reducers: {
    ...commonModalReducer(),
    updateSelectAuditPlan: (
      state,
      { payload: selectedData }: PayloadAction<IAuditPlanResV2 | null>
    ) => {
      state.selectAuditPlan = selectedData;
    },
    updateSelectAuditReport: (
      state,
      { payload: selectedData }: PayloadAction<IAuditPlanReportSQLResV2 | null>
    ) => {
      state.selectAuditReport = selectedData;
    }
  }
});
export const {
  initModalStatus: initAuditPlanModalStatus,
  updateModalStatus: updateAuditPlanModalStatus,
  updateSelectAuditPlan,
  updateSelectAuditReport
} = auditPlan.actions;

export default auditPlan.reducer;
