import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  instanceList,
  databaseList,
  tableList,
  DataPermissionList,
  operationSetList,
  statementList,
  dataSourceList,
  businesses,
  authAuditList,
  templateAuditList,
  serviceAuditList,
  userList,
  accountListByService,
  mockDBOperationsData
} from './data';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.listUsers();
    this.getDataPermissionsInDataPermissionTemplate();
    this.verifyDBAccount();
    this.getStatementsByDataPermissionTemplate();
    this.copyDataPermissionTemplate();
    this.addDataPermissionTemplate();
    this.updateDataPermissionTemplate();
    this.listBusinesses();
    this.listServices();
    this.syncService();
    this.addService();
    this.removeService();
    this.listDataBases();
    this.addDataObjectSource();
    this.updateDataObjectSource();
    this.syncFromDataSource();
    this.getUsersFromDBService();
    this.listTables();
    this.listOperationSets();
    this.listAuthorizationEvents();
    this.listDataObjectServiceEvents();
    this.listDataPermissionTemplateEvents();
    this.listDataObjectSources();
    this.delDataObjectSource();
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

  public addService() {
    const spy = jest.spyOn(auth, 'AddService');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '123'
      })
    );
    return spy;
  }

  public removeService() {
    const spy = jest.spyOn(auth, 'AuthDelService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public listOperationSets() {
    const spy = jest.spyOn(auth, 'AuthListDataOperationSets');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: operationSetList.length,
        data: operationSetList
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

  public getDataPermissionsInDataPermissionTemplate() {
    const spy = jest.spyOn(
      auth,
      'AuthGetDataPermissionsInDataPermissionTemplate'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: DataPermissionList,
        total_nums: DataPermissionList.length
      })
    );
    return spy;
  }

  public addDataPermissionTemplate() {
    const spy = jest.spyOn(auth, 'AuthAddDataPermissionTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({ uid: '123' }));
    return spy;
  }
  public updateDataPermissionTemplate() {
    const spy = jest.spyOn(auth, 'AuthUpdateDataPermissionTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getStatementsByDataPermissionTemplate() {
    const spy = jest.spyOn(auth, 'AuthGetStatementByDataPermissionTemplates');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: statementList.length,
        statements: statementList
      })
    );
    return spy;
  }

  public copyDataPermissionTemplate() {
    const spy = jest.spyOn(auth, 'AuthCopyDataPermissionTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({ uid: '123' }));
    return spy;
  }

  public listDataObjectSources() {
    const spy = jest.spyOn(auth, 'AuthListDataObjectSources');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: dataSourceList.length,
        data_object_sources: dataSourceList
      })
    );
    return spy;
  }

  public addDataObjectSource() {
    const spy = jest.spyOn(auth, 'AuthAddDataObjectSource');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '123'
      })
    );
    return spy;
  }

  public updateDataObjectSource() {
    const spy = jest.spyOn(auth, 'AuthUpdateDataObjectSource');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public syncFromDataSource() {
    const spy = jest.spyOn(auth, 'AuthSyncFromDataObjectSource');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public delDataObjectSource() {
    const spy = jest.spyOn(auth, 'AuthDelDataObjectSource');
    spy.mockImplementation(() => createSpySuccessResponse({}));
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

  public verifyDBAccount = () => {
    const spy = jest.spyOn(auth, 'AuthVerifyDBAccount');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  };

  public listAuthorizationEvents() {
    const spy = jest.spyOn(auth, 'AuditListAuthorizationEvents');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: authAuditList.length,
        data: authAuditList
      })
    );
    return spy;
  }

  public listDataObjectServiceEvents() {
    const spy = jest.spyOn(auth, 'AuditListDataObjectServiceEvents');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: serviceAuditList.length,
        data: serviceAuditList
      })
    );
    return spy;
  }

  public listDataPermissionTemplateEvents() {
    const spy = jest.spyOn(auth, 'AuditListDataPermissionTemplateEvents');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: templateAuditList.length,
        data: templateAuditList
      })
    );
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
