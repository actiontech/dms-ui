import reducers, { updateSelectRuleTemplate } from '.';
import { ruleTemplateListData } from '../../page/RuleTemplate/__testData__';

describe('store/ruleTemplate', () => {
  test('should create action', () => {
    expect(
      updateSelectRuleTemplate({ selectRow: ruleTemplateListData[0] })
    ).toEqual({
      type: 'ruleTemplate/updateSelectRuleTemplate',
      payload: { selectRow: ruleTemplateListData[0] }
    });
  });

  test('should update select rule template when dispatch updateSelectRuleTemplate action', () => {
    const state = { selectRuleTemplate: null, modalStatus: {} };
    const newState = reducers(
      state,
      updateSelectRuleTemplate({ selectRow: ruleTemplateListData[0] })
    );
    expect(newState.selectRuleTemplate).toBe(ruleTemplateListData[0]);
  });
});
