import { fireEvent } from '@testing-library/dom';
import DataSourceManagement from '..';
import { superRender } from '../../../testUtils/customRender';
import dbServices from '../../../testUtils/mockApi/dbServices';
import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import { DataSourceManagerSegmentedKey } from '../index.type';
import { useLocation, useNavigate } from 'react-router-dom';
import eventEmitter from '../../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../../data/EmitterKey';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

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
    mockUsePermission({ checkPagePermission: jest.fn().mockReturnValue(true) });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
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

  it('should not render tabs item when use role is not admin or not project manager', () => {
    mockUsePermission({
      checkPagePermission: jest.fn().mockReturnValue(false)
    });

    const { queryByText } = superRender(<DataSourceManagement />);

    expect(queryByText('全局数据源')).not.toBeInTheDocument();
    expect(queryByText('外部数据源同步')).not.toBeInTheDocument();
  });
});
