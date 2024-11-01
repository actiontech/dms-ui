import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import ConfDetailOverview from '..';
import { superRender } from '../../../../../testUtils/customRender';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from '../../index.data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import instanceAuditPlan from '../../../../../testUtils/mockApi/instanceAuditPlan';
import { act, fireEvent } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockInstanceAuditPlanInfo } from '../../../../../testUtils/mockApi/instanceAuditPlan/data';
import {
  InstanceAuditPlanInfoActiveStatusEnum,
  UpdateAuditPlanStatusReqV1ActiveEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test Overview', () => {
  const handleChangeTabSpy = jest.fn();
  const instanceAuditPlanId = '1';
  const refreshAuditPlanDetailSpy = jest.fn();
  const customRender = (hasOpPermission = true) => {
    return superRender(
      <ConfDetailOverview
        activeTabKey={SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY}
        handleChangeTab={handleChangeTabSpy}
        instanceAuditPlanId={instanceAuditPlanId}
        refreshAuditPlanDetail={refreshAuditPlanDetailSpy}
        hasOpPermission={hasOpPermission}
      />
    );
  };
  let getInstanceAuditPlanOverviewSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    getInstanceAuditPlanOverviewSpy =
      instanceAuditPlan.getInstanceAuditPlanOverview();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should request data for the table when the component is active', async () => {
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceAuditPlanOverviewSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceAuditPlanOverviewSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId
    });
  });

  it('should enable, disable, and delete actions with correct API calls and refresh the table', async () => {
    const updateAuditPlanStatusSpy = instanceAuditPlan.updateAuditPlanStatus();
    const deleteAuditPlanByTypeSpy = instanceAuditPlan.deleteAuditPlanByType();
    const { getAllByText, findByText, getByText } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getAllByText('停 用').length).toBe(
      mockInstanceAuditPlanInfo.filter(
        (v) => v.active_status === InstanceAuditPlanInfoActiveStatusEnum.normal
      ).length
    );
    expect(getAllByText('启 用').length).toBe(
      mockInstanceAuditPlanInfo.filter(
        (v) =>
          v.active_status === InstanceAuditPlanInfoActiveStatusEnum.disabled
      ).length
    );
    expect(getAllByText('删 除').length).toBe(mockInstanceAuditPlanInfo.length);

    // disabled
    fireEvent.click(getAllByText('停 用')[0]);
    await findByText(
      '停用后，将不再扫描该类型的SQL，当前数据会被保留，是否确认停用？'
    );
    fireEvent.click(getByText('确 认'));

    expect(updateAuditPlanStatusSpy).toHaveBeenCalledTimes(1);
    expect(updateAuditPlanStatusSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id: mockInstanceAuditPlanInfo
        .find(
          (v) =>
            v.active_status === InstanceAuditPlanInfoActiveStatusEnum.normal
        )
        ?.audit_plan_type?.audit_plan_id?.toString(),
      active: UpdateAuditPlanStatusReqV1ActiveEnum.disabled
    });
    expect(getAllByText('停 用')[0].closest('button')).toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllByText('停 用')[0].closest('button')).not.toBeDisabled();
    expect(getByText('停用成功！')).toBeInTheDocument();
    expect(getInstanceAuditPlanOverviewSpy).toHaveBeenCalledTimes(2);

    // enabled
    fireEvent.click(getAllByText('启 用')[0]);
    expect(updateAuditPlanStatusSpy).toHaveBeenCalledTimes(2);
    expect(updateAuditPlanStatusSpy).toHaveBeenNthCalledWith(2, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id: mockInstanceAuditPlanInfo
        .find(
          (v) =>
            v.active_status === InstanceAuditPlanInfoActiveStatusEnum.disabled
        )
        ?.audit_plan_type?.audit_plan_id?.toString(),
      active: UpdateAuditPlanStatusReqV1ActiveEnum.normal
    });

    expect(getAllByText('启 用')[0].closest('button')).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllByText('启 用')[0].closest('button')).not.toBeDisabled();
    expect(getByText('启用成功！')).toBeInTheDocument();
    expect(getInstanceAuditPlanOverviewSpy).toHaveBeenCalledTimes(3);

    //delete
    fireEvent.click(getAllByText('删 除')[0]);
    await findByText('删除后该类型智能扫描数据将不再被保留，是否确认删除？');
    fireEvent.click(getAllByText('确 认')[1]);
    expect(deleteAuditPlanByTypeSpy).toHaveBeenCalledTimes(1);
    expect(deleteAuditPlanByTypeSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id:
        mockInstanceAuditPlanInfo[0].audit_plan_type?.audit_plan_id?.toString()
    });

    expect(getAllByText('删 除')[0].closest('button')).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllByText('删 除')[0].closest('button')).not.toBeDisabled();
    expect(getByText('删除成功！')).toBeInTheDocument();
    expect(getInstanceAuditPlanOverviewSpy).toHaveBeenCalledTimes(4);
    expect(refreshAuditPlanDetailSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle row click events to change the active tab', async () => {
    const { getByText } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(
      getByText(mockInstanceAuditPlanInfo[0].audit_plan_type?.desc!)
    );

    expect(handleChangeTabSpy).toHaveBeenCalledTimes(1);
    expect(handleChangeTabSpy).toHaveBeenNthCalledWith(
      1,
      mockInstanceAuditPlanInfo[0].audit_plan_type?.audit_plan_id?.toString()
    );
  });

  it('should match snapshot when hasOpPermission is equal false', () => {
    const { container } = customRender(false);
    expect(container).toMatchSnapshot();
  });
});
