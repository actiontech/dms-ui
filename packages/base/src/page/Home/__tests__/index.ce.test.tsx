/**
 * @test_version ce
 */

import { cleanup, screen } from '@testing-library/react';
import {
  mockUseCurrentUser,
  mockUsePermission,
  sqleMockApi
} from '@actiontech/shared/lib/testUtil';
import Home from '..';
import { baseSuperRender } from '../../../testUtils/superRender';

describe('test base/page/Home', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    mockUsePermission(
      { checkActionPermission: jest.fn().mockReturnValue(true) },
      { useSpyOnMockHooks: true }
    );
    sqleMockApi.globalDashboard.getGlobalWorkflowStatistics();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('should match snapshot', () => {
    const { baseElement } = baseSuperRender(<Home />);

    expect(baseElement).toMatchSnapshot();

    expect(screen.queryByText('新建同步任务')).not.toBeInTheDocument();
  });
});
