import reducers, { updateGlobalSelectRuleTemplate } from '.';
import { RuleManagerSegmentedKey } from '../../page/RuleManager/index.type';
import { ruleTemplateListData } from '../../page/RuleTemplate/__testData__';

describe('store/globalRuleTemplate', () => {
  test('should create action', () => {
    expect(
      updateGlobalSelectRuleTemplate({ ruleTemplate: ruleTemplateListData[0] })
    ).toEqual({
      type: 'globalRuleTemplate/updateGlobalSelectRuleTemplate',
      payload: { ruleTemplate: ruleTemplateListData[0] }
    });
  });

  test('should update select rule template when dispatch updateSelectRuleTemplate action', () => {
    const state = {
      selectGlobalRuleTemplate: null,
      modalStatus: {},
      activeSegmentedKey: RuleManagerSegmentedKey.GlobalRuleTemplate
    };
    const newState = reducers(
      state,
      updateGlobalSelectRuleTemplate({ ruleTemplate: ruleTemplateListData[0] })
    );
    expect(newState.selectGlobalRuleTemplate).toBe(ruleTemplateListData[0]);
  });
});
