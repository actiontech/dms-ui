import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  disableSqlQueryUrlData,
  listCBOperationLogsMockReturnData,
  CBOperationLogTipsMockData
} from './data';
import cloudbeaver from '@actiontech/shared/lib/api/base/service/cloudbeaver';
import dms from '@actiontech/shared/lib/api/base/service/dms';

class MockCloudBeaverApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getSqlQueryUrl();
    this.listCBOperationLogs();
    this.exportCBOperationLogs();
    this.getCBOperationLogTips();
  }

  public getSqlQueryUrl() {
    const spy = jest.spyOn(cloudbeaver, 'GetSQLQueryConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: disableSqlQueryUrlData
      })
    );
    return spy;
  }

  public listCBOperationLogs() {
    const spy = jest.spyOn(dms, 'ListCBOperationLogs');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        ...listCBOperationLogsMockReturnData
      })
    );
    return spy;
  }

  public exportCBOperationLogs() {
    const spy = jest.spyOn(dms, 'ExportCBOperationLogs');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getCBOperationLogTips() {
    const spy = jest.spyOn(dms, 'GetCBOperationLogTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: CBOperationLogTipsMockData
      })
    );
    return spy;
  }
}

export default new MockCloudBeaverApi();
