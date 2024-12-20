import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  ruleTipsData,
  sqlManageListData,
  mockGlobalSqlManageListData
} from './data';

class MockSqlManageApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getSqlManageRuleTips();
    this.batchUpdateSqlManage();
    this.getSqlManageList();
    this.exportSqlManage();
    this.getGlobalSqlManageList();
    this.getGlobalSqlManageStatistics();
    this.sendSqlManage();
  }

  public getSqlManageRuleTips() {
    const spy = jest.spyOn(SqlManage, 'GetSqlManageRuleTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: ruleTipsData
      })
    );
    return spy;
  }

  public batchUpdateSqlManage() {
    const spy = jest.spyOn(SqlManage, 'BatchUpdateSqlManage');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0
      })
    );
    return spy;
  }

  public getSqlManageList() {
    const spy = jest.spyOn(SqlManage, 'GetSqlManageListV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        ...sqlManageListData,
        data: [sqlManageListData.data[0]]
      })
    );
    return spy;
  }

  public exportSqlManage() {
    const spy = jest.spyOn(SqlManage, 'exportSqlManageV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getGlobalSqlManageList() {
    const spy = jest.spyOn(SqlManage, 'GetGlobalSqlManageList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGlobalSqlManageListData,
        total_nums: mockGlobalSqlManageListData.length
      })
    );
    return spy;
  }

  public getGlobalSqlManageStatistics() {
    const spy = jest.spyOn(SqlManage, 'GetGlobalSqlManageStatistics');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: 10
      })
    );
    return spy;
  }

  public sendSqlManage() {
    const spy = jest.spyOn(SqlManage, 'SendSqlManage');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockSqlManageApi();
