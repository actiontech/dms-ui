import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import DatabaseMonitor from './';
import monitorSourceConfig from '../../../../testUtils/mockApi/monitorSourceConfig';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '../../../../testUtils/customRender';
import { ModalName } from '../../../../data/ModalName';
import { databaseMonitorListData } from '../../../../testUtils/mockApi/monitorSourceConfig/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('test database monitor table', () => {
  const mockDispatch = jest.fn();

  const mockSetLoading = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: {}
        }
      });
    });
    jest.useFakeTimers();

    monitorSourceConfig.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render table when api return null', async () => {
    const request = monitorSourceConfig.databaseMonitorList();
    request.mockImplementation(() => createSpySuccessResponse([]));
    const { baseElement } = superRender(
      <DatabaseMonitor setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = monitorSourceConfig.databaseMonitorList();
    const { baseElement } = superRender(
      <DatabaseMonitor setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 3 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('first')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('172.20.134.1')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('正常')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('异常')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('未知')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('编 辑').length).toBe(3);
  });

  it('should open model when click edit button', async () => {
    const request = monitorSourceConfig.databaseMonitorList();
    const { baseElement } = superRender(
      <DatabaseMonitor setLoading={mockSetLoading} searchValue="" />
    );
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
      '/first/1731574922989273088/database_monitor/monitorItemList'
    );

    mockDispatch.mockClear();
    fireEvent.click(screen.getAllByText('编 辑')[0]);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: databaseMonitorListData[0],
      type: 'monitorSourceConfig/updateSelectDatabaseMonitorData'
    });
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_Database_Monitor,
        status: true
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should open query popover when click delete button', async () => {
    const request = monitorSourceConfig.databaseMonitorList();
    const deleteRequest = monitorSourceConfig.deleteDatabaseMonitor();
    const { baseElement } = superRender(
      <DatabaseMonitor setLoading={mockSetLoading} searchValue="" />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('删 除')[0]);
    expect(screen.getByText('确认删除数据库监控源first?')).toBeInTheDocument();
    expect(screen.getAllByText('确 认')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('确 认')[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      screen.getByText('正在删除数据库监控源first...')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(deleteRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('删除数据库监控源first成功！')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
  });

  it('should refresh table when change pagination info', async () => {
    const request = monitorSourceConfig.databaseMonitorList();
    const { baseElement } = superRender(
      <DatabaseMonitor setLoading={mockSetLoading} searchValue="" />
    );
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
