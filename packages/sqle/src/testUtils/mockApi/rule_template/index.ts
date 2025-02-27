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
  projectRulesMockData,
  ruleTypeByDbMockData,
  customRuleDetailMockData,
  projectRuleTemplateListMockData,
  publicRuleTemplateListMockData,
  customRuleMockData,
  importRuleTemplateMockData,
  mockRuleCategoriesData,
  GetDriverRuleVersionTipsMockData
} from './data';
import { MIMETypeEnum } from '@actiontech/shared/lib/enum';
import { AxiosResponse } from 'axios';

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
    this.updateCustomRule();
    this.createCustomRule();
    this.getRuleTypeByDBType();
    this.getCustomRule();
    this.getProjectRuleTemplateList();
    this.getRuleTemplateList();
    this.deleteProjectRuleTemplate();
    this.exportProjectRuleTemplate();
    this.cloneProjectRuleTemplate();
    this.getCustomRules();
    this.deleteRuleTemplate();
    this.exportRuleTemplate();
    this.cloneRuleTemplate();
    this.deleteCustomRule();
    this.createProjectRuleTemplate();
    this.updateProjectRuleTemplate();
    this.importProjectRuleTemplate();
    this.createRuleTemplate();
    this.updateRuleTemplate();
    this.getRuleTemplateFile();
    this.getCategoryStatistics();
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

  public getProjectRuleTemplateList() {
    const spy = jest.spyOn(rule_template, 'getProjectRuleTemplateListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: projectRuleTemplateListMockData,
        total_nums: projectRuleTemplateListMockData.length
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

  public createCustomRule() {
    const spy = jest.spyOn(rule_template, 'createCustomRuleV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateCustomRule() {
    const spy = jest.spyOn(rule_template, 'updateCustomRuleV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getRuleTypeByDBType() {
    const spy = jest.spyOn(rule_template, 'getRuleTypeByDBTypeV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ruleTypeByDbMockData
      })
    );
    return spy;
  }

  public getRuleTemplateList() {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: publicRuleTemplateListMockData,
        total_nums: publicRuleTemplateListMockData.length
      })
    );
    return spy;
  }

  public getCustomRule() {
    const spy = jest.spyOn(rule_template, 'getCustomRuleV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: customRuleDetailMockData
      })
    );
    return spy;
  }

  public deleteProjectRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'deleteProjectRuleTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public exportProjectRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'exportProjectRuleTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public cloneProjectRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'cloneProjectRuleTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getCustomRules() {
    const spy = jest.spyOn(rule_template, 'getCustomRulesV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: customRuleMockData
      })
    );
    return spy;
  }

  public deleteRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'deleteRuleTemplateV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: customRuleMockData
      })
    );
    return spy;
  }

  public exportRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'exportRuleTemplateV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: customRuleMockData
      })
    );
    return spy;
  }

  public cloneRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'CloneRuleTemplateV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: customRuleMockData
      })
    );
    return spy;
  }

  public deleteCustomRule() {
    const spy = jest.spyOn(rule_template, 'deleteCustomRuleV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public createProjectRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'createProjectRuleTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateProjectRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'updateProjectRuleTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public importProjectRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'importProjectRuleTemplateV1');
    spy.mockImplementation(() => {
      return new Promise<AxiosResponse<any>>((res) => {
        setTimeout(() => {
          res({
            status: 200,
            headers: {},
            config: {},
            statusText: '',
            data: new Blob(
              [
                JSON.stringify({
                  code: 0,
                  message: 'ok',
                  data: importRuleTemplateMockData
                })
              ],
              {
                type: MIMETypeEnum.Application_Json
              }
            )
          });
        }, 3000);
      });
    });
    return spy;
  }

  public createRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'createRuleTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateRuleTemplate() {
    const spy = jest.spyOn(rule_template, 'updateRuleTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getRuleTemplateFile() {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateFileV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getCategoryStatistics() {
    const spy = jest.spyOn(rule_template, 'getCategoryStatistics');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockRuleCategoriesData })
    );
    return spy;
  }

  public mockGetDriverRuleVersionTips() {
    const spy = jest.spyOn(rule_template, 'GetDriverRuleVersionTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: GetDriverRuleVersionTipsMockData })
    );
    return spy;
  }
}

export default new MockRuleTemplateApi();
