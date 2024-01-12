import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import monitorSourceConfig from '../../../../testUtils/mockApi/monitorSourceConfig';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { serverMonitorListData } from '../../../../testUtils/mockApi/monitorSourceConfig/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch } from 'react-redux';
import { superRender } from '../../../../testUtils/customRender';
import { ModalName } from '../../../../data/ModalName';
import ServerMonitor from './';
import { adminPermission } from '../../../../testUtils/mockApi/userManagement/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('test server monitor table', () => {
  const mockDispatch = jest.fn();

  const mockSetLoading = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    monitorSourceConfig.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data = adminPermission) => {
    return superRender(
      <ServerMonitor setLoading={mockSetLoading} searchValue="" />,
      undefined,
      {
        initStore: {
          user: {
            userScope: data
          },
          monitorSourceConfig: {
            modalStatus: {}
          }
        }
      }
    );
  };

  it('render without permission', async () => {
    const { baseElement } = customRender([]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render table when api return null', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    request.mockImplementation(() => createSpySuccessResponse([]));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = customRender();
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

  it('should open model when click edit button', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getAllByText('正常').length).toBe(1);
    expect(screen.getAllByText('异常').length).toBe(1);
    expect(screen.getAllByText('未知').length).toBe(1);
    expect(screen.getAllByText('编 辑').length).toBe(3);
    expect(getAllBySelector('.ant-table-cell a').length).toBe(3);
    expect(getAllBySelector('.ant-table-cell a')[0]).toHaveAttribute(
      'href',
      '/test/1/server_monitor/monitorItemList'
    );

    mockDispatch.mockClear();
    fireEvent.click(screen.getAllByText('编 辑')[0]);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: serverMonitorListData[0],
      type: 'monitorSourceConfig/updateSelectServerMonitorData'
    });
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_Server_Monitor,
        status: true
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should open query popover when click delete button', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const deleteRequest = monitorSourceConfig.deleteServerMonitor();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('删 除')[0]);
    expect(screen.getByText('确认删除服务器监控源test?')).toBeInTheDocument();
    expect(screen.getAllByText('确 认')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('确 认')[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('正在删除服务器监控源test...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(deleteRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('删除服务器监控源test成功！')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
  });

  it('delete server monitor failed', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: [{ ...serverMonitorListData[0], name: undefined }]
      })
    );
    const deleteRequest = monitorSourceConfig.deleteServerMonitor();
    deleteRequest.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('删 除')[0]);
    expect(screen.getByText('确认删除服务器监控源?')).toBeInTheDocument();
    expect(screen.getAllByText('确 认')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('确 认')[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('正在删除服务器监控源...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(deleteRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(1000));
  });

  it('can not delete by no id and no status data', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          { ...serverMonitorListData[0], id: undefined, status: undefined }
        ]
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('-')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('删 除')[0]);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  it('should refresh table when change pagination info', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search input'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('10 条/页')).toBeInTheDocument();
    fireEvent.click(screen.getByText('10 条/页'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(screen.getByText('共 3 条数据')).toBeInTheDocument();
  });
});
