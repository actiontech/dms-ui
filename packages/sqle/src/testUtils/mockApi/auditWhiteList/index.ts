import AuditWhitelistService from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { auditWhiteListMockData } from './data';

class AuditWhiteList implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditWhitelist();
    this.getAuditWhitelistById();
    this.deleteAuthWhitelist();
    this.addAuthWhitelist();
  }

  public getAuditWhitelistById() {
    const spy = jest.spyOn(AuditWhitelistService, 'getAuditWhitelistByIDV1');
    spy.mockImplementation((params) => {
      const record = auditWhiteListMockData.find(
        (item) => `${item.audit_whitelist_id}` === params.audit_whitelist_id
      );
      return createSpySuccessResponse({
        data: record
      });
    });
    return spy;
  }

  public getAuditWhitelist() {
    const spy = jest.spyOn(AuditWhitelistService, 'getAuditWhitelistV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: auditWhiteListMockData
      })
    );
    return spy;
  }

  public deleteAuthWhitelist() {
    const spy = jest.spyOn(AuditWhitelistService, 'deleteAuditWhitelistByIdV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public addAuthWhitelist() {
    const spy = jest.spyOn(AuditWhitelistService, 'createAuditWhitelistV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateAuthWhitelist() {
    const spy = jest.spyOn(AuditWhitelistService, 'UpdateAuditWhitelistByIdV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new AuditWhiteList();
