import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import MonitorSourceConfig from './';
import monitorSourceConfig from '../../testUtils/mockApi/monitorSourceConfig';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  databaseMonitorListData,
  searchServerMonitorListData
} from '../../testUtils/mockApi/monitorSourceConfig/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch } from 'react-redux';
import { superRender } from '../../testUtils/customRender';
import { ModalName } from '../../data/ModalName';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('test monitor source config', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.useFakeTimers();
    monitorSourceConfig.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render server monitor table for default', async () => {
    const { baseElement } = superRender(<MonitorSourceConfig />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('监控源配置')).toBeInTheDocument();
    expect(screen.getByText('服务器监控源')).toBeInTheDocument();
    expect(screen.getByText('数据库监控源')).toBeInTheDocument();
    expect(screen.getByText('添加服务器监控源')).toBeInTheDocument();
    expect(screen.getByText('主机IP')).toBeInTheDocument();
    expect(screen.getByText('SSH端口')).toBeInTheDocument();
  });

  it('should render normal server monitor table', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = superRender(<MonitorSourceConfig />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 3 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('test')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('172.20.134.1')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('正常')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('异常')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('未知')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('编 辑').length).toBe(3);
  });

  it('should open model when click add button', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = superRender(<MonitorSourceConfig />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    mockDispatch.mockClear();
    expect(mockDispatch).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('添加服务器监控源'));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Add_Server_Monitor,
        status: true
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should render search result for table and refresh ', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = monitorSourceConfig.serverMonitorList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: searchServerMonitorListData
      })
    );
    const { baseElement } = superRender(<MonitorSourceConfig />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(getBySelector('#actiontech-table-search-input'), {
      target: {
        value: 'test12'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#actiontech-table-search-input')).toHaveValue(
      'test12'
    );
    fireEvent.click(getBySelector('.custom-icon-search'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    emitSpy.mockClear();
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('test12')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('异常')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('编 辑').length).toBe(1);
    fireEvent.click(
      getBySelector('.ant-space-horizontal .custom-icon-refresh')
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Server_Monitor);
    expect(request).toBeCalled();
  });

  it('should render search result for database table ', async () => {
    const request = monitorSourceConfig.databaseMonitorList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: [{ ...databaseMonitorListData[0] }]
      })
    );
    const { baseElement } = superRender(<MonitorSourceConfig />);
    await act(async () => jest.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('数据库监控源'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('添加数据库监控源')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(getBySelector('#actiontech-table-search-input'), {
      target: {
        value: 'first'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#actiontech-table-search-input')).toHaveValue(
      'first'
    );
    fireEvent.click(getBySelector('.custom-icon-search'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('first')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('正常')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('编 辑').length).toBe(1);
  });

  it('should reset search input when click segment button', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = monitorSourceConfig.databaseMonitorList();
    const { baseElement } = superRender(<MonitorSourceConfig />);

    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.change(getBySelector('#actiontech-table-search-input'), {
      target: {
        value: 'test12'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#actiontech-table-search-input')).toHaveValue(
      'test12'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('数据库监控源'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
    emitSpy.mockClear();
    expect(screen.getByText('添加数据库监控源')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#actiontech-table-search-input')).toHaveValue('');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(
      getBySelector('.ant-space-horizontal .custom-icon-refresh')
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Database_Monitor);
    expect(request).toBeCalled();

    mockDispatch.mockClear();
    fireEvent.click(screen.getByText('添加数据库监控源'));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Add_Database_Monitor,
        status: true
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });
});
