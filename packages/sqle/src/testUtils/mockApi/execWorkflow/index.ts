import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import {
  AuditTaskSQLsData,
  WorkflowTasksItemData,
  WorkflowTemplateData,
  WorkflowListData,
  WorkflowsOverviewListData,
  AuditTaskResData,
  mockGlobalWorkflowListData
} from './data';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { AxiosResponse } from 'axios';

class MockWorkflowApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getWorkflows();
    this.exportWorkflow();
    this.batchCancelWorkflows();
    this.createWorkflow();
    this.createAndAuditTask();
    this.getWorkflowTemplate();
    this.createAuditTasks();
    this.auditTaskGroupId();
    this.updateWorkflow();
    this.getAuditTaskSQLContent();
    this.cancelWorkflow();
    this.getSummaryOfInstanceTasks();
    this.executeOneTaskOnWorkflow();
    this.terminateSingleTaskByWorkflow();
    this.updateWorkflowSchedule();
    this.getAuditTaskSQLs();
    this.updateAuditTaskSQLs();
    this.downloadAuditTaskSQLFile();
    this.downloadAuditTaskSQLReport();
    this.getWorkflow();
    this.approveWorkflow();
    this.rejectWorkflow();
    this.executeTasksOnWorkflow();
    this.getWorkflowAttachment();
    this.getGlobalWorkflows();
    this.getGlobalWorkflowStatistics();
  }

  public getWorkflows() {
    const spy = jest.spyOn(workflow, 'getWorkflowsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: WorkflowListData,
        total_nums: WorkflowListData.length
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
          task_group_id: 13,
          tasks: AuditTaskResData
        }
      })
    );
    return spy;
  }

  public updateWorkflow() {
    const spy = jest.spyOn(workflow, 'updateWorkflowV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          code: ResponseCode.SUCCESS
        }
      })
    );
    return spy;
  }

  public getAuditTaskSQLContent() {
    const spy = jest.spyOn(task, 'getAuditTaskSQLContentV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          sql: `INSERT INTO your_table_name (telephone_number, email_address, china_id_card, debit_card_account_number, credit_card, name, mac_address, bitcoin, age)
VALUES ('1234567890', 'example@email.com', '123456789012345678', '9876543210', '1234567890123456', 'John Doe', '00:11:22:33:44:55', '1AbC2dEfG3hI4jK5mN6pQ7rStU8vW9xY0z', 30);`
        }
      })
    );
    return spy;
  }

  public cancelWorkflow() {
    const spy = jest.spyOn(workflow, 'cancelWorkflowV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getSummaryOfInstanceTasks() {
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: WorkflowTasksItemData
      })
    );
    return spy;
  }

  public executeOneTaskOnWorkflow() {
    const spy = jest.spyOn(workflow, 'executeOneTaskOnWorkflowV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public terminateSingleTaskByWorkflow() {
    const spy = jest.spyOn(workflow, 'terminateSingleTaskByWorkflowV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateWorkflowSchedule() {
    const spy = jest.spyOn(workflow, 'updateWorkflowScheduleV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getAuditTaskSQLs() {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AuditTaskSQLsData,
        total_nums: AuditTaskSQLsData.length
      })
    );
    return spy;
  }

  public updateAuditTaskSQLs() {
    const spy = jest.spyOn(task, 'updateAuditTaskSQLsV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public downloadAuditTaskSQLFile() {
    const spy = jest.spyOn(task, 'downloadAuditTaskSQLFileV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public downloadAuditTaskSQLReport() {
    const spy = jest.spyOn(task, 'downloadAuditTaskSQLReportV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getWorkflow() {
    const spy = jest.spyOn(workflow, 'getWorkflowV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: WorkflowsOverviewListData
      })
    );
    return spy;
  }

  public approveWorkflow() {
    const spy = jest.spyOn(workflow, 'approveWorkflowV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public rejectWorkflow() {
    const spy = jest.spyOn(workflow, 'rejectWorkflowV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public executeTasksOnWorkflow() {
    const spy = jest.spyOn(workflow, 'executeTasksOnWorkflowV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public batchCompleteWorkflows() {
    const spy = jest.spyOn(workflow, 'batchCompleteWorkflowsV3');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public terminateMultipleTaskByWorkflow() {
    const spy = jest.spyOn(workflow, 'terminateMultipleTaskByWorkflowV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getScheduledTaskDefaultOption() {
    const spy = jest.spyOn(workflow, 'getScheduledTaskDefaultOptionV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          default_selector: 'feishu'
        }
      })
    );
    return spy;
  }

  public getWorkflowAttachment() {
    const spy = jest.spyOn(workflow, 'getWorkflowAttachment');
    spy.mockImplementation(() => {
      return new Promise<AxiosResponse<any>>((res) => {
        setTimeout(() => {
          res({
            status: 200,
            headers: {},
            config: {},
            statusText: '',
            data: new Blob(['test file content'])
          });
        }, 3000);
      });
    });
    return spy;
  }

  public getGlobalWorkflows() {
    const spy = jest.spyOn(workflow, 'getGlobalWorkflowsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalWorkflowListData,
        total_nums: mockGlobalWorkflowListData.length
      })
    );
    return spy;
  }

  public getGlobalWorkflowStatistics() {
    const spy = jest.spyOn(workflow, 'GetGlobalWorkflowStatistics');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: 10
      })
    );
    return spy;
  }
}

export default new MockWorkflowApi();
