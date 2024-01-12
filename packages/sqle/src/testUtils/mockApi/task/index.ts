import task from '@actiontech/shared/lib/api/sqle/service/task';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { AuditTaskSQLsMockData } from './data';

class TaskMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditTaskSQLs();
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
}

export default new TaskMockApi();
