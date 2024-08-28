import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import {
  mockInstanceAuditPlanListData,
  mockAuditPlanTypesData,
  mockAuditPlanMetaData,
  mockAuditPlanDetailData,
  mockInstanceAuditPlanInfo,
  mockAuditPlanSQLMeta,
  mockAuditPlanSQLData
} from './data';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';

class MockInstanceAuditPlanApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getInstanceAuditPlans();
    this.getAuditPlanTypes();
    this.updateInstanceAuditPlanStatus();
    this.deleteInstanceAuditPlan();
    this.createInstanceAuditPlan();
    this.getAuditPlanMeta();
    this.getInstanceAuditPlanDetail();
    this.updateInstanceAuditPlan();
    this.getInstanceAuditPlanOverview();
    this.getInstanceAuditPlanSQLMeta();
    this.getInstanceAuditPlanSQLData();
    this.getInstanceAuditPlanSQLExport();
    this.deleteAuditPlanByType();
    this.updateAuditPlanStatus();
    this.auditPlanTriggerSqlAudit();
  }

  public getInstanceAuditPlans() {
    const spy = jest.spyOn(instance_audit_plan, 'getInstanceAuditPlansV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockInstanceAuditPlanListData,
        total_nums: mockInstanceAuditPlanListData.length
      })
    );
    return spy;
  }

  public updateInstanceAuditPlanStatus() {
    const spy = jest.spyOn(
      instance_audit_plan,
      'updateInstanceAuditPlanStatusV1'
    );
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteInstanceAuditPlan() {
    const spy = jest.spyOn(instance_audit_plan, 'deleteInstanceAuditPlanV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getAuditPlanTypes() {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanTypesV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockAuditPlanTypesData
      })
    );
    return spy;
  }

  public createInstanceAuditPlan() {
    const spy = jest.spyOn(instance_audit_plan, 'createInstanceAuditPlanV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getAuditPlanMeta() {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanMetasV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockAuditPlanMetaData
      })
    );
    return spy;
  }

  public getInstanceAuditPlanDetail() {
    const spy = jest.spyOn(instance_audit_plan, 'getInstanceAuditPlanDetailV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockAuditPlanDetailData
      })
    );
    return spy;
  }

  public updateInstanceAuditPlan() {
    const spy = jest.spyOn(instance_audit_plan, 'updateInstanceAuditPlanV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getInstanceAuditPlanOverview() {
    const spy = jest.spyOn(
      instance_audit_plan,
      'getInstanceAuditPlanOverviewV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockInstanceAuditPlanInfo
      })
    );
    return spy;
  }

  public getInstanceAuditPlanSQLMeta() {
    const spy = jest.spyOn(
      instance_audit_plan,
      'getInstanceAuditPlanSQLMetaV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockAuditPlanSQLMeta
      })
    );
    return spy;
  }

  public getInstanceAuditPlanSQLData() {
    const spy = jest.spyOn(
      instance_audit_plan,
      'getInstanceAuditPlanSQLDataV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockAuditPlanSQLData,
        total_nums: mockAuditPlanSQLData.rows?.length
      })
    );
    return spy;
  }

  public getInstanceAuditPlanSQLExport() {
    const spy = jest.spyOn(
      instance_audit_plan,
      'getInstanceAuditPlanSQLExportV1'
    );
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateAuditPlanStatus() {
    const spy = jest.spyOn(instance_audit_plan, 'updateAuditPlanStatusV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteAuditPlanByType() {
    const spy = jest.spyOn(instance_audit_plan, 'deleteAuditPlanByTypeV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public auditPlanTriggerSqlAudit() {
    const spy = jest.spyOn(instance_audit_plan, 'auditPlanTriggerSqlAuditV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockInstanceAuditPlanApi();
