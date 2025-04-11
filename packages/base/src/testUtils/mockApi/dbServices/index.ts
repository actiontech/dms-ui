import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { resolveThreeSecond } from 'sqle/src/testUtils/mockRequest';
import {
  checkConnectableReply,
  dbServices,
  dbServicesTips,
  globalDataSourceMockData,
  globalDBServicesTipsMockData
} from './data';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';

class MockDbServicesApi implements MockSpyApy {
  public mockAllApi(): void {
    this.ListDBServices();
    this.AddDBService();
    this.UpdateDBService();
    this.DelDBService();
    this.checkDbServiceIsConnectable();
    this.checkDBServiceIsConnectableById();
    this.listGlobalDBServices();
    this.listGlobalDBServicesTips();
    this.CheckProjectDBServicesConnections();
  }

  public ListDBServices() {
    const spy = jest.spyOn(DBService, 'ListDBServices');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: dbServices
      })
    );
    return spy;
  }

  public ListDBServicesTips() {
    const spy = jest.spyOn(DBService, 'ListDBServiceTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: dbServicesTips
      })
    );
    return spy;
  }

  public AddDBService() {
    const spy = jest.spyOn(DBService, 'AddDBService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '123123'
      })
    );
    return spy;
  }

  public UpdateDBService() {
    const spy = jest.spyOn(DBService, 'UpdateDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DelDBService() {
    const spy = jest.spyOn(DBService, 'DelDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public checkInstanceIsConnectableByNameV1() {
    const spy = jest.spyOn(instance, 'checkInstanceIsConnectableByNameV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        is_instance_connectable: true
      })
    );
    return spy;
  }

  public checkDbServiceIsConnectable() {
    const spy = jest.spyOn(DBService, 'CheckDBServiceIsConnectable');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: checkConnectableReply
      })
    );
    return spy;
  }

  public checkDBServiceIsConnectableById() {
    const spy = jest.spyOn(DBService, 'CheckDBServiceIsConnectableById');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: checkConnectableReply
      })
    );
    return spy;
  }

  public listGlobalDBServices() {
    const spy = jest.spyOn(DBService, 'ListGlobalDBServicesV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: globalDataSourceMockData,
        total_nums: globalDataSourceMockData.length
      })
    );
    return spy;
  }

  public listGlobalDBServicesTips() {
    const spy = jest.spyOn(DBService, 'ListGlobalDBServicesTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: globalDBServicesTipsMockData
      })
    );
    return spy;
  }

  public CheckProjectDBServicesConnections() {
    const spy = jest.spyOn(DBService, 'CheckProjectDBServicesConnections');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: globalDBServicesTipsMockData
      })
    );
    return spy;
  }
}

export default new MockDbServicesApi();
