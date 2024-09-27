import userCenter from '../../../../../testUtils/mockApi/userCenter';
import { userList } from '../../../../../testUtils/mockApi/userCenter/data';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { act, screen, cleanup, fireEvent } from '@testing-library/react';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import UserList from '../List';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { IListUser } from '@actiontech/shared/lib/api/base/service/common';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { UserCenterListEnum } from '../../../index.enum';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/UserCenter/UserList', () => {
  let userListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    userListSpy = userCenter.getUserList();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render user table', async () => {
    const { baseElement } = renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test666')).toBeInTheDocument();
    expect(screen.getAllByText('dms')).toHaveLength(5);
    expect(screen.getAllByText('删 除')).toHaveLength(4);
    expect(screen.getAllByText('管 理')).toHaveLength(5);
  });

  it('should render empty tips when request not success', async () => {
    userListSpy.mockClear();
    userListSpy.mockImplementation(() => createSpyErrorResponse({ data: [] }));
    const { baseElement } = renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should refresh user table when change current page', async () => {
    userListSpy.mockClear();
    const total = 40;
    const mockData: IListUser[] = [];
    for (let i = 0; i < total; i++) {
      mockData.push({
        op_permissions: [{ name: '创建项目', uid: '700001' }],
        uid: `16478957528667955${i}`,
        name: `test666${i}`
      });
    }
    userListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockData
      })
    );
    const { baseElement } = renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 40 条数据')).toBeInTheDocument();
    const element = queryBySelector('.ant-pagination-item-2', baseElement);
    await act(async () => {
      fireEvent.click(element!);
      await jest.advanceTimersByTime(300);
    });

    expect(userListSpy).toHaveBeenCalledTimes(2);
    expect(baseElement).toMatchSnapshot();
  });

  it('should refresh user table when emit "DMS_Refresh_User_Center_List" event', async () => {
    renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () =>
      EventEmitter.emit(EmitterKey.DMS_Refresh_User_Center_List)
    );
    expect(userListSpy).toHaveBeenCalledTimes(2);
  });

  it('should send delete user request', async () => {
    userListSpy.mockClear();
    userListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [userList[0]]
      })
    );
    const userName = userList[0].name;
    const deleteUserSpy = userCenter.deleteUser();
    renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(`确认要删除用户: "${userName}"?`)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledWith({
      user_uid: userList[0].uid
    });
    expect(screen.getByText(`删除用户 "${userName}" 成功`)).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toHaveBeenCalled();
  });

  it('should dispatch action when edit user info', async () => {
    userListSpy.mockClear();
    userListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [userList[0]]
      })
    );
    renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('管 理'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'userCenter/updateSelectUser',
      payload: {
        user: userList[0]
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_User,
        status: true
      }
    });
  });

  it('should hidden action column when is not admin', async () => {
    mockUseCurrentUser({ isAdmin: false });

    const { container } = renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('管 理')).toHaveLength(0);

    expect(container).toMatchSnapshot();
  });

  it('should disabled action when current role is not admin and ', async () => {
    mockUseCurrentUser({ isAdmin: false, role: SystemRole.globalViewing });

    const { container } = renderWithReduxAndTheme(
      <UserList activePage={UserCenterListEnum.user_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
