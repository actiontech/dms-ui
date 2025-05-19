import audit_whitelist from '../../../../api/sqle/service/audit_whitelist';
import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import { auditWhiteListMockData } from './data';

class AuditWhiteList implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditWhitelist();
    this.deleteAuthWhitelist();
    this.addAuthWhitelist();
  }

  public getAuditWhitelist() {
    const spy = jest.spyOn(audit_whitelist, 'getAuditWhitelistV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: auditWhiteListMockData
      })
    );
    return spy;
  }

  public deleteAuthWhitelist() {
    const spy = jest.spyOn(audit_whitelist, 'deleteAuditWhitelistByIdV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public addAuthWhitelist() {
    const spy = jest.spyOn(audit_whitelist, 'createAuditWhitelistV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateAuthWhitelist() {
    const spy = jest.spyOn(audit_whitelist, 'UpdateAuditWhitelistByIdV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new AuditWhiteList();
