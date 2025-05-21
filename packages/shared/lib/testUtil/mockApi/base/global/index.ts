import { createSpySuccessResponse, MockSpyApy } from '../../common';
import {
  BasicInfoMockData,
  CompanyNoticeMockData,
  DBServicesList,
  GetUserPayload,
  oauth2Tips,
  UserInfo,
  mockVerifyLoginData
} from './data';
import { mockProjectList } from '../project/data';
import Session from '../../../../api/base/service/Session';
import OAuth2 from '../../../../api/base/service/OAuth2';
import DBService from '../../../../api/base/service/DBService';
import CompanyNotice from '../../../../api/base/service/CompanyNotice';
import User from '../../../../api/base/service/User';
import BasicInfo from '../../../../api/base/service/BasicInfo';
import Project from '../../../../api/base/service/Project';

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
    this.verifyUserLogin();
  }

  public getCurrentUser() {
    const spy = jest.spyOn(User, 'GetUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: GetUserPayload
      })
    );
    return spy;
  }

  public addSession() {
    const spy = jest.spyOn(Session, 'AddSession');
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
    const spy = jest.spyOn(Session, 'DelSession');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getUserBySession() {
    const spy = jest.spyOn(Session, 'GetUserBySession');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        name: UserInfo.name,
        user_uid: UserInfo.userUid
      })
    );
    return spy;
  }

  public bindUser() {
    const spy = jest.spyOn(OAuth2, 'BindOauth2User');
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
    const spy = jest.spyOn(OAuth2, 'GetOauth2Tips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: oauth2Tips
      })
    );
    return spy;
  }

  public getBasicInfo() {
    const spy = jest.spyOn(BasicInfo, 'GetBasicInfo');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: BasicInfoMockData
      })
    );
    return spy;
  }

  public getCompanyNotice() {
    const spy = jest.spyOn(CompanyNotice, 'GetCompanyNotice');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: CompanyNoticeMockData })
    );
    return spy;
  }

  public updateCompanyNotice() {
    const spy = jest.spyOn(CompanyNotice, 'UpdateCompanyNotice');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getListDBServiceDriverOption() {
    const spy = jest.spyOn(DBService, 'ListDBServiceDriverOption');
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
    const spy = jest.spyOn(DBService, 'ListDBServicesV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: DBServicesList.length,
        data: DBServicesList
      })
    );
    return spy;
  }

  public AddDBService() {
    const spy = jest.spyOn(DBService, 'AddDBServiceV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DelDBService() {
    const spy = jest.spyOn(DBService, 'DelDBService');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public UpdateDBService() {
    const spy = jest.spyOn(DBService, 'UpdateDBServiceV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public CheckDBServiceIsConnectable() {
    const spy = jest.spyOn(DBService, 'CheckDBServiceIsConnectableById');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getProjectList() {
    const spy = jest.spyOn(Project, 'ListProjects');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: mockProjectList.length,
        data: mockProjectList
      })
    );
    return spy;
  }

  public verifyUserLogin() {
    const spy = jest.spyOn(User, 'VerifyUserLogin');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockVerifyLoginData
      })
    );
    return spy;
  }
}

export default new MockDMSGlobalApi();
