import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { ruleTipsData, sqlManageListData, remediationMockData } from './data';

class MockSqlManageApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getSqlManageRuleTips();
    this.batchUpdateSqlManage();
    this.getSqlManageList();
    this.getSqlManageRemediation();
    this.exportSqlManage();
    this.exportSqlManageRemediation();
    this.exportGlobalSqlManageRemediation();
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

  public getSqlManageRemediation() {
    const spy = jest.spyOn(SqlManage, 'GetSqlManageRemediationV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: remediationMockData
      })
    );
    return spy;
  }

  public exportSqlManageRemediation() {
    const spy = jest.spyOn(SqlManage, 'exportSqlManageRemediationV1');
    spy.mockImplementation(() => createSpySuccessResponse({}, { status: 200 }));
    return spy;
  }

  public exportGlobalSqlManageRemediation() {
    const spy = jest.spyOn(SqlManage, 'exportGlobalSqlManageRemediationV1');
    spy.mockImplementation(() => createSpySuccessResponse({}, { status: 200 }));
    return spy;
  }
}

export default new MockSqlManageApi();
