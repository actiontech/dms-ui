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

  const customRender = (isAdmin = true, hasGlobalViewingPermission = true) => {
    return superRender(
      <QuickActions
        isAdmin={isAdmin}
        hasGlobalViewingPermission={hasGlobalViewingPermission}
      />
    );
  };

  it('render quick action when current user is admin', async () => {
    const { baseElement } = customRender(true, false);

    expect(getAllBySelector('.action-item')[0]).toHaveClass(
      'action-item action-item-active'
    );
    expect(getSystemModuleRedDotsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.action-item-dot')).toBeInTheDocument();
  });

  it('render quick action when current user has global view permission', () => {
    const { baseElement } = customRender(false, true);
    expect(baseElement).toMatchSnapshot();
  });

  it('render quick action when current user is not admin and has not global view permission', () => {
    const { baseElement } = customRender(false, false);
    expect(baseElement).toMatchSnapshot();
    expect(getAllBySelector('.action-item')).toHaveLength(2);
  });

  it('render navigate event', async () => {
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
