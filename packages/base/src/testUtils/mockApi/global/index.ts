import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  BasicInfo,
  CompanyNotice,
  DBServicesList,
  GetUserPayload,
  oauth2Tips,
  UserInfo
} from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { mockProjectList } from '../project/data';

class MockDMSGlobalApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getCurrentUser();
    this.addSession();
    this.delSession();
    this.getUserBySession();
    this.bindUser();
    this.getOauth2Tips();
    this.getBasicInfo();
    this.getCompanyNotice();
    this.updateCompanyNotice();
    this.getListDBServiceDriverOption();
    this.getListDBServices();
    this.AddDBService();
    this.UpdateDBService();
    this.DelDBService();
    this.CheckDBServiceIsConnectable();
    this.getProjectList();
  }

  public getCurrentUser() {
    const spy = jest.spyOn(dms, 'GetUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: GetUserPayload
      })
    );
    return spy;
  }

  public addSession() {
    const spy = jest.spyOn(dms, 'AddSession');
    spy.mockImplementation(() => {
      return createSpySuccessResponse({
        data: {
          token: UserInfo.token,
          user_uid: UserInfo.userUid
        }
      });
    });
    return spy;
  }

  public delSession() {
    const spy = jest.spyOn(dms, 'DelSession');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getUserBySession() {
    const spy = jest.spyOn(dms, 'GetUserBySession');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        name: UserInfo.name,
        user_uid: UserInfo.userUid
      })
    );
    return spy;
  }

  public bindUser() {
    const spy = jest.spyOn(dms, 'BindOauth2User');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          token: 'token'
        }
      })
    );
    return spy;
  }

  public getOauth2Tips() {
    const spy = jest.spyOn(dms, 'GetOauth2Tips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: oauth2Tips
      })
    );
    return spy;
  }

  public getBasicInfo() {
    const spy = jest.spyOn(dms, 'GetBasicInfo');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: BasicInfo
      })
    );
    return spy;
  }

  public getCompanyNotice() {
    const spy = jest.spyOn(dms, 'GetCompanyNotice');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: CompanyNotice })
    );
    return spy;
  }

  public updateCompanyNotice() {
    const spy = jest.spyOn(dms, 'UpdateCompanyNotice');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getListDBServiceDriverOption() {
    const spy = jest.spyOn(dms, 'ListDBServiceDriverOption');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            db_type: 'mysql',
            logo_path: 'logo_path_mock',
            params: [{ description: 'description', name: 'cc' }]
          }
        ]
      })
    );
    return spy;
  }

  public getListDBServices() {
    const spy = jest.spyOn(dms, 'ListDBServices');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: DBServicesList.length,
        data: DBServicesList
      })
    );
    return spy;
  }

  public AddDBService() {
    const spy = jest.spyOn(dms, 'AddDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DelDBService() {
    const spy = jest.spyOn(dms, 'DelDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public UpdateDBService() {
    const spy = jest.spyOn(dms, 'UpdateDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public CheckDBServiceIsConnectable() {
    const spy = jest.spyOn(dms, 'CheckDBServiceIsConnectableById');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getProjectList() {
    const spy = jest.spyOn(dms, 'ListProjects');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: mockProjectList.length,
        data: mockProjectList
      })
    );
    return spy;
  }
}

export default new MockDMSGlobalApi();
