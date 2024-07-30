import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { mockInstanceAuditPlanListData, mockAuditPlanTypesData } from './data';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';

class MockInstanceAuditPlanApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getInstanceAuditPlans();
    this.getAuditPlanTypes();
    this.updateInstanceAuditPlanStatus();
    this.deleteInstanceAuditPlan();
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
}

export default new MockInstanceAuditPlanApi();