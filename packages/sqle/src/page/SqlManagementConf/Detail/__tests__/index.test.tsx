import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import instanceAuditPlan from '../../../../testUtils/mockApi/instanceAuditPlan';
import { superRender } from '../../../../testUtils/customRender';
import ConfDetail from '..';
import { act, cleanup, fireEvent } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockProjectInfo,
  mockUseUserOperationPermissionData
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockAuditPlanDetailData } from '../../../../testUtils/mockApi/instanceAuditPlan/data';
import { createSpyErrorResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('test SqlManagementConf/Detail/index.tsx', () => {
  const mockUseSearchParams = useSearchParams as jest.Mock;
  const mockUseLocation = useLocation as jest.Mock;
  const mockUseNavigate = useNavigate as jest.Mock;
  const mockUseParams = useParams as jest.Mock;
  const navigateSpy = jest.fn();
  const instanceAuditPlanId = '1';
  const pathname = '/sql-management-conf/1';
  let getInstanceAuditPlanDetailSpy: jest.SpyInstance;
  let auditPlanTriggerSqlAuditSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    instanceAuditPlan.mockAllApi();
    getInstanceAuditPlanDetailSpy =
      instanceAuditPlan.getInstanceAuditPlanDetail();
    auditPlanTriggerSqlAuditSpy = instanceAuditPlan.auditPlanTriggerSqlAudit();
    mockUseLocation.mockReturnValue({
      pathname
    });
    mockUseParams.mockReturnValue({ id: instanceAuditPlanId });
    mockUseNavigate.mockReturnValue(navigateSpy);
    mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
    mockUsePermission(undefined, { mockSelector: true });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });
  it('should match snapshot', async () => {
    const { container } = superRender(<ConfDetail />);
    expect(container).toMatchSnapshot();
    expect(getInstanceAuditPlanDetailSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceAuditPlanDetailSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should render extra action buttons in the page header', async () => {
    mockUsePermission(
      { checkActionPermission: jest.fn(() => true) },
      { useSpyOnMockHooks: true }
    );
    const getInstanceAuditPlanSQLExportSpy =
      instanceAuditPlan.getInstanceAuditPlanSQLExport();
    const { getByText, queryByText, getAllByText } = superRender(
      <ConfDetail />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(queryByText('导出')).not.toBeInTheDocument();
    expect(queryByText('立即审核')).not.toBeInTheDocument();
    fireEvent.click(getAllByText('自定义')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(queryByText('导 出')).toBeInTheDocument();
    expect(queryByText('立即审核')).toBeInTheDocument();

    fireEvent.click(getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getInstanceAuditPlanSQLExportSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceAuditPlanSQLExportSpy).toHaveBeenNthCalledWith(
      1,
      {
        project_name: mockProjectInfo.projectName,
        instance_audit_plan_id: instanceAuditPlanId,
        audit_plan_id:
          mockAuditPlanDetailData?.audit_plans?.[0]?.audit_plan_type?.audit_plan_id?.toString(),
        filter_list: []
      },
      { responseType: 'blob' }
    );
    expect(getByText('导 出').closest('button')).toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getByText('导 出').closest('button')).not.toBeDisabled();

    fireEvent.click(getByText('立即审核'));
    expect(auditPlanTriggerSqlAuditSpy).toHaveBeenCalledTimes(1);
    expect(auditPlanTriggerSqlAuditSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: instanceAuditPlanId ?? '',
      audit_plan_id:
        mockAuditPlanDetailData?.audit_plans?.[0]?.audit_plan_type?.audit_plan_id?.toString()
    });

    expect(getByText('立即审核').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getByText('立即审核').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
  });

  it('should display error message when data request fails', async () => {
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
    const originOutputError = console.error;
    // 过滤 react-hooks 的 console error 输出
    console.error = () => {
      return;
    };
    getInstanceAuditPlanDetailSpy.mockImplementation(() =>
      createSpyErrorResponse({})
    );
    const { container, getByText } = superRender(<ConfDetail />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(getByText('error')).toBeInTheDocument();
    console.error = originOutputError;
  });

  it('should render the segmented tabs with correct items and active key', async () => {
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams({
        active_audit_plan_id: '9'
      })
    ]);
    const { getAllByText, getByText } = superRender(<ConfDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getAllByText('自定义')[0].parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );

    fireEvent.click(getByText('概览'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(1, pathname, { replace: true });

    fireEvent.click(getAllByText('自定义')[0]);
    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      2,
      { pathname, search: `active_audit_plan_id=9` },
      { replace: true }
    );
  });

  it('should trigger refresh event for the correct component when refresh button is clicked', async () => {
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const { getAllByText } = superRender(<ConfDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.custom-icon-refresh'));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenNthCalledWith(
      1,
      EmitterKey.Refresh_Sql_Management_Conf_Overview_List
    );

    fireEvent.click(getAllByText('自定义')[0]);

    fireEvent.click(getBySelector('.custom-icon-refresh'));
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenNthCalledWith(
      2,
      EmitterKey.Refresh_Sql_Management_Conf_Detail_Sql_List
    );
  });
});
