import { act, cleanup, screen } from '@testing-library/react';
import SqlOptimization from '.';
import { sqleSuperRender } from '../../testUtils/superRender';
import {
  sqleMockApi,
  mockUseCurrentProject,
  mockUseCurrentUser,
  mockUseDbServiceDriver,
  mockUsePermission
} from '@actiontech/shared/lib/testUtil';

describe('sqle/SqlOptimization', () => {
  let getOptimizationRecordsSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;

  beforeEach(() => {
    getOptimizationRecordsSpy =
      sqleMockApi.sqlOptimization.getOptimizationRecords();
    getInstanceTipListSpy = sqleMockApi.instance.getInstanceTipList();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    jest.useFakeTimers();
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      {
        useSpyOnMockHooks: true
      }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render enterprise feature display with proper feature name', async () => {
    const { baseElement } = sqleSuperRender(<SqlOptimization />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByRole('table')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
  });

  it('should render no configuration tips when user has no permission', async () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(false)
      },
      {
        useSpyOnMockHooks: true
      }
    );

    const { baseElement } = sqleSuperRender(<SqlOptimization />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText(
        'SQL调优功能可以帮助您自动优化SQL性能。该功能为付费增值模块，请联系商务获取详细信息。'
      )
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
