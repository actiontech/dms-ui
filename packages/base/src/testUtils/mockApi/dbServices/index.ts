import dms from '@actiontech/shared/lib/api/base/service/dms';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { resolveThreeSecond } from 'sqle/src/testUtils/mockRequest';
import { checkConnectableReply, dbServices, dbServicesTips } from './data';

class MockDbServicesApi implements MockSpyApy {
  public mockAllApi(): void {
    this.ListDBServices();
    this.AddDBService();
    this.UpdateDBService();
    this.DelDBService();
    this.checkDbServiceIsConnectable();
    this.checkDBServiceIsConnectableById();
  }

  public ListDBServices() {
    const spy = jest.spyOn(dms, 'ListDBServices');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: dbServices
      })
    );
    return spy;
  }

  public ListDBServicesTips() {
    const spy = jest.spyOn(dms, 'ListDBServiceTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: dbServicesTips
      })
    );
    return spy;
  }

  public AddDBService() {
    const spy = jest.spyOn(dms, 'AddDBService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '123123'
      })
    );
    return spy;
  }

  public UpdateDBService() {
    const spy = jest.spyOn(dms, 'UpdateDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DelDBService() {
    const spy = jest.spyOn(dms, 'DelDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public AuthSyncService() {
    const spy = jest.spyOn(auth, 'AuthSyncService');
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
    const spy = jest.spyOn(dms, 'CheckDBServiceIsConnectable');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: checkConnectableReply
      })
    );
    return spy;
  }

  public checkDBServiceIsConnectableById() {
    const spy = jest.spyOn(dms, 'CheckDBServiceIsConnectableById');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: checkConnectableReply
      })
    );
    return spy;
  }
}

export default new MockDbServicesApi();
