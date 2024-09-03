/**
 * @test_version ce
 */

import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import PushRuleConfiguration from '.';
import { superRender } from '../../testUtils/customRender';
import MockReportPushConfigService from '../../testUtils/mockApi/reportPushConfigService';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { act } from '@testing-library/react';

describe('test PushRuleConfiguration/ce', () => {
  let mockGetReportPushConfigList: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockGetReportPushConfigList =
      MockReportPushConfigService.GetReportPushConfigList();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
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
