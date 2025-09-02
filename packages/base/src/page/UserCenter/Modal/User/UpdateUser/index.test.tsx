import UpdateUser from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import userCenter from '../../../../../testUtils/mockApi/userCenter';
import { userList } from '../../../../../testUtils/mockApi/userCenter/data';
import EventEmitter from '../../../../../utils/EventEmitter';
import { screen, act, cleanup, fireEvent } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import EmitterKey from '../../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/UserCenter/Modal/UpdateUser', () => {
  let updateUserSpy: jest.SpyInstance;
  let opPermissionListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const mockUserData = userList[0];
  beforeEach(() => {
    jest.useFakeTimers();
    updateUserSpy = userCenter.updateUser();
    opPermissionListSpy = userCenter.getOpPermissionsList();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userCenter: {
          modalStatus: { [ModalName.DMS_Update_User]: true },
          selectUser: userList[0]
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it.skip('should send update user request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(<UpdateUser />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(opPermissionListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('用户名')).toHaveValue(mockUserData.name);
    expect(screen.getByLabelText('用户名')).toHaveAttribute('disabled');
    expect(screen.getByLabelText('是否需要更新密码')).not.toBeChecked();
    expect(screen.queryByLabelText('密码')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('确认密码')).not.toBeInTheDocument();
    expect(screen.getByLabelText('是否禁用')).not.toBeChecked();
    fireEvent.input(screen.getByLabelText('邮箱'), {
      target: { value: 'test@163.com' }
    });
    fireEvent.click(screen.getByLabelText('是否禁用'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByLabelText('是否禁用')).toBeChecked();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(updateUserSpy).toHaveBeenCalledTimes(1);
    expect(updateUserSpy).toHaveBeenCalledWith({
      user: {
        email: 'test@163.com',
        password: undefined,
        phone: '',
        wxid: '',
        op_permission_uids: ['700001'],
        is_disabled: true
      },
      user_uid: mockUserData.uid
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`编辑用户 "${mockUserData.name}" 成功`));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_User,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_User_Center_List
    );
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it.skip('should update user password', async () => {
    renderWithReduxAndTheme(<UpdateUser />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('是否需要更新密码')).not.toBeChecked();
    fireEvent.click(screen.getByLabelText('是否需要更新密码'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByLabelText('确认密码')).toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('密码'), {
      target: { value: '123' }
    });
    fireEvent.input(screen.getByLabelText('确认密码'), {
      target: { value: '1234' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.input(screen.getByLabelText('确认密码'), {
      target: { value: '123' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateUserSpy).toHaveBeenCalledTimes(1);
    expect(updateUserSpy).toHaveBeenCalledWith({
      user: {
        email: '',
        password: '123',
        phone: '',
        wxid: '',
        op_permission_uids: ['700001'],
        is_disabled: false
      },
      user_uid: mockUserData.uid
    });
  });

  it.skip('should disable field in document when user name is admin', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userCenter: {
          modalStatus: { [ModalName.DMS_Update_User]: true },
          selectUser: userList[2]
        }
      })
    );
    renderWithReduxAndTheme(<UpdateUser />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByLabelText('是否禁用')).not.toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('邮箱'), {
      target: { value: 'test@163.com' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateUserSpy).toHaveBeenCalledTimes(1);
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UpdateUser />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_User,
        status: false
      }
    });
  });
});
