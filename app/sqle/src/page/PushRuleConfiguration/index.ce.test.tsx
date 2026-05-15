/**
 * @test_version ce
 */

import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import PushRuleConfiguration from '.';
import { sqleSuperRender } from '../../testUtils/superRender';
import MockReportPushConfigService from '@actiontech/shared/lib/testUtil/mockApi/sqle/reportPushConfigService';
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

describe('test PushRuleConfiguration/ce', () => {
  let mockGetReportPushConfigList: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
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
  });
  it('should match snapshot', async () => {
    const { container } = sqleSuperRender(<PushRuleConfiguration />);
    expect(mockGetReportPushConfigList).toHaveBeenCalledTimes(1);
    expect(mockGetReportPushConfigList).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
