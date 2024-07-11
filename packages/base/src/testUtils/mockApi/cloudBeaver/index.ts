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
import CBOperationLogs from '@actiontech/shared/lib/api/base/service/CBOperationLogs';

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
    const spy = jest.spyOn(CBOperationLogs, 'ListCBOperationLogs');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        ...listCBOperationLogsMockReturnData
      })
    );
    return spy;
  }

  public exportCBOperationLogs() {
    const spy = jest.spyOn(CBOperationLogs, 'ExportCBOperationLogs');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getCBOperationLogTips() {
    const spy = jest.spyOn(CBOperationLogs, 'GetCBOperationLogTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: CBOperationLogTipsMockData
      })
    );
    return spy;
  }
}

export default new MockCloudBeaverApi();
