import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import ServerMonitorTable from './';
import monitorSourceConfig from '../../../../testUtils/mockApi/monitorSourceConfig';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { serverMonitorListData } from '../../../../testUtils/mockApi/monitorSourceConfig/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../data/ModalName';

const mockReduxData = {
  user: {
    token: 'AAh32ffdswt',
    theme: SupportTheme.LIGHT,
    bindProjects: [
      {
        project_id: '1',
        is_manager: true,
        project_name: 'default'
      }
    ]
  },
  project: {
    currentProjectArchive: false
  }
};

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
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        ...mockReduxData,
        monitorSourceConfig: {
          modalStatus: {
            [ModalName.Add_Server_Monitor]: false,
            [ModalName.Update_Server_Monitor]: false
          }
        }
      });
    });
    monitorSourceConfig.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    mockDispatch.mockClear();
    cleanup();
  });

  it('should render table when api return null', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        data: [],
        message: '',
        total: 0
      })
    );
    const { baseElement } = superRender(
      <ServerMonitorTable setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = superRender(
      <ServerMonitorTable setLoading={mockSetLoading} searchValue="" />
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
    expect(screen.queryAllByText('添加服务器监控源').length).toBe(1);
    expect(screen.queryAllByText('编辑').length).toBe(3);
  });

  it('render table error', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    request.mockImplementation(() => createSpySuccessResponse('error info'));
    const { baseElement } = superRender(
      <ServerMonitorTable setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('error info')).toBeInTheDocument();
  });

  it('should open model when click add and edit button', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = superRender(
      <ServerMonitorTable setLoading={mockSetLoading} searchValue="" />
    );
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
    await act(async () => jest.advanceTimersByTime(1000));

    mockDispatch.mockClear();
    fireEvent.click(screen.getByText('编辑'));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: serverMonitorListData[0],
      type: 'monitorSourceConfig/updateSelectServerMonitorData'
    });
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_Server_Monitor,
        status: true
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should render search result for table and refresh ', async () => {
    const request = monitorSourceConfig.serverMonitorList();
    const { baseElement } = superRender(
      <ServerMonitorTable setLoading={mockSetLoading} searchValue="" />
    );
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
    fireEvent.mouseEnter(getBySelector('#actiontech-table-search-input'));
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        data: [{ ...serverMonitorListData[1] }],
        message: 'ok',
        total: 1
      })
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('test12')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('异常')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('编辑').length).toBe(1);

    fireEvent.click(getBySelector('.antd-v5-space-horizontal button'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
  });
});
