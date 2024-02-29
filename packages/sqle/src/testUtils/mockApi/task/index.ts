import task from '@actiontech/shared/lib/api/sqle/service/task';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { AuditTaskSQLsMockData, workflowTaskDetailMockData } from './data';

class TaskMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditTaskSQLs();
    this.updateAuditTaskSQLs();
    this.getAuditTask();
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
}

export default new TaskMockApi();
