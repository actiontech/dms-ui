import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import MockReportPushConfigService from '../../../../../testUtils/mockApi/reportPushConfigService';
import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ReportPushConfigListPushUserTypeEnum,
  ReportPushConfigListTriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import WorkflowUpdateNotifier from '..';
import { fireEvent, screen } from '@testing-library/dom';
import { act, cleanup } from '@testing-library/react';
import {
  mockProjectInfo,
  mockCurrentUserReturn
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('test WorkflowUpdateNotifier', () => {
  let updateReportPushConfigSpy: jest.SpyInstance;
  const refetchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(undefined, { mockSelector: true });
    updateReportPushConfigSpy =
      MockReportPushConfigService.UpdateReportPushConfig();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  const customRender = (
    config: IReportPushConfigList = {
      report_push_config_id: '1',
      type: 'workflow',
      enabled: true,
      trigger_type: ReportPushConfigListTriggerTypeEnum.immediately,
      push_frequency_cron: '',
      push_user_Type: ReportPushConfigListPushUserTypeEnum.permission_match,
      push_user_list: [],
      last_push_time: '0001-01-01T00:00:00Z'
    }
  ) => {
    return superRender(
      <WorkflowUpdateNotifier config={config} refetch={refetchSpy} />
    );
  };
  it('should render the component with the initial configuration correctly', () => {
    const { container } = customRender();

    expect(container).toMatchSnapshot();
  });

  it('should call the onSubmit function to submit changes when the confirmation popup is confirmed', async () => {
    customRender();

    fireEvent.click(screen.getByTestId('config-switch'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('当前操作将关闭配置，是否继续？')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));

    expect(updateReportPushConfigSpy).toHaveBeenCalledTimes(1);
    expect(updateReportPushConfigSpy).toHaveBeenCalledWith({
      enabled: false,
      project_name: mockProjectInfo.projectName,
      push_user_Type: 'permission_match',
      push_user_list: [],
      report_push_config_id: '1',
      trigger_type: 'immediately'
    });
    expect(screen.getByTestId('config-switch')).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(refetchSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('更新成功！')).toBeInTheDocument();

    cleanup();
    updateReportPushConfigSpy.mockClear();

    customRender({
      report_push_config_id: '1',
      type: 'workflow',
      enabled: false,
      trigger_type: ReportPushConfigListTriggerTypeEnum.immediately,
      push_frequency_cron: '',
      push_user_Type: ReportPushConfigListPushUserTypeEnum.permission_match,
      push_user_list: [],
      last_push_time: '0001-01-01T00:00:00Z'
    });

    fireEvent.click(screen.getByTestId('config-switch'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('当前操作将开启配置，是否继续？')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));

    expect(updateReportPushConfigSpy).toHaveBeenCalledTimes(1);
    expect(updateReportPushConfigSpy).toHaveBeenCalledWith({
      enabled: true,
      project_name: mockProjectInfo.projectName,
      push_user_Type: 'permission_match',
      push_user_list: [],
      report_push_config_id: '1',
      trigger_type: 'immediately'
    });
  });

  it('should disable the switch and hide the confirmation popup when the user lacks permission', () => {
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      }
    });
    const { container } = customRender({
      report_push_config_id: '1',
      type: 'workflow',
      enabled: false,
      trigger_type: ReportPushConfigListTriggerTypeEnum.immediately,
      push_frequency_cron: '',
      push_user_Type: ReportPushConfigListPushUserTypeEnum.permission_match,
      push_user_list: [],
      last_push_time: '0001-01-01T00:00:00Z'
    });

    expect(container).toMatchSnapshot();
    expect(screen.queryByTestId('config-switch')).not.toBeInTheDocument();
  });
});
