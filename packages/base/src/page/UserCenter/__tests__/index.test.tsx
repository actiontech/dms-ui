import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import UserCenter from '../index';
import { screen, cleanup, fireEvent, act } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SystemRole } from '@actiontech/shared/lib/enum';

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
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render user list when it first entered the user center', async () => {
    const { baseElement } = superRender(<UserCenter />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(userListSpy).toHaveBeenCalledTimes(1);
    expect(userListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20
    });
    fireEvent.click(screen.getByText('添加用户'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledWith({
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

  it('switch to role list', async () => {
    const { baseElement } = superRender(<UserCenter />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('角色列表'));
    await act(async () => jest.advanceTimersByTime(3100));
    expect(roleListSpy).toHaveBeenCalledTimes(1);
    expect(roleListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      fuzzy_keyword: ''
    });
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('添加角色'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Role,
        status: true
      }
    });
  });

  it('switch to operate permission list', async () => {
    const { baseElement } = superRender(<UserCenter />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('操作权限列表'));
    await act(async () => jest.advanceTimersByTime(3100));
    expect(permissionListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should refresh table when click refresh icon', async () => {
    const { baseElement } = superRender(<UserCenter />);
    expect(userListSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));

    expect(userListSpy).toHaveBeenCalledTimes(2);
    expect(userListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('角色列表'));
    expect(roleListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    expect(roleListSpy).toHaveBeenCalledTimes(2);
    expect(roleListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      fuzzy_keyword: ''
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('操作权限列表'));
    expect(permissionListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    expect(permissionListSpy).toHaveBeenCalledTimes(2);
  });

  it('should hidden action when user is not admin', async () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.auditAdministrator]: true,
        [SystemRole.projectDirector]: true,
        [SystemRole.certainProjectManager]: true
      }
    });

    const { baseElement } = superRender(<UserCenter />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('添加用户')).not.toBeInTheDocument();
    expect(screen.queryByText('添加角色')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
