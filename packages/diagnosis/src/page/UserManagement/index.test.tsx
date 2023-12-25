import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useDispatch } from 'react-redux';
import { superRender } from '../../testUtils/customRender';
import { ModalName } from '../../data/ModalName';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import userManagement from '../../testUtils/mockApi/userManagement';
import UserManagement from '.';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('test user management', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.useFakeTimers();
    userManagement.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render user list table for default', async () => {
    const { baseElement } = superRender(<UserManagement />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('用户管理')).toBeInTheDocument();
    expect(screen.getByText('用户列表')).toBeInTheDocument();
    expect(screen.getByText('角色列表')).toBeInTheDocument();
    expect(screen.getByText('操作权限列表')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('角色名')).toBeInTheDocument();
  });

  it('should render normal user list table', async () => {
    const request = userManagement.getUserList();
    const { baseElement } = superRender(<UserManagement />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 2 条数据')).toBeInTheDocument();
    expect(screen.queryAllByText('admin').length).toBe(3);
    expect(screen.getAllByText('test')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('管 理').length).toBe(2);
  });

  it('should open model when click add button', async () => {
    const request = userManagement.getUserList();
    const { baseElement } = superRender(<UserManagement />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    mockDispatch.mockClear();
    expect(mockDispatch).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('添加用户'));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Add_User,
        status: true
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should send request when click refresh button', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = userManagement.getUserList();
    const { baseElement } = superRender(<UserManagement />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.title .basic-button-wrapper'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_User_Management);
    expect(request).toBeCalled();
  });
});
