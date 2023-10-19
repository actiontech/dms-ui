import dms from '@actiontech/shared/lib/api/base/service/dms';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { resolveThreeSecond } from 'sqle/src/testUtils/mockRequest';
import { dbServices } from './data';

class MockDbServicesApi implements MockSpyApy {
  public mockAllApi(): void {
    this.ListDBServices();
    this.AddDBService();
    this.UpdateDBService();
    this.DelDBService();
  }

  public ListDBServices() {
    const spy = jest.spyOn(dms, 'ListDBServices');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: dbServices.length,
        db_services: dbServices
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

  public checkInstanceIsConnectableByNameV1() {
    const spy = jest.spyOn(instance, 'checkInstanceIsConnectableByNameV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        is_instance_connectable: true
      })
    );
    return spy;
  }
}

export default new MockDbServicesApi();
