import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import ServerMonitor from './';
import monitorSourceConfig from '../../../../testUtils/mockApi/monitorSourceConfig';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { serverMonitorListData } from '../../../../testUtils/mockApi/monitorSourceConfig/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  renderWithReduxAndTheme,
  superRender
} from '@actiontech/shared/lib/testUtil/customRender';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../data/ModalName';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('test server table', () => {
  const mockDispatch = jest.fn();

  const mockSetLoading = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.useFakeTimers();
    mockUseCurrentProject();
    monitorSourceConfig.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render table when api return null', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        data: [],
        message: '',
        total_nums: 0
      })
    );
    const { baseElement } = superRender(
      <ServerMonitor setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = superRender(
      <ServerMonitor setLoading={mockSetLoading} searchValue="" />
    );
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

  // it('render table error', async () => {
  //   const request = monitorSourceConfig.serverMonitorList();
  //   request.mockImplementation(() => Promise.reject('error info'));
  //   const { baseElement } = superRender(
  //     <ServerMonitor setLoading={mockSetLoading} searchValue="" />
  //   );
  //   await act(async () => jest.advanceTimersByTime(3300));
  //   expect(request).toBeCalled();
  //   await act(async () => jest.advanceTimersByTime(3300));
  //   expect(baseElement).toMatchSnapshot();
  //   await act(async () => jest.advanceTimersByTime(6000));
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   expect(screen.getByText('error info')).toBeInTheDocument();
  // });

  it('should open model when click edit button', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = superRender(
      <ServerMonitor setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    // mockDispatch.mockClear();
    // expect(mockDispatch).toBeCalledTimes(0);
    // fireEvent.click(screen.getByText('添加服务器监控源'));
    // expect(mockDispatch).toBeCalledTimes(1);
    // expect(mockDispatch).toBeCalledWith({
    //   payload: {
    //     modalName: ModalName.Add_Server_Monitor,
    //     status: true
    //   },
    //   type: 'monitorSourceConfig/updateModalStatus'
    // });
    // await act(async () => jest.advanceTimersByTime(1000));

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

  // it('should render search result for table and refresh ', async () => {
  //   const request = monitorSourceConfig.serverMonitorList();
  //   const { baseElement } = superRender(
  //     <ServerMonitor setLoading={mockSetLoading} searchValue="" />
  //   );
  //   await act(async () => jest.advanceTimersByTime(3300));
  //   expect(request).toBeCalled();
  //   await act(async () => jest.advanceTimersByTime(3300));
  //   expect(baseElement).toMatchSnapshot();

  //   fireEvent.change(getBySelector('#actiontech-table-search-input'), {
  //     target: {
  //       value: 'test12'
  //     }
  //   });
  //   await act(async () => jest.advanceTimersByTime(1000));
  //   expect(getBySelector('#actiontech-table-search-input')).toHaveValue(
  //     'test12'
  //   );
  //   fireEvent.mouseEnter(getBySelector('#actiontech-table-search-input'));
  //   request.mockImplementation(() =>
  //     createSpySuccessResponse({
  //       code: 0,
  //       data: [{ ...serverMonitorListData[1] }],
  //       message: 'ok',
  //       total: 1
  //     })
  //   );
  //   await act(async () => jest.advanceTimersByTime(3300));
  //   expect(request).toBeCalled();
  //   expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
  //   expect(screen.getAllByText('test12')?.[0]).toBeInTheDocument();
  //   expect(screen.getAllByText('异常')?.[0]).toBeInTheDocument();
  //   expect(screen.queryAllByText('编辑').length).toBe(1);

  //   fireEvent.click(getBySelector('.antd-v5-space-horizontal button'));
  //   await act(async () => jest.advanceTimersByTime(3300));
  //   expect(request).toBeCalled();
  // });

  it('should refresh table when change pagination info', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = renderWithReduxAndTheme(
      <ServerMonitor setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search input'));
    // fireEvent.click(getBySelector('.ant-select-selection-item'));
    // fireEvent.click(getBySelector('.ant-select-selection-search'));
    // fireEvent.click(getBySelector('.ant-select-selector'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('10 / page')).toBeInTheDocument();
    // expect(screen.getByText('10 条/页')).toBeInTheDocument();
    fireEvent.click(screen.getByText('10 / page'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(screen.getByText('共 3 条数据')).toBeInTheDocument();
  });
});
