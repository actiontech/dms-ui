import operationRecord from '../../../../api/sqle/service/OperationRecord';
import baseOperationRecord from '../../../../api/base/service/OperationRecord';
import { MockSpyApy, createSpySuccessResponse } from '../../common';
import { operationRecordListMockData } from './data';

const operationTypeNameMockData = [
  { operation_type_name: 'user', desc: '用户' },
  { operation_type_name: 'workflow', desc: '工单' }
];

const operationActionMockData = [
  {
    operation_type: 'workflow',
    operation_action: 'create_workflow',
    desc: '创建工单'
  }
];

const operationUserNameMockData = [
  {
    operation_user_name: 'admin',
    operation_req_ip: '127.0.0.1',
    desc: 'admin (127.0.0.1)'
  }
];

class MockOperationRecordApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getOperationRecordList();
    this.exportOperationRecordList();
    this.getOperationTypeNameList();
    this.getOperationActionList();
    this.getOperationUserNameList();
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

  public getOperationTypeNameList() {
    const dmsSpy = jest.spyOn(baseOperationRecord, 'GetOperationTypeNameList');
    dmsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: operationTypeNameMockData })
    );
    const sqleSpy = jest.spyOn(operationRecord, 'GetOperationTypeNameList');
    sqleSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: operationTypeNameMockData })
    );
    return { dmsSpy, sqleSpy };
  }

  public getOperationActionList() {
    const dmsSpy = jest.spyOn(baseOperationRecord, 'GetOperationActionList');
    dmsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: operationActionMockData })
    );
    const sqleSpy = jest.spyOn(operationRecord, 'getOperationActionList');
    sqleSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: operationActionMockData })
    );
    return { dmsSpy, sqleSpy };
  }

  public getOperationUserNameList() {
    const spy = jest.spyOn(baseOperationRecord, 'GetOperationUserNameList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: operationUserNameMockData })
    );
    return spy;
  }
}

export default new MockOperationRecordApi();
