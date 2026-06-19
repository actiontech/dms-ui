import audit_whitelist from '../../../../api/sqle/service/audit_whitelist';
import { MockSpyApy, createSpySuccessResponse } from '../../index';
import { auditWhiteListMockData, sqlRuleExceptionMockData } from './data';

class AuditWhiteList implements MockSpyApy {
  public mockAllApi(): void {
    this.getAuditWhitelist();
    this.deleteAuthWhitelist();
    this.addAuthWhitelist();
    this.getSQLRuleException();
    this.deleteSQLRuleException();
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

  public getSQLRuleException() {
    const spy = jest.spyOn(audit_whitelist, 'getSQLRuleExceptionV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: sqlRuleExceptionMockData
      })
    );
    return spy;
  }

  public deleteSQLRuleException() {
    const spy = jest.spyOn(audit_whitelist, 'deleteSQLRuleExceptionV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new AuditWhiteList();
