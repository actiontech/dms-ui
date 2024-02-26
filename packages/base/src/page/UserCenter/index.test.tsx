import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import UserCenter from './index';
import { screen, cleanup, fireEvent, act } from '@testing-library/react';
import EventEmitter from '../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../data/EmitterKey';
import userCenter from '../../testUtils/mockApi/userCenter';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/UserCenter', () => {
  let userListSpy: jest.SpyInstance;
  let roleListSpy: jest.SpyInstance;
  let permissionListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    userListSpy = userCenter.getUserList();
    roleListSpy = userCenter.getRoleList();
    permissionListSpy = userCenter.getOpPermissionsList();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render user list when it first entered the user center', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UserCenter />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(userListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getByText('添加用户'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toBeCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_User,
        status: true
      }
    });
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(
      getBySelector('.ant-segmented-group', baseElement)
    ).toBeInTheDocument();
  });

  it('should receive "DMS_Refresh_User_Center_List" event when click refresh icon', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(<UserCenter />);
    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toBeCalledTimes(1);
    expect(eventEmitSpy).toBeCalledWith(
      EmitterKey.DMS_Refresh_User_Center_List
    );
  });

  it('switch to role list', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UserCenter />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getByText('角色列表'));
    await act(async () => jest.advanceTimersByTime(3100));
    expect(roleListSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('添加角色'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toBeCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Role,
        status: true
      }
    });
  });

  it('switch to operate permission list', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UserCenter />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getByText('操作权限列表'));
    await act(async () => jest.advanceTimersByTime(3100));
    expect(permissionListSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });
});
