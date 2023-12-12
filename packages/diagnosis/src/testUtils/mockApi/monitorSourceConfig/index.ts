import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import server from '../../../api/server';
import db from '../../../api/db';
import monitor from '../../../api/monitor';
import {
  databaseMonitorListData,
  monitorRoutineListData,
  monitorRoutineMetricsListData,
  serverMonitorListData
} from './data';
import { createSpySuccessResponseWithoutDataParams } from '../../mockApi';

class MockMonitorSourceConfigApi implements MockSpyApy {
  public mockAllApi(): void {
    this.serverMonitorList();
    this.addServerMonitor();
    this.updateServerMonitor();
    this.deleteServerMonitor();
    this.getServerMonitorHostName();
    this.databaseMonitorList();
    this.addDatabaseMonitor();
    this.updateDatabaseMonitor();
    this.deleteDatabaseMonitor();
    this.getMonitorRoutineList();
    this.getMonitorRoutineMetrics();
  }

  public serverMonitorList() {
    const spy = jest.spyOn(server, 'V1ListServers');
    spy.mockImplementation(() =>
      createSpySuccessResponse(serverMonitorListData)
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
    const spy = jest.spyOn(server, 'V1UpdateServer');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public deleteServerMonitor() {
    const spy = jest.spyOn(server, 'V1DeleteServer');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public getServerMonitorHostName() {
    const spy = jest.spyOn(server, 'V1GetServerHostname');
    spy.mockImplementation(() =>
      createSpySuccessResponseWithoutDataParams({
        code: 0,
        hostname: 'host1',
        message: 'ok'
      })
    );
    return spy;
  }

  public databaseMonitorList() {
    const spy = jest.spyOn(db, 'V1ListMonitorDBs');
    spy.mockImplementation(() =>
      createSpySuccessResponse(databaseMonitorListData)
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
    const spy = jest.spyOn(db, 'V1UpdateDB');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public deleteDatabaseMonitor() {
    const spy = jest.spyOn(db, 'V1DeleteDB');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public getMonitorRoutineList() {
    const spy = jest.spyOn(monitor, 'V1ListMonitorRoutine');
    spy.mockImplementation(() =>
      createSpySuccessResponse(monitorRoutineListData)
    );
    return spy;
  }

  public getMonitorRoutineMetrics() {
    const spy = jest.spyOn(monitor, 'V1ListRoutineMetrics');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        metrics: monitorRoutineMetricsListData,
        routine_id: 1
      })
    );
    return spy;
  }
}

export default new MockMonitorSourceConfigApi();
