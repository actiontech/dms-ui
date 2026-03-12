import baseOperationRecord from '../../../../api/base/service/OperationRecord';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import { operationRecordListMockData } from './data';

class MockOperationRecordApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getOperationRecordList();
    this.exportOperationRecordList();
  }

  public getOperationRecordList() {
    const spy = jest.spyOn(baseOperationRecord, 'GetOperationRecordList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: operationRecordListMockData,
        total_nums: operationRecordListMockData.length
      })
    );
    return spy;
  }

  public exportOperationRecordList() {
    const spy = jest.spyOn(baseOperationRecord, 'ExportOperationRecordList');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockOperationRecordApi();
