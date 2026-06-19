import operationRecord from '../../../../api/sqle/service/OperationRecord';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import { operationRecordListMockData } from './data';

class MockOperationRecordApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getOperationRecordList();
    this.exportOperationRecordList();
  }

  public getOperationRecordList() {
    const spy = jest.spyOn(operationRecord, 'getOperationRecordListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: operationRecordListMockData,
        total: operationRecordListMockData.length
      })
    );
    return spy;
  }

  public exportOperationRecordList() {
    const spy = jest.spyOn(operationRecord, 'getExportOperationRecordListV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockOperationRecordApi();
