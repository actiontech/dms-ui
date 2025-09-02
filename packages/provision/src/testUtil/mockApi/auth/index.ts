import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  instanceList,
  databaseList,
  tableList,
  businesses,
  userList,
  accountListByService,
  mockDBOperationsData
} from './data';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.listUsers();
    this.listBusinesses();
    this.listServices();
    this.syncService();
    this.listDataBases();
    this.getUsersFromDBService();
    this.listTables();
    this.authListOperations();
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

  public listBusinesses() {
    const spy = jest.spyOn(auth, 'AuthListBusiness');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: { businesses } })
    );
    return spy;
  }

  public authListOperations() {
    const spy = jest.spyOn(auth, 'AuthListOperations');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockDBOperationsData })
    );
    return spy;
  }
}

export default new MockAuthApi();
