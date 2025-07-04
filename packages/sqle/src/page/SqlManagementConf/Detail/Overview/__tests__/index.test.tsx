import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import ConfDetailOverview from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from '../../index.data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import instanceAuditPlan from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan';
import { act, fireEvent, screen } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockInstanceAuditPlanInfo } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan/data';
import {
  InstanceAuditPlanInfoActiveStatusEnum,
  UpdateAuditPlanStatusReqV1ActiveEnum,
  InstanceAuditPlanInfoLastCollectionStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('test Overview', () => {
  const handleChangeTabSpy = jest.fn();
  const instanceAuditPlanId = '1';
  const refreshAuditPlanDetailSpy = jest.fn();
  const customRender = () => {
    return sqleSuperRender(
      <ConfDetailOverview
        activeTabKey={SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY}
        handleChangeTab={handleChangeTabSpy}
        instanceAuditPlanId={instanceAuditPlanId}
        refreshAuditPlanDetail={refreshAuditPlanDetailSpy}
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
    mockUsePermission(undefined, {
      mockSelector: true
    });
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
    expect(
      getAllByText('停 用')[
        mockInstanceAuditPlanInfo.findIndex(
          (v) =>
            v.active_status === InstanceAuditPlanInfoActiveStatusEnum.disabled
        )
      ].closest('button')
    ).toBeDisabled();

    expect(
      getAllByText('启 用')[
        mockInstanceAuditPlanInfo.findIndex(
          (v) =>
            v.active_status === InstanceAuditPlanInfoActiveStatusEnum.normal
        )
      ].closest('button')
    ).toBeDisabled();

    const moreButtonTrigger = getAllBySelector(
      '.actiontech-table-actions-more-button'
    );
    expect(moreButtonTrigger.length).toBe(mockInstanceAuditPlanInfo.length);

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
    fireEvent.click(getAllByText('启 用')[1]);
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

    expect(getAllByText('启 用')[1].closest('button')).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllByText('启 用')[1].closest('button')).not.toBeDisabled();
    expect(getByText('启用成功！')).toBeInTheDocument();
    expect(getInstanceAuditPlanOverviewSpy).toHaveBeenCalledTimes(3);

    //delete
    fireEvent.click(moreButtonTrigger[0]);
    fireEvent.click(getAllByText('删除')[0]);
    await findByText('删除后该类型智能扫描数据将不再被保留，是否确认删除？');
    fireEvent.click(getByText('确 定'));
    expect(deleteAuditPlanByTypeSpy).toHaveBeenCalledTimes(1);
    expect(deleteAuditPlanByTypeSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id:
        mockInstanceAuditPlanInfo[0].audit_plan_type?.audit_plan_id?.toString()
    });

    await act(async () => jest.advanceTimersByTime(3000));
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
    const { container } = customRender();
    expect(container).toMatchSnapshot();
  });

  it('render abnormal status audit plan', async () => {
    getInstanceAuditPlanOverviewSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...mockInstanceAuditPlanInfo[0],
            active_status: InstanceAuditPlanInfoActiveStatusEnum.normal,
            last_collection_status:
              InstanceAuditPlanInfoLastCollectionStatusEnum.abnormal
          },
          {
            ...mockInstanceAuditPlanInfo[1],
            active_status: undefined
          }
        ]
      })
    );
    const { container } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(screen.getByText('运行异常')).toBeInTheDocument();
  });

  it('reset token', async () => {
    getInstanceAuditPlanOverviewSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [{ ...mockInstanceAuditPlanInfo[0], exec_cmd: 'test' }]
      })
    );
    const { getAllByText, findByText, getByText } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const moreButtonTrigger = getAllBySelector(
      '.actiontech-table-actions-more-button'
    );
    const refreshAuditPlanTokenSpy = instanceAuditPlan.refreshAuditPlanToken();
    fireEvent.click(moreButtonTrigger[0]);
    fireEvent.click(getAllByText('重置Token')[0]);
    await findByText(
      '重置后将生成新的Token，有效期365天。旧Token将立即失效，是否继续？'
    );
    fireEvent.click(getByText('确 定'));
    expect(refreshAuditPlanTokenSpy).toHaveBeenCalledTimes(1);
    expect(refreshAuditPlanTokenSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      expires_in_days: 365
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getByText('重置Token成功！')).toBeInTheDocument();
    expect(getInstanceAuditPlanOverviewSpy).toHaveBeenCalledTimes(2);
  });
});
