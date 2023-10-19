import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import { taskList, taskListTips } from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

class MockTaskSourceApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getTaskSourceList();
    this.getTaskSource();
    this.addTaskSource();
    this.updateTaskSource();
    this.deleteTaskSource();
    this.syncTaskSource();
    this.getTaskSourceListTips();
  }

  public getTaskSourceList() {
    const spy = jest.spyOn(dms, 'ListDatabaseSourceServices');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: taskList.length,
        database_source_services: taskList
      })
    );
    return spy;
  }

  public getTaskSource() {
    const spy = jest.spyOn(dms, 'GetDatabaseSourceService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        database_source_service: taskList[0]
      })
    );
    return spy;
  }

  public addTaskSource() {
    const spy = jest.spyOn(dms, 'AddDatabaseSourceService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '1001'
      })
    );
    return spy;
  }

  public updateTaskSource() {
    const spy = jest.spyOn(dms, 'UpdateDatabaseSourceService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteTaskSource() {
    const spy = jest.spyOn(dms, 'DeleteDatabaseSourceService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public syncTaskSource() {
    const spy = jest.spyOn(dms, 'SyncDatabaseSourceService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getTaskSourceListTips() {
    const spy = jest.spyOn(dms, 'ListDatabaseSourceServiceTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: taskListTips.length,
        database_sources: taskListTips
      })
    );
    return spy;
  }
}

export default new MockTaskSourceApi();
