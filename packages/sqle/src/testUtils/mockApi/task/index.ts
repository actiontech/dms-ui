import task from '@actiontech/shared/lib/api/sqle/service/task';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  AuditTaskSQLsMockData,
  TaskFileListMockData,
  workflowTaskDetailMockData
} from './data';

class TaskMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditTaskSQLs();
    this.updateAuditTaskSQLs();
    this.getAuditTask();
    this.getAuditTaskSummary();
    this.getAuditFileList();
    this.getSqlFileOrderMethod();
  }

  public getAuditTaskSQLs() {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: AuditTaskSQLsMockData,
        total_nums: AuditTaskSQLsMockData.length
      })
    );
    return spy;
  }

  public updateAuditTaskSQLs() {
    const spy = jest.spyOn(task, 'updateAuditTaskSQLsV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getAuditTask() {
    const spy = jest.spyOn(task, 'getAuditTaskV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: workflowTaskDetailMockData
      })
    );
    return spy;
  }

  public getAuditTaskSummary() {
    const spy = jest.spyOn(task, 'getAuditTaskSummaryV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          level_summary: {
            error_count: 0,
            error_p0_count: 0,
            error_p1_count: 0,
            warn_count: 0,
            notice_count: 0,
            normal_count: 0,
            sql_count: 0
          },
          rule_hit_details: []
        }
      })
    );
    return spy;
  }

  public getAuditFileList() {
    const spy = jest.spyOn(task, 'getAuditFileList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: TaskFileListMockData
      })
    );
    return spy;
  }

  public getAuditFileExecStatistic() {
    const spy = jest.spyOn(task, 'getAuditFileExecStatistic');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: TaskFileListMockData[0]
      })
    );
    return spy;
  }

  public getSqlFileOrderMethod() {
    const spy = jest.spyOn(task, 'getSqlFileOrderMethodV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          methods: [{ desc: 'desc1', order_method: 'value1' }]
        }
      })
    );
    return spy;
  }

  public updateSqlFileOrder() {
    const spy = jest.spyOn(task, 'updateSqlFileOrderV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new TaskMockApi();
