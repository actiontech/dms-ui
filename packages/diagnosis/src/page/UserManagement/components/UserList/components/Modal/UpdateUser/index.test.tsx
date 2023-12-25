import { useDispatch } from 'react-redux';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import UpdateUser from './index';
import { superRender } from '../../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../../data/ModalName';
import eventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import userManagement from '../../../../../../../testUtils/mockApi/userManagement';
import { userListData } from '../../../../../../../testUtils/mockApi/userManagement/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/update user modal', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    userManagement.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockDispatch.mockClear();
    cleanup();
  });

  const customRender = (status = true, selectData = userListData[1]) => {
    return superRender(<UpdateUser />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {
            [ModalName.Update_User]: status
          },
          selectUserData: selectData
        }
      }
    });
  };

  it('should match no modal when modal status is false', async () => {
    const { container } = customRender(false);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should match snapshot when modal state is true ', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑用户')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('是否需要更新密码')).toBeInTheDocument();
    expect(screen.getByText('角色名')).toBeInTheDocument();
  });

  it('close modal by click close button', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_User,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should disabled role select when user name is admin', async () => {
    const { baseElement } = customRender(true, userListData[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#username')).toHaveClass('ant-input-disabled');
    expect(getBySelector('#role_id')).toHaveAttribute('disabled');
  });

  it('should not disabled role select when user name is not admin', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#username')).toHaveClass('ant-input-disabled');
    expect(getBySelector('#role_id')).not.toHaveAttribute('disabled');
  });

  it('should send request when input correct fields info', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const updateUserRequest = userManagement.updateUser();
    const getRoleRequest = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getRoleRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    // isNeedUpdatePassword
    fireEvent.click(getBySelector('#isNeedUpdatePassword'));
    await act(async () => jest.advanceTimersByTime(1000));
    await expect(screen.getByText('密码')).toBeInTheDocument();
    // password
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123');
    // confirm password
    fireEvent.change(getBySelector('#confirmPassword'), {
      target: {
        value: '123'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#confirmPassword')).toHaveValue('123');

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateUserRequest).toBeCalled();
    expect(updateUserRequest).toBeCalledWith({
      user_id: '1735126216567947264',
      password: '123',
      role_id: '10000'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('编辑用户 "test" 成功')).toBeInTheDocument();
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_User,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_User_Management);
  });
});
