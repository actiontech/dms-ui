import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { workflowTemplateData } from './data';
import { cloneDeep } from 'lodash';

class MockWorkflowTemplateApi implements MockSpyApy {
  public mockAllApi(): void {
    this.updateWorkflowTemplate();
    this.getWorkflowTemplate();
    this.cancelWorkflow();
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

  public cancelWorkflow() {
    const spy = jest.spyOn(workflow, 'cancelWorkflowV2');
    spy.mockImplementation(() => {
      return createSpySuccessResponse({});
    });
    return spy;
  }
}

export default new MockWorkflowTemplateApi();
