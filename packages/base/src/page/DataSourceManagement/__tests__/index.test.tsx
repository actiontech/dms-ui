import { fireEvent } from '@testing-library/dom';
import DataSourceManagement from '..';
import { baseSuperRender } from '../../../testUtils/superRender';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import syncTaskList from '@actiontech/shared/lib/testUtil/mockApi/base/syncTaskList';
import { DataSourceManagerSegmentedKey } from '../index.type';
import { useNavigate } from 'react-router-dom';
import eventEmitter from '../../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../../data/EmitterKey';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test DataSourceManagement', () => {
  const navigateSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    dbServices.mockAllApi();
    syncTaskList.mockAllApi();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true),
        checkActionPermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { container, getByText } = baseSuperRender(<DataSourceManagement />);

    expect(container).toMatchSnapshot();
    fireEvent.click(getByText('外部数据源同步'));
    expect(container).toMatchSnapshot();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/data-source-management?active=${DataSourceManagerSegmentedKey.SyncDataSource}`,
      { replace: true }
    );
  });

  it('should send emit event when click refresh icon', () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    const { getByText } = baseSuperRender(<DataSourceManagement />);

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

  it('should send emit event when click batch test connect button', () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    const { getByText } = baseSuperRender(<DataSourceManagement />);

    fireEvent.click(getByText('批量测试数据源连通性'));

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Batch_Test_Data_Source_Connection
    );

    fireEvent.click(getByText('外部数据源同步'));
    fireEvent.click(getBySelector('.custom-icon-refresh'));
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Sync_Data_Source
    );
  });

  it('should not render tabs item when use role is not admin or not project manager', () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(false)
      },
      { useSpyOnMockHooks: true }
    );

    const { queryByText } = baseSuperRender(<DataSourceManagement />);

    expect(queryByText('全局数据源')).not.toBeInTheDocument();
    expect(queryByText('外部数据源同步')).not.toBeInTheDocument();
  });
});
