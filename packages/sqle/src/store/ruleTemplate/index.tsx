import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';

type RuleTemplateListState = {
  selectRuleTemplate: null | IProjectRuleTemplateResV1;
  modalStatus: ModalStatus;
};

const initialState: RuleTemplateListState = {
  selectRuleTemplate: null,
  modalStatus: {}
};

const ruleTemplate = createSlice({
  name: 'ruleTemplate',
  initialState,
  reducers: {
    updateSelectRuleTemplate(
      state,
      {
        payload: { selectRow }
      }: PayloadAction<{ selectRow: IProjectRuleTemplateResV1 | null }>
    ) {
      state.selectRuleTemplate = selectRow;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectRuleTemplate,
  updateModalStatus: updateRuleTemplateListModalStatus,
  initModalStatus: initRuleTemplateListModalStatus
} = ruleTemplate.actions;

export default ruleTemplate.reducer;
