import workflow from '../../../../api/sqle/service/workflow';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  workflowTemplateData,
  dataExportWorkflowTemplateData,
  workflowTemplateListData
} from './data';
import { cloneDeep } from 'lodash';

class MockWorkflowTemplateApi implements MockSpyApy {
  public mockAllApi(): void {
    this.updateWorkflowTemplate();
    this.getWorkflowTemplate();
    this.getWorkflowTemplateList();
    this.cancelWorkflow();
  }

  public updateWorkflowTemplate() {
    const spy = jest.spyOn(workflow, 'updateWorkflowTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getWorkflowTemplate() {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation((params) => {
      if (params.workflow_type === 'data_export') {
        return createSpySuccessResponse({
          data: cloneDeep(dataExportWorkflowTemplateData)
        });
      }
      return createSpySuccessResponse({
        data: cloneDeep(workflowTemplateData)
      });
    });
    return spy;
  }

  public getWorkflowTemplateList() {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateListV1');
    spy.mockImplementation(() => {
      return createSpySuccessResponse({
        data: cloneDeep(workflowTemplateListData)
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
