import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { projectRuleTemplateList, ruleTemplateList } from './data';

class MockRuleTemplateApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getRuleTemplateTips();
    this.getProjectRuleTemplateTips();
  }

  public getRuleTemplateTips() {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateTipsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ruleTemplateList
      })
    );
    return spy;
  }

  public getProjectRuleTemplateTips() {
    const spy = jest.spyOn(rule_template, 'getProjectRuleTemplateTipsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: projectRuleTemplateList
      })
    );
    return spy;
  }
}

export default new MockRuleTemplateApi();
