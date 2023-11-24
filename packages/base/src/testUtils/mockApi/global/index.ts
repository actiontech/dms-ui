import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  BasicInfo,
  CompanyNotice,
  GetUserPayload,
  oauth2Tips,
  UserInfo
} from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

class MockDMSGlobalApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getCurrentUser();
    this.addSession();
    this.getUserBySession();
    this.bindUser();
    this.getOauth2Tips();
    this.getBasicInfo();
    this.getCompanyNotice();
    this.updateCompanyNotice();
  }

  public getCurrentUser() {
    const spy = jest.spyOn(dms, 'GetUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        user: GetUserPayload
      })
    );
    return spy;
  }

  public addSession() {
    const spy = jest.spyOn(dms, 'AddSession');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        token: UserInfo.token,
        user_uid: UserInfo.userUid
      })
    );
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
}

export default new MockDMSGlobalApi();
