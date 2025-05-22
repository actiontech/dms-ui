import task from '../../../../api/sqle/service/task';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  AuditTaskSQLsMockData,
  SqlRewrittenMockDataNoDDL,
  TaskFileListMockData,
  workflowTaskDetailMockData
} from './data';

class TaskMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditTaskSQLs();
    this.updateAuditTaskSQLs();
    this.getAuditTask();
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

  public getTaskSQLRewritten() {
    const spy = jest.spyOn(task, 'RewriteSQL');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: SqlRewrittenMockDataNoDDL })
    );
    return spy;
  }
}

export default new TaskMockApi();
