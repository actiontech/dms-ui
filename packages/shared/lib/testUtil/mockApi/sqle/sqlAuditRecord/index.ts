import sql_audit_record from '../../../../api/sqle/service/sql_audit_record';
import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import {
  sqlAuditRecordMockData,
  sqlAuditRecordTagTipsMockData,
  createSqlAuditResponseMockData
} from './data';

class SqlAuditRecordMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getSQLAuditRecords();
    this.createSQLAuditRecord();
    this.getSQLAuditRecordTagTips();
    this.getSQLAuditRecord();
    this.updateSQLAuditRecord();
  }

  public getSQLAuditRecords() {
    const spy = jest.spyOn(sql_audit_record, 'getSQLAuditRecordsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: sqlAuditRecordMockData,
        total_nums: sqlAuditRecordMockData.length
      })
    );
    return spy;
  }

  public createSQLAuditRecord() {
    const spy = jest.spyOn(sql_audit_record, 'CreateSQLAuditRecordV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: createSqlAuditResponseMockData
      })
    );
    return spy;
  }

  public getSQLAuditRecordTagTips() {
    const spy = jest.spyOn(sql_audit_record, 'GetSQLAuditRecordTagTipsV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: sqlAuditRecordTagTipsMockData
      })
    );
    return spy;
  }

  public getSQLAuditRecord() {
    const spy = jest.spyOn(sql_audit_record, 'getSQLAuditRecordV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: sqlAuditRecordMockData[0] })
    );
    return spy;
  }

  public updateSQLAuditRecord() {
    const spy = jest.spyOn(sql_audit_record, 'updateSQLAuditRecordV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new SqlAuditRecordMockApi();
