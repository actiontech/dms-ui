import sqlDEVRecord from '@actiontech/shared/lib/api/sqle/service/SqlDEVRecord';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { sqlDEVRecordListMockData } from './data';

class SqlDEVRecord implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditWhitelist();
  }

  public getAuditWhitelist() {
    const spy = jest.spyOn(sqlDEVRecord, 'GetSqlDEVRecordList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: sqlDEVRecordListMockData,
        total_nums: sqlDEVRecordListMockData.length
      })
    );
    return spy;
  }
}

export default new SqlDEVRecord();
