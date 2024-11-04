import MockDate from 'mockdate';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import PushRuleConfiguration from '.';
import { superRender } from '../../testUtils/customRender';
import MockReportPushConfigService from '../../testUtils/mockApi/reportPushConfigService';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { act } from '@testing-library/react';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('test PushRuleConfiguration', () => {
  let mockGetReportPushConfigList: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2024-12-12:12:00:00');
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(undefined, { mockSelector: true });
    mockGetReportPushConfigList =
      MockReportPushConfigService.GetReportPushConfigList();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    MockDate.reset();
  });
  it('should match snapshot', async () => {
    const { container } = superRender(<PushRuleConfiguration />);
    expect(mockGetReportPushConfigList).toHaveBeenCalledTimes(1);
    expect(mockGetReportPushConfigList).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
