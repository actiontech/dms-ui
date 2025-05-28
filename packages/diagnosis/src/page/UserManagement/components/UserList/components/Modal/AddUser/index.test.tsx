import { useDispatch } from 'react-redux';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AddUser from './index';
import { diagnosisSuperRender } from '../../../../../../../testUtils/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../../data/ModalName';
import eventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import userManagement from '../../../../../../../testUtils/mockApi/userManagement';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/add user modal', () => {
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

  const customRender = (status = true) => {
    return diagnosisSuperRender(<AddUser />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {
            [ModalName.Add_User]: status
          }
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
    expect(screen.getByText('添加用户')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('密码')).toBeInTheDocument();
    expect(screen.getByText('确认密码')).toBeInTheDocument();
    expect(screen.getByText('角色名')).toBeInTheDocument();
  });

  it('close modal by click close button', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_User,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should send request when input correct fields info', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const addUserRequest = userManagement.addUser();
    const getRoleRequest = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getRoleRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    // user name
    fireEvent.change(getBySelector('#username'), {
      target: {
        value: 'test'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#username')).toHaveValue('test');
    // password
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456');
    // confirm password
    fireEvent.change(getBySelector('#confirmPassword'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#confirmPassword')).toHaveValue('123456');
    // role name
    fireEvent.mouseDown(getBySelector('#role_id'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(addUserRequest).toHaveBeenCalled();
    expect(addUserRequest).toHaveBeenCalledWith({
      username: 'test',
      password: '123456',
      role_id: '10000'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('添加用户 "test" 成功')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_User,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.Refresh_User_Management);
  });

  it('should send request failed', async () => {
    const addUserRequest = userManagement.addUser();
    addUserRequest.mockImplementation(() =>
      createSpySuccessResponse({ code: 500, message: 'error' })
    );
    const getRoleRequest = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getRoleRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    // user name
    fireEvent.change(getBySelector('#username'), {
      target: {
        value: 'test'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#username')).toHaveValue('test');
    // password
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456');
    // confirm password
    fireEvent.change(getBySelector('#confirmPassword'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#confirmPassword')).toHaveValue('123456');
    // role name
    fireEvent.mouseDown(getBySelector('#role_id'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(addUserRequest).toHaveBeenCalled();
    expect(addUserRequest).toHaveBeenCalledWith({
      username: 'test',
      password: '123456',
      role_id: '10000'
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
