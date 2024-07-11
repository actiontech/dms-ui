import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import { taskList, taskListTips } from './data';
import DatabaseSourceService from '@actiontech/shared/lib/api/base/service/DatabaseSourceService';

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
    const spy = jest.spyOn(DatabaseSourceService, 'ListDatabaseSourceServices');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: taskList.length,
        data: taskList
      })
    );
    return spy;
  }

  public getTaskSource() {
    const spy = jest.spyOn(DatabaseSourceService, 'GetDatabaseSourceService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: taskList[0]
      })
    );
    return spy;
  }

  public addTaskSource() {
    const spy = jest.spyOn(DatabaseSourceService, 'AddDatabaseSourceService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '1001'
      })
    );
    return spy;
  }

  public updateTaskSource() {
    const spy = jest.spyOn(
      DatabaseSourceService,
      'UpdateDatabaseSourceService'
    );
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteTaskSource() {
    const spy = jest.spyOn(
      DatabaseSourceService,
      'DeleteDatabaseSourceService'
    );
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public syncTaskSource() {
    const spy = jest.spyOn(DatabaseSourceService, 'SyncDatabaseSourceService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getTaskSourceListTips() {
    const spy = jest.spyOn(
      DatabaseSourceService,
      'ListDatabaseSourceServiceTips'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: taskListTips
      })
    );
    return spy;
  }
}

export default new MockTaskSourceApi();
