import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import dbAccountService from '../../../../api/provision/service/db_account/';
import {
  dbAccountMockData,
  dbAccountStaticsMockData,
  statementList,
  databaseAccountDetailMockData,
  discoveryDBAccountMockData
} from './data';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.authListDBAccount();
    this.authGetAccountStatics();
    this.authUpdateDBAccount();
    this.authDelDBAccount();
    this.authGetDBAccount();
    this.authGetStatement();
    this.authAddDBAccount();
    this.authDiscoveryDBAccount();
    this.authSyncDBAccount();
    this.authBatchUpdateDBAccountPassword();
  }

  public authListDBAccount() {
    const spy = jest.spyOn(dbAccountService, 'AuthListDBAccount');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: dbAccountMockData,
        total_nums: dbAccountMockData.length
      })
    );
    return spy;
  }

  public authGetAccountStatics() {
    const spy = jest.spyOn(dbAccountService, 'AuthGetAccountStatics');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: dbAccountStaticsMockData
      })
    );
    return spy;
  }

  public authUpdateDBAccount() {
    const spy = jest.spyOn(dbAccountService, 'AuthUpdateDBAccount');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authDelDBAccount() {
    const spy = jest.spyOn(dbAccountService, 'AuthDelDBAccount');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authGetDBAccount() {
    const spy = jest.spyOn(dbAccountService, 'AuthGetDBAccount');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: databaseAccountDetailMockData
      })
    );
    return spy;
  }

  public authGetStatement() {
    const spy = jest.spyOn(dbAccountService, 'AuthGetStatement');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: statementList
      })
    );
    return spy;
  }

  public authAddDBAccount() {
    const spy = jest.spyOn(dbAccountService, 'AuthAddDBAccount');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authDiscoveryDBAccount() {
    const spy = jest.spyOn(dbAccountService, 'AuthDiscoveryDBAccount');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          accounts: discoveryDBAccountMockData
        }
      })
    );
    return spy;
  }

  public authSyncDBAccount() {
    const spy = jest.spyOn(dbAccountService, 'AuthSyncDBAccount');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authBatchUpdateDBAccountPassword() {
    const spy = jest.spyOn(
      dbAccountService,
      'AuthBatchUpdateDBAccountPassword'
    );
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockAuthApi();
