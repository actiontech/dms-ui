import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  instanceList,
  authorizationList,
  databaseList,
  tableList,
  DataPermissionList,
  DBAccountList,
  operationSetList,
  templateList,
  statementList,
  AuthorizationDetails,
  dataSourceList,
  businesses,
  authAuditList,
  templateAuditList,
  serviceAuditList,
  userList,
  accountListByService,
  tipsList
} from './data';
import { AxiosResponse } from 'axios';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IAuthGetAuthorizationReturn } from '@actiontech/shared/lib/api/provision/service/auth/index.d';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.listAuthorizationReq();
    this.addAuthorization();
    this.updateAuthorization();
    this.removeAuthorization();
    this.listTipsByAuthorizationKeyReq();
    this.listUsers();
    this.listDataPermissionTemplate();
    this.getDataPermissionsInDataPermissionTemplate();
    this.listDBAccountByAuth();
    this.getAuthorization();
    this.verifyDBAccount();
    this.getStatementsByDataPermissionTemplate();
    this.copyDataPermissionTemplate();
    this.removeDataPermissionTemplate();
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

  public listAuthorizationReq() {
    const spy = jest.spyOn(auth, 'AuthListAuthorization');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: authorizationList.length,
        data: authorizationList
      })
    );
    return spy;
  }

  public addAuthorization() {
    const spy = jest.spyOn(auth, 'AuthAddAuthorization');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: ''
      })
    );
    return spy;
  }

  public updateAuthorization() {
    const spy = jest.spyOn(auth, 'AuthUpdateAuthorization');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public removeAuthorization() {
    const spy = jest.spyOn(auth, 'AuthDelAuthorization');
    spy.mockImplementation(() => createSpySuccessResponse({}));
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

  public listDBAccountByAuth() {
    const spy = jest.spyOn(auth, 'AuthListDBAccountByAuthorization');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        db_accounts: DBAccountList,
        total: DBAccountList.length
      })
    );
    return spy;
  }

  public listDataPermissionTemplate() {
    const spy = jest.spyOn(auth, 'AuthListDataPermissionTemplate');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: templateList
      })
    );
    return spy;
  }

  public removeDataPermissionTemplate() {
    const spy = jest.spyOn(auth, 'AuthDelDataPermissionTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
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

  // 这个接口比较特殊，故暂时采用这种写法
  public getAuthorization() {
    const spy = jest.spyOn(auth, 'AuthGetAuthorization');
    spy.mockImplementation(
      () =>
        new Promise<AxiosResponse<IAuthGetAuthorizationReturn>>((res) => {
          setTimeout(() => {
            res({
              status: 200,
              headers: {},
              config: {},
              statusText: '',
              data: {
                code: 0,
                message: 'ok',
                data: AuthorizationDetails
              }
            });
          }, 3000);
        })
    );
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
        total: authAuditList.length,
        events: authAuditList
      })
    );
    return spy;
  }

  public listDataObjectServiceEvents() {
    const spy = jest.spyOn(auth, 'AuditListDataObjectServiceEvents');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: serviceAuditList.length,
        events: serviceAuditList
      })
    );
    return spy;
  }

  public listDataPermissionTemplateEvents() {
    const spy = jest.spyOn(auth, 'AuditListDataPermissionTemplateEvents');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: templateAuditList.length,
        events: templateAuditList
      })
    );
    return spy;
  }

  public listTipsByAuthorizationKeyReq() {
    const spy = jest.spyOn(auth, 'ListTipsByAuthorizationKey');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: { tips: tipsList } })
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
}

export default new MockAuthApi();
