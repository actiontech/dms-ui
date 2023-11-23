import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { RuleManagerSegmentedKey } from '../../page/RuleManager/index.type';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

type GlobalRuleTemplateListState = {
  selectGlobalRuleTemplate: null | IRuleTemplateResV1;
  modalStatus: ModalStatus;
  activeSegmentedKey: RuleManagerSegmentedKey;
};

const initialState: GlobalRuleTemplateListState = {
  selectGlobalRuleTemplate: null,
  modalStatus: {},
  activeSegmentedKey: RuleManagerSegmentedKey.GlobalRuleTemplate
};

const globalRuleTemplate = createSlice({
  name: 'globalRuleTemplate',
  initialState,
  reducers: {
    updateGlobalSelectRuleTemplate(
      state,
      {
        payload: { ruleTemplate }
      }: PayloadAction<{ ruleTemplate: IRuleTemplateResV1 | null }>
    ) {
      state.selectGlobalRuleTemplate = ruleTemplate;
    },
    updateRuleManagerActiveSegmentedKey(
      state,
      { payload }: PayloadAction<RuleManagerSegmentedKey>
    ) {
      state.activeSegmentedKey = payload;
    },
    ...commonModalReducer()
  }
});

export const {
  updateGlobalSelectRuleTemplate,
  updateRuleManagerActiveSegmentedKey,
  updateModalStatus: updateGlobalRuleTemplateListModalStatus,
  initModalStatus: initGlobalRuleTemplateListModalStatus
} = globalRuleTemplate.actions;

export default globalRuleTemplate.reducer;
