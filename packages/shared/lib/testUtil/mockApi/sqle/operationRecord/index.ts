import operationRecord from '../../../../api/sqle/service/OperationRecord';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  operationRecordListMockData,
  operationTypeNameMockData,
  operationActionMockData
} from './data';

class MockOperationRecordApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getOperationRecordList();
    this.exportOperationRecordList();
    this.getOperationActionList();
    this.getOperationTypeNameList();
  }

  public getOperationRecordList() {
    const spy = jest.spyOn(operationRecord, 'getOperationRecordListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: operationRecordListMockData,
        total_nums: operationRecordListMockData.length
      })
    );
    return spy;
  }

  public exportOperationRecordList() {
    const spy = jest.spyOn(operationRecord, 'getExportOperationRecordListV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getOperationActionList() {
    const spy = jest.spyOn(operationRecord, 'getOperationActionList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: operationActionMockData
      })
    );
    return spy;
  }

  public getOperationTypeNameList() {
    const spy = jest.spyOn(operationRecord, 'GetOperationTypeNameList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: operationTypeNameMockData
      })
    );
    return spy;
  }
}

export default new MockOperationRecordApi();
