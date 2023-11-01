import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import server from '@actiontech/shared/lib/api/diagnosis/service/server';
import db from '@actiontech/shared/lib/api/diagnosis/service/db';
import { databaseMonitorListData, serverMonitorListData } from './data';

class MockMonitorSourceConfigApi implements MockSpyApy {
  public mockAllApi(): void {
    this.serverMonitorList();
    this.addServerMonitor();
    this.updateServerMonitor();
    this.databaseMonitorList();
    this.addDatabaseMonitor();
    this.updateDatabaseMonitor();
  }

  public serverMonitorList() {
    const spy = jest.spyOn(server, 'V1ListServers');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        data: serverMonitorListData,
        message: 'ok',
        total: serverMonitorListData.length
      })
    );
    return spy;
  }

  public addServerMonitor() {
    const spy = jest.spyOn(server, 'V1AddServer');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public updateServerMonitor() {
    const spy = jest.spyOn(server, 'V1AddServer');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public databaseMonitorList() {
    const spy = jest.spyOn(db, 'V1ListMonitorDBs');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        data: databaseMonitorListData,
        message: 'ok',
        total: databaseMonitorListData.length
      })
    );
    return spy;
  }

  public addDatabaseMonitor() {
    const spy = jest.spyOn(db, 'V1AddDB');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public updateDatabaseMonitor() {
    const spy = jest.spyOn(db, 'V1AddDB');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }
}

export default new MockMonitorSourceConfigApi();
