/**
 * @test_version ce
 */
import { superRender } from '../../testUtils/customRender';
import Overview from '.';
import { act, cleanup, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseSystemModuleStatus } from '@actiontech/shared/lib/testUtil/mockHook/mockUseSystemModuleStatus';

describe('page/ProjectOverview', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseSystemModuleStatus();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return superRender(<Overview />);
  };

  it('render over view when sql optimization is not supported', async () => {
    mockUseSystemModuleStatus({
      sqlOptimizationIsSupported: true
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('项目概览')).toBeInTheDocument();
  });
});
