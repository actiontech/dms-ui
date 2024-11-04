import { useNavigate, useLocation } from 'react-router-dom';
import QuickActions from '..';
import { act, fireEvent, cleanup } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';
import { ROUTE_PATHS } from '@actiontech/shared';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import system from '../../../../../testUtils/mockApi/system';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn()
  };
});

describe('base/Nav/QuickActions', () => {
  const navigateSpy = jest.fn();
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  let getSystemModuleRedDotsSpy: jest.SpyInstance;

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
    return superRender(<QuickActions />);
  };

  it('render quick action when current user is admin', async () => {
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: true
      }
    });
    const { baseElement } = customRender();

    expect(getAllBySelector('.action-item')[0]).toHaveClass(
      'action-item action-item-active'
    );
    expect(getSystemModuleRedDotsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.action-item-dot')).toBeInTheDocument();
  });

  it('render quick action when current user has global view permission', () => {
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalViewing]: true,
        [SystemRole.globalManager]: false
      }
    });
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render quick action when current user is not admin and has not global view permission', () => {
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalViewing]: false,
        [SystemRole.globalManager]: false
      }
    });
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(getAllBySelector('.action-item')).toHaveLength(2);
  });

  it('render navigate event', async () => {
    mockUsePermission(
      { checkPagePermission: jest.fn().mockReturnValue(true) },
      { useSpyOnMockHooks: true }
    );
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    const actions = getAllBySelector('.action-item');
    expect(actions).toHaveLength(3);

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
    expect(navigateSpy).toHaveBeenNthCalledWith(3, ROUTE_PATHS.SQLE.RULE);
  });
});
