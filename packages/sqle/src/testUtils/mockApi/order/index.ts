import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { WorkflowTemplateData, orderListData } from './data';

class MockOrderApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getWorkflows();
    this.exportWorkflow();
    this.batchCancelWorkflows();
    this.createWorkflow();
    this.createAndAuditTask();
    this.getWorkflowTemplate();
    this.createAuditTasks();
    this.auditTaskGroupId();
  }

  public getWorkflows() {
    const spy = jest.spyOn(workflow, 'getWorkflowsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: orderListData,
        total_nums: orderListData.length
      })
    );
    return spy;
  }

  public exportWorkflow() {
    const spy = jest.spyOn(workflow, 'exportWorkflowV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public batchCancelWorkflows() {
    const spy = jest.spyOn(workflow, 'batchCancelWorkflowsV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public createWorkflow() {
    const spy = jest.spyOn(workflow, 'createWorkflowV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          workflow_id: 'workflow id val'
        }
      })
    );
    return spy;
  }

  public createAndAuditTask() {
    const spy = jest.spyOn(task, 'createAndAuditTaskV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          task_group_id: 13,
          tasks: [
            {
              task_id: 18,
              instance_name: 'mysql2',
              instance_db_type: 'MySQL',
              instance_schema: 'dms',
              audit_level: '',
              score: 100,
              pass_rate: 1,
              status: 'audited',
              sql_source: 'form_data'
            }
          ]
        }
      })
    );
    return spy;
  }

  public getWorkflowTemplate() {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: WorkflowTemplateData
      })
    );
    return spy;
  }

  public createAuditTasks() {
    const spy = jest.spyOn(task, 'createAuditTasksV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          task_group_id: 99
        }
      })
    );
    return spy;
  }

  public auditTaskGroupId() {
    const spy = jest.spyOn(task, 'auditTaskGroupIdV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          task_group_id: 13
        }
      })
    );
    return spy;
  }
}

export default new MockOrderApi();
