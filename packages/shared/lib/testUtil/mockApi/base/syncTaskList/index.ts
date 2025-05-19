import { createSpySuccessResponse, MockSpyApy } from '../../../mockApi';
import {
  syncTaskDetailMockData,
  syncTaskListMockData,
  syncTaskTipsMockData
} from './data';
import DBServiceSyncTaskService from '../../../../api/base/service/DBServiceSyncTask';

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
    const spy = jest.spyOn(DBServiceSyncTaskService, 'ListDBServiceSyncTasks');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: syncTaskListMockData.length,
        data: syncTaskListMockData
      })
    );
    return spy;
  }

  public getTaskSource() {
    const spy = jest.spyOn(DBServiceSyncTaskService, 'GetDBServiceSyncTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: syncTaskDetailMockData
      })
    );
    return spy;
  }

  public addTaskSource() {
    const spy = jest.spyOn(DBServiceSyncTaskService, 'AddDBServiceSyncTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '1001'
      })
    );
    return spy;
  }

  public updateTaskSource() {
    const spy = jest.spyOn(DBServiceSyncTaskService, 'UpdateDBServiceSyncTask');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteTaskSource() {
    const spy = jest.spyOn(DBServiceSyncTaskService, 'DeleteDBServiceSyncTask');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public syncTaskSource() {
    const spy = jest.spyOn(DBServiceSyncTaskService, 'SyncDBServices');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getTaskSourceListTips() {
    const spy = jest.spyOn(
      DBServiceSyncTaskService,
      'ListDBServiceSyncTaskTips'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: syncTaskTipsMockData
      })
    );
    return spy;
  }
}

export default new MockTaskSourceApi();
