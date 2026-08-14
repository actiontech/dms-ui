import workflow from '../../../../api/sqle/service/workflow';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  dataExportWorkflowTemplateListData,
  workflowTemplateData,
  workflowTemplateListData
} from './data';
import { cloneDeep } from 'lodash';
import { getWorkflowTemplateListV1WorkflowTypeEnum } from '../../../../api/sqle/service/workflow/index.enum';

class MockWorkflowTemplateApi implements MockSpyApy {
  public mockAllApi(): void {
    this.updateWorkflowTemplate();
    this.getWorkflowTemplate();
    this.getWorkflowTemplates();
    this.createWorkflowTemplate();
    this.getWorkflowTemplateById();
    this.updateWorkflowTemplateById();
    this.deleteWorkflowTemplate();
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

  public getWorkflowTemplates() {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateListV1');
    spy.mockImplementation((params) => {
      const list =
        params.workflow_type ===
        getWorkflowTemplateListV1WorkflowTypeEnum.data_export
          ? dataExportWorkflowTemplateListData
          : workflowTemplateListData;
      return createSpySuccessResponse({
        data: cloneDeep(list)
      });
    });
    return spy;
  }

  public createWorkflowTemplate() {
    const spy = jest.spyOn(workflow, 'createWorkflowTemplateV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: cloneDeep(workflowTemplateData)
      })
    );
    return spy;
  }

  public getWorkflowTemplateById() {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateByIdV1');
    spy.mockImplementation((params) => {
      const all = [
        ...workflowTemplateListData,
        ...dataExportWorkflowTemplateListData
      ];
      const target =
        all.find(
          (item) => item.workflow_template_id === params.workflow_template_id
        ) ?? workflowTemplateData;
      return createSpySuccessResponse({
        data: cloneDeep(target)
      });
    });
    return spy;
  }

  public updateWorkflowTemplateById() {
    const spy = jest.spyOn(workflow, 'updateWorkflowTemplateByIdV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteWorkflowTemplate() {
    const spy = jest.spyOn(workflow, 'deleteWorkflowTemplateV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
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
