import { act, cleanup, screen, waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import UserGroupList from '.';
import userCenter from '../../../../testUtils/mockApi/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { userGroupList } from '../../../../testUtils/mockApi/userCenter/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('UserCenter/User/UserGroupList', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.useFakeTimers();
    userCenter.mockAllApi();
  });
  afterEach(() => {
    jest.useRealTimers();
    mockDispatch.mockClear();
    jest.clearAllTimers();
    cleanup();
  });

  it('should render table', async () => {
    const { container } = superRender(<UserGroupList />);
    await act(async () => jest.advanceTimersByTime(100));
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when emit DMS_Refresh_User_List event', async () => {
    const getUserGroupListSpy = userCenter.getUserGroupList();
    getUserGroupListSpy.mockImplementation(() =>
      createSpySuccessResponse({ total: 0, user_groups: [] })
    );
    superRender(<UserGroupList />);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getUserGroupListSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () =>
      EventEmitter.emit(EmitterKey.DMS_Refresh_User_Group_List)
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(getUserGroupListSpy).toBeCalledTimes(2);
  });

  it('should open add modal when click add button', async () => {
    const { userEvent } = superRender(<UserGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    mockDispatch.mockClear();
    expect(mockDispatch).toBeCalledTimes(0);

    await act(() => userEvent.click(screen.getByText('添加用户组')));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.DMS_Add_User_Group,
        status: true
      },
      type: 'userCenter/updateModalStatus'
    });
  });

  it('should open update modal when click update button', async () => {
    const { userEvent } = superRender(<UserGroupList />);
    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(() => userEvent.click(screen.getAllByText('管理')[0]));
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).nthCalledWith(2, {
      payload: {
        modalName: ModalName.DMS_Update_User_Group,
        status: true
      },
      type: 'userCenter/updateModalStatus'
    });
    expect(mockDispatch).nthCalledWith(1, {
      payload: {
        userGroup: userGroupList[0]
      },
      type: 'userCenter/updateSelectUserGroup'
    });
  });

  it('should show delete popup when click delete button', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    const { userEvent } = superRender(<UserGroupList />);
    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(() => userEvent.click(screen.getAllByText('删除')[0]));
    await waitFor(() =>
      expect(screen.getByText(`确认要删除用户组: "${userGroupList[0].name}"？`))
    );
    await act(() => userEvent.click(screen.getByText('确 认')));
    expect(userCenter.deleteUserGroup()).toBeCalledTimes(1);
    expect(userCenter.deleteUserGroup()).toBeCalledWith({
      user_group_uid: '1453'
    });
    expect(
      screen.getByText(`正在删除用户组: "${userGroupList[0].name}"...`)
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText(`正在删除用户组: "${userGroupList[0].name}..."`)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(`删除用户组: "${userGroupList[0].name}"成功`)
    ).toBeInTheDocument();

    expect(userCenter.getUserGroupList()).toBeCalledTimes(2);
    expect(userCenter.getUserGroupList()).toBeCalledWith({
      page_index: 1,
      page_size: 10
    });
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.DMS_Refresh_User_List);
  });
});
