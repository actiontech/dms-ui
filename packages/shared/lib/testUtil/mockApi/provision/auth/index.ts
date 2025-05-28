import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import {
  instanceList,
  databaseList,
  tableList,
  userList,
  accountListByService,
  mockDBOperationsData,
  mockEnvironmentTagsData
} from './data';
import auth from '../../../../api/provision/service/auth';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.listUsers();
    this.listServices();
    this.syncService();
    this.listDataBases();
    this.getUsersFromDBService();
    this.listTables();
    this.authListOperations();
    this.authListEnvironmentTags();
  }

  public listUsers() {
    const spy = jest.spyOn(auth, 'AuthListUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: userList
      })
    );
    return spy;
  }

  public listServices() {
    const spy = jest.spyOn(auth, 'AuthListService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: instanceList
      })
    );
    return spy;
  }

  public listDataBases() {
    const spy = jest.spyOn(auth, 'AuthListDatabase');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: databaseList.length,
        data: databaseList
      })
    );
    return spy;
  }

  public listTables() {
    const spy = jest.spyOn(auth, 'AuthListTable');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: tableList.length,
        data: tableList
      })
    );
    return spy;
  }

  public getUsersFromDBService() {
    const spy = jest.spyOn(auth, 'AuthGetUsersFromDBService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ users: accountListByService })
    );
    return spy;
  }

  public syncService() {
    const spy = jest.spyOn(auth, 'AuthSyncService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authListOperations() {
    const spy = jest.spyOn(auth, 'AuthListOperations');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockDBOperationsData })
    );
    return spy;
  }

  public authListEnvironmentTags() {
    const spy = jest.spyOn(auth, 'AuthListEnvironmentTags');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: { environment_tags: mockEnvironmentTagsData }
      })
    );
    return spy;
  }
}

export default new MockAuthApi();
