import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import CheckMonitorConfig from './';
import monitorSourceConfig from '../../../../testUtils/mockApi/monitorSourceConfig';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch } from 'react-redux';
import { superRender } from '../../../../testUtils/customRender';
import { ModalName } from '../../../../data/ModalName';
import { monitorRoutineListData } from '../../../../testUtils/mockApi/monitorSourceConfig/data';
import Router from 'react-router-dom';
import { adminPermission } from '../../../../testUtils/mockApi/userManagement/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

describe('test monitor item config table', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.useFakeTimers();
    monitorSourceConfig.mockAllApi();
    jest.spyOn(Router, 'useParams').mockReturnValue({
      name: 'first',
      id: '1731574922989273088',
      type: 'database_monitor'
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data = adminPermission) => {
    return superRender(<CheckMonitorConfig />, undefined, {
      initStore: {
        user: {
          userScope: data
        },
        monitorSourceConfig: {
          modalStatus: {}
        }
      }
    });
  };

  it('render without permission', async () => {
    const { baseElement } = customRender([]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render table when api return null', async () => {
    const request = monitorSourceConfig.getMonitorRoutineList();
    request.mockImplementation(() => createSpySuccessResponse([]));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('返回监控源配置')).toBeInTheDocument();
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('监控源类型: 数据库监控')).toBeInTheDocument();
    expect(getBySelector('.title a')).toHaveAttribute(
      'href',
      '/monitorSourceConfig'
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = monitorSourceConfig.getMonitorRoutineList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 2 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('mysql status 监控')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('15')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('mysql_status')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('启用')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('禁用')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('查 看').length).toBe(2);
  });

  it('should open check model when click check button', async () => {
    const request = monitorSourceConfig.getMonitorRoutineList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('查 看').length).toBe(2);

    mockDispatch.mockClear();
    fireEvent.click(screen.getAllByText('查 看')[0]);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: monitorRoutineListData[0],
      type: 'monitorSourceConfig/updateSelectMonitorConfigData'
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Check_Monitor_Config,
        status: true
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should refresh table when change pagination info', async () => {
    const request = monitorSourceConfig.getMonitorRoutineList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search input'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('10 条/页')).toBeInTheDocument();
    fireEvent.click(screen.getByText('10 条/页'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    expect(screen.getByText('共 2 条数据')).toBeInTheDocument();
  });

  it('return error when no params in url', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      name: 'first',
      id: undefined,
      type: undefined
    });
    const request = monitorSourceConfig.getMonitorRoutineList();
    request.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = customRender();
    expect(screen.getByText('返回监控源配置')).toBeInTheDocument();
    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('监控源类型: 服务器监控')).toBeInTheDocument();
    expect(getBySelector('.title a')).toHaveAttribute(
      'href',
      '/monitorSourceConfig'
    );
    expect(baseElement).toMatchSnapshot();
  });
});
