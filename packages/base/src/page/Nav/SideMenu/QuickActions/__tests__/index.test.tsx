import { useNavigate, useLocation } from 'react-router-dom';
import QuickActions from '..';
import { act, fireEvent, cleanup } from '@testing-library/react';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import {
  getAllBySelector,
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { SystemRole } from '@actiontech/dms-kit';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('base/Nav/QuickActions', () => {
  const navigateSpy = jest.fn();
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  let getSystemModuleRedDotsSpy: jest.SpyInstance;
  const mockSetSystemModuleRedDotsLoading = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    useLocationMock.mockReturnValue({
      pathname: ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD
    });
    getSystemModuleRedDotsSpy = system.getSystemModuleRedDots();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return baseSuperRender(
      <QuickActions
        setSystemModuleRedDotsLoading={mockSetSystemModuleRedDotsLoading}
      />
    );
  };

  it('render quick action when current user is admin', async () => {
    mockUsePermission(
      {
        moduleFeatureSupport: {
          sqlOptimization: true,
          knowledge: true
        }
      },
      {
        mockCurrentUser: true,
        mockUseCurrentUserData: {
          userRoles: {
            ...mockCurrentUserReturn.userRoles,
            [SystemRole.admin]: true
          }
        },
        mockSelector: true
      }
    );
    const { baseElement } = customRender();

    expect(getAllBySelector('.action-item')[0]).toHaveClass(
      'action-item action-item-active'
    );
    expect(getSystemModuleRedDotsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.action-item-dot')).toBeInTheDocument();
    expect(getBySelector('.report-statistics')).toBeInTheDocument();
    expect(mockSetSystemModuleRedDotsLoading).toHaveBeenCalledTimes(2);
  });

  it('render quick action when current user has global view permission', () => {
    mockUsePermission(
      {
        moduleFeatureSupport: {
          sqlOptimization: true,
          knowledge: true
        }
      },
      {
        mockCurrentUser: true,
        mockUseCurrentUserData: {
          userRoles: {
            ...mockCurrentUserReturn.userRoles,
            [SystemRole.admin]: false,
            [SystemRole.auditAdministrator]: true,
            [SystemRole.systemAdministrator]: false
          }
        },
        mockSelector: true
      }
    );

    customRender();
    expect(getBySelector('.report-statistics')).toBeInTheDocument();
  });

  it('render quick action when current user is not admin and has not global view permission', () => {
    mockUsePermission(
      {
        moduleFeatureSupport: {
          sqlOptimization: true,
          knowledge: true
        }
      },
      {
        mockCurrentUser: true,
        mockUseCurrentUserData: {
          userRoles: {
            ...mockCurrentUserReturn.userRoles,
            [SystemRole.admin]: false,
            [SystemRole.auditAdministrator]: false,
            [SystemRole.systemAdministrator]: false
          }
        },
        mockSelector: true
      }
    );
    customRender();
    expect(queryBySelector('.report-statistics')).not.toBeInTheDocument();
  });

  it('hide knowledge quick action when moduleFeatureSupport return false', () => {
    mockUsePermission(
      {
        moduleFeatureSupport: {
          sqlOptimization: true,
          knowledge: false
        }
      },
      {
        mockSelector: true,
        mockCurrentUser: true
      }
    );
    customRender();
    expect(queryBySelector('.knowledge')).not.toBeInTheDocument();
  });

  it('render navigate event', async () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    const actions = getAllBySelector('.action-item');
    expect(actions).toHaveLength(4);

    fireEvent.click(actions[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      1,
      ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD
    );

    fireEvent.click(actions[1]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      2,
      ROUTE_PATHS.SQLE.REPORT_STATISTICS
    );

    fireEvent.click(actions[2]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(3);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      3,
      ROUTE_PATHS.SQLE.RULE.index.path
    );

    fireEvent.click(actions[3]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(4);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      4,
      ROUTE_PATHS.SQLE.KNOWLEDGE.index.path
    );
  });

  it('activation effect should matching sub routes', () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
    useLocationMock.mockReturnValue({
      pathname: ROUTE_PATHS.SQLE.KNOWLEDGE.index.path
    });
    customRender();
    expect(getAllBySelector('.action-item')[3]).toHaveClass(
      'action-item-active'
    );

    cleanup();
    useLocationMock.mockReturnValue({
      pathname: `${ROUTE_PATHS.SQLE.KNOWLEDGE.index.path}/${ROUTE_PATHS.SQLE.KNOWLEDGE.refined.path}`
    });
    customRender();
    expect(getAllBySelector('.action-item')[3]).toHaveClass(
      'action-item-active'
    );
  });
});
