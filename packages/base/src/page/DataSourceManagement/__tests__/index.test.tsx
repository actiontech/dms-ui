import { fireEvent } from '@testing-library/dom';
import DataSourceManagement from '..';
import { superRender } from '../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import dbServices from '../../../testUtils/mockApi/dbServices';
import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import { DataSourceManagerSegmentedKey } from '../index.type';
import { useLocation, useNavigate } from 'react-router-dom';
import eventEmitter from '../../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../../data/EmitterKey';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn()
  };
});

describe('test DataSourceManagement', () => {
  const navigateSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    dbServices.mockAllApi();
    syncTaskList.mockAllApi();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/data-source-management'
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    mockUseCurrentUser({ isAdmin: true });
    const { container, getByText } = superRender(<DataSourceManagement />);

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('外部数据源同步'));
    expect(container).toMatchSnapshot();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      {
        pathname: '/data-source-management',
        search: `active=${DataSourceManagerSegmentedKey.SyncDataSource}`
      },
      { replace: true }
    );
  });

  it('should send emit event when click refresh icon', () => {
    mockUseCurrentUser({ isAdmin: true });
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    const { getByText } = superRender(<DataSourceManagement />);

    fireEvent.click(getBySelector('.custom-icon-refresh'));

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Global_Data_Source
    );

    fireEvent.click(getByText('外部数据源同步'));
    fireEvent.click(getBySelector('.custom-icon-refresh'));
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Sync_Data_Source
    );
  });

  it('should render global data source and sync data source item when use has global view permission', () => {
    mockUseCurrentUser({ isAdmin: false, hasGlobalViewingPermission: true });
    const { container, getByText } = superRender(<DataSourceManagement />);

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('外部数据源同步'));
    expect(container).toMatchSnapshot();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      {
        pathname: '/data-source-management',
        search: `active=${DataSourceManagerSegmentedKey.SyncDataSource}`
      },
      { replace: true }
    );
  });

  it('should not render tabs item when use role is not admin or not project manager', () => {
    mockUseCurrentUser({
      isAdmin: false,
      isCertainProjectManager: false,
      hasGlobalViewingPermission: false
    });
    const { queryByText } = superRender(<DataSourceManagement />);

    expect(queryByText('全局数据源')).not.toBeInTheDocument();
    expect(queryByText('外部数据源同步')).not.toBeInTheDocument();
  });

  it('should render global data source item when use role is not admin and is project manager', () => {
    mockUseCurrentUser({
      isAdmin: false,
      isCertainProjectManager: true,
      hasGlobalViewingPermission: false
    });
    const { queryByText } = superRender(<DataSourceManagement />);

    expect(queryByText('全局数据源')).toBeInTheDocument();
    expect(queryByText('外部数据源同步')).not.toBeInTheDocument();
  });
});
