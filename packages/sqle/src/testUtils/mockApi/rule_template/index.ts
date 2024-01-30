import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import {
  projectRuleTemplateList,
  ruleKnowledgeData,
  ruleListData,
  ruleTemplateList,
  projectRulesMockData
} from './data';

class MockRuleTemplateApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getRuleTemplateTips();
    this.getProjectRuleTemplateTips();
    this.getCustomRuleKnowledge();
    this.getRuleKnowledge();
    this.getRuleList();
    this.updateCustomRuleKnowledge();
    this.updateRuleKnowledge();
    this.getProjectRuleTemplate();
    this.getRuleTemplate();
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

  public getCustomRuleKnowledge() {
    const spy = jest.spyOn(rule_template, 'getCustomRuleKnowledgeV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ruleKnowledgeData
      })
    );
    return spy;
  }

  public getRuleKnowledge() {
    const spy = jest.spyOn(rule_template, 'getRuleKnowledgeV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ruleKnowledgeData
      })
    );
    return spy;
  }

  public getRuleList() {
    const spy = jest.spyOn(rule_template, 'getRuleListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ruleListData
      })
    );
    return spy;
  }

  public updateCustomRuleKnowledge() {
    const spy = jest.spyOn(rule_template, 'updateCustomRuleKnowledge');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateRuleKnowledge() {
    const spy = jest.spyOn(rule_template, 'updateRuleKnowledge');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getProjectRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'getProjectRuleTemplateV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: projectRulesMockData
      })
    );
    return spy;
  }

  public getRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: projectRulesMockData
      })
    );
    return spy;
  }
}

export default new MockRuleTemplateApi();
