import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import MockDate from 'mockdate';
import user from '@actiontech/shared/lib/testUtil/mockApi/sqle/user';
import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import SqlManagementIssuePush from '..';
import {
  mockProjectInfo,
  mockCurrentUserReturn
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  ReportPushConfigListPushUserTypeEnum,
  ReportPushConfigListTriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import MockReportPushConfigService from '@actiontech/shared/lib/testUtil/mockApi/sqle/reportPushConfigService';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('test SqlManagementIssuePush', () => {
  let getUserTipListSpy: jest.SpyInstance;
  let updateReportPushConfigSpy: jest.SpyInstance;
  const refetchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2024-12-12:12:00:00');
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(undefined, { mockSelector: true });
    getUserTipListSpy = user.getUserTipList();
    updateReportPushConfigSpy =
      MockReportPushConfigService.UpdateReportPushConfig();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  const customRender = (
    config: IReportPushConfigList = {
      report_push_config_id: '2',
      type: 'sql_manage',
      enabled: true,
      trigger_type: ReportPushConfigListTriggerTypeEnum.timing,
      push_frequency_cron: '1 * * * *',
      push_user_Type: ReportPushConfigListPushUserTypeEnum.fixed,
      push_user_list: ['1739544663515205632', '1739544663515205633'],
      last_push_time: '0001-01-01T00:00:00Z'
    },
    permission = true
  ) => {
    return sqleSuperRender(
      <SqlManagementIssuePush config={config} refetch={refetchSpy} />
    );
  };
  it('should render the component and display initial configuration correctly', async () => {
    const { container } = customRender();
    expect(getUserTipListSpy).toHaveBeenCalledTimes(1);
    expect(getUserTipListSpy).toHaveBeenCalledWith({
      filter_project: mockProjectInfo.projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should call onSubmit function correctly when enabling/disabling the configuration switch', async () => {
    const { baseElement } = customRender(
      {
        report_push_config_id: '2',
        type: 'sql_manage',
        enabled: false,
        trigger_type: ReportPushConfigListTriggerTypeEnum.timing,
        push_frequency_cron: '1 * * * *',
        push_user_Type: ReportPushConfigListPushUserTypeEnum.fixed,
        push_user_list: ['1739544663515205632', '1739544663515205633'],
        last_push_time: '0001-01-01T00:00:00Z'
      },
      true
    );

    expect(getBySelector('.config-field-wrapper', baseElement)).toHaveAttribute(
      'hidden'
    );

    fireEvent.click(getBySelector('.system-config-switch'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      getBySelector('.config-field-wrapper', baseElement)
    ).not.toHaveAttribute('hidden');

    fireEvent.change(
      getBySelector('input[placeholder="请输入时间"]', baseElement),
      { target: { value: '* 1 * 2 *' } }
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateReportPushConfigSpy).toHaveBeenCalledTimes(1);
    expect(updateReportPushConfigSpy).toHaveBeenCalledWith({
      enabled: true,
      project_name: mockProjectInfo.projectName,
      push_frequency_cron: '* 1 * 2 *',
      push_user_Type: 'fixed',
      push_user_list: ['1739544663515205632', '1739544663515205633'],
      report_push_config_id: '2',
      trigger_type: 'timing'
    });
    expect(
      getBySelector('input[placeholder="请输入时间"]', baseElement)
    ).toBeDisabled();
    expect(
      getBySelector('.ant-select-selection-search-input', baseElement)
    ).toBeDisabled();

    expect(refetchSpy).toHaveBeenCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(refetchSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should set the form to edit state and fill in default values when the modify button is clicked', async () => {
    const { baseElement } = customRender(
      {
        report_push_config_id: '2',
        type: 'sql_manage',
        enabled: false,
        trigger_type: ReportPushConfigListTriggerTypeEnum.timing,
        push_frequency_cron: '1 * 2 * *',
        push_user_Type: ReportPushConfigListPushUserTypeEnum.fixed,
        push_user_list: ['1739544663515205632', '1739544663515205633'],
        last_push_time: '0001-01-01T00:00:00Z'
      },
      true
    );

    fireEvent.click(getBySelector('.system-config-switch'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
  });

  it('should restore the form to its initial state when the cancel button is clicked', async () => {
    const { baseElement } = customRender(
      {
        report_push_config_id: '2',
        type: 'sql_manage',
        enabled: false,
        trigger_type: ReportPushConfigListTriggerTypeEnum.timing,
        push_frequency_cron: '1 * * * *',
        push_user_Type: ReportPushConfigListPushUserTypeEnum.fixed,
        push_user_list: ['1739544663515205632', '1739544663515205633'],
        last_push_time: '0001-01-01T00:00:00Z'
      },
      true
    );

    fireEvent.click(getBySelector('.system-config-switch'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('.system-config-switch'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText(
        '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));

    fireEvent.click(getBySelector('.system-config-switch'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.change(
      getBySelector('input[placeholder="请输入时间"]', baseElement),
      { target: { value: '* 1 * 2 *' } }
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getAllByText('取 消')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      getBySelector('input[placeholder="请输入时间"]', baseElement)
    ).toHaveValue('1 * * * *');
  });

  it('should hide the configuration switch and modify button when the user does not have permission', async () => {
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      }
    });
    const { baseElement } = customRender({
      report_push_config_id: '2',
      type: 'sql_manage',
      enabled: false,
      trigger_type: ReportPushConfigListTriggerTypeEnum.timing,
      push_frequency_cron: '1 * * * *',
      push_user_Type: ReportPushConfigListPushUserTypeEnum.fixed,
      push_user_list: ['1739544663515205632', '1739544663515205633'],
      last_push_time: '0001-01-01T00:00:00Z'
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      queryBySelector('.system-config-switch', baseElement)
    ).not.toBeInTheDocument();
  });

  it('should display/hide configuration details correctly when the configuration switch state changes', async () => {
    customRender({
      report_push_config_id: '2',
      type: 'sql_manage',
      enabled: true,
      trigger_type: ReportPushConfigListTriggerTypeEnum.timing,
      push_frequency_cron: '1 * * * *',
      push_user_Type: ReportPushConfigListPushUserTypeEnum.fixed,
      push_user_list: ['1739544663515205632', '1739544663515205633'],
      last_push_time: '0001-01-01T00:00:00Z'
    });

    fireEvent.click(getBySelector('.system-config-switch'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));

    expect(updateReportPushConfigSpy).toHaveBeenCalledTimes(1);
    expect(updateReportPushConfigSpy).toHaveBeenCalledWith({
      enabled: false,
      project_name: mockProjectInfo.projectName,
      push_frequency_cron: '1 * * * *',
      push_user_Type: 'fixed',
      push_user_list: ['1739544663515205632', '1739544663515205633'],
      report_push_config_id: '2',
      trigger_type: 'timing'
    });
  });
});
