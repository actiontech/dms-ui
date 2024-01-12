import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { userTipListData, workflowTemplateData } from './data';
import user from '@actiontech/shared/lib/api/sqle/service/user';
import { cloneDeep } from 'lodash';

class MockWorkflowTemplateApi implements MockSpyApy {
  public mockAllApi(): void {
    this.updateWorkflowTemplate();
    this.getWorkflowTemplate();
    this.getUserTip();
  }

  public updateWorkflowTemplate() {
    const spy = jest.spyOn(workflow, 'updateWorkflowTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getWorkflowTemplate() {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() => {
      return createSpySuccessResponse({
        data: cloneDeep(workflowTemplateData)
      });
    });
    return spy;
  }

  public getUserTip() {
    const spy = jest.spyOn(user, 'getUserTipListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: userTipListData
      })
    );
    return spy;
  }
}

export default new MockWorkflowTemplateApi();
