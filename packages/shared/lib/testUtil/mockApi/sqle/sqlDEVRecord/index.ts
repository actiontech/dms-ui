import sqlDEVRecord from '../../../../api/sqle/service/SqlDEVRecord';
import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import { sqlDEVRecordListMockData } from './data';

class SqlDEVRecord implements MockSpyApy {
  public mockAllApi(): void {
    this.getSqlDEVRecordList();
  }

  public getSqlDEVRecordList() {
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
