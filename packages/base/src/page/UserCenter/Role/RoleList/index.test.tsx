import { act, cleanup, screen, waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import RoleList from '.';
import userCenter from '../../../../testUtils/mockApi/userCenter';
import {
  renderWithReduxAndTheme,
  superRender
} from '@actiontech/shared/lib/testUtil/customRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { roleList } from '../../../../testUtils/mockApi/userCenter/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('UserCenter/Role/RoleList', () => {
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
    const { container } = renderWithReduxAndTheme(<RoleList />);
    await act(async () => jest.advanceTimersByTime(100));
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when emit DMS_Refresh_User_List event', async () => {
    const getRoleListSpy = userCenter.getRoleList();
    getRoleListSpy.mockImplementation(() =>
      createSpySuccessResponse({ total: 0, roles: [] })
    );
    renderWithReduxAndTheme(<RoleList />);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getRoleListSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => EventEmitter.emit(EmitterKey.DMS_Refresh_Role_List));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getRoleListSpy).toBeCalledTimes(2);
  });

  it('should open add modal when click add button', async () => {
    const { userEvent } = superRender(<RoleList />);
    await act(async () => jest.advanceTimersByTime(3000));
    mockDispatch.mockClear();
    expect(mockDispatch).toBeCalledTimes(0);

    await act(() => userEvent.click(screen.getByText('添加角色')));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.DMS_Add_Role,
        status: true
      },
      type: 'userCenter/updateModalStatus'
    });
  });

  it('should open update modal when click update button', async () => {
    const { userEvent } = superRender(<RoleList />);
    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(() => userEvent.click(screen.getAllByText('编辑')[0]));
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).nthCalledWith(2, {
      payload: {
        modalName: ModalName.DMS_Update_Role,
        status: true
      },
      type: 'userCenter/updateModalStatus'
    });
    expect(mockDispatch).nthCalledWith(1, {
      payload: {
        role: roleList[0]
      },
      type: 'userCenter/updateSelectRole'
    });
  });

  it('should show delete popup when click delete button', async () => {
    const { userEvent } = superRender(<RoleList />);
    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(() => userEvent.click(screen.getAllByText('删除')[0]));
    await waitFor(() =>
      expect(screen.getByText(`确认要删除角色 "${roleList[0].name}"?`))
    );
    await act(() => userEvent.click(screen.getByText('确 认')));
    expect(userCenter.deleteRole()).toBeCalledTimes(1);
    expect(userCenter.deleteRole()).toBeCalledWith({
      role_uid: '1001'
    });
    expect(
      screen.getByText(`正在删除角色 "${roleList[0].name}"...`)
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(`删除角色 "${roleList[0].name}" 成功`)
    ).toBeInTheDocument();
    expect(userCenter.getRoleList()).toBeCalledTimes(2);
    expect(userCenter.getRoleList()).toBeCalledWith({
      page_index: 1,
      page_size: 10
    });

    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.queryByText(`正在删除角色 "${roleList[0].name}..."`)
    ).not.toBeInTheDocument();
  });
});
