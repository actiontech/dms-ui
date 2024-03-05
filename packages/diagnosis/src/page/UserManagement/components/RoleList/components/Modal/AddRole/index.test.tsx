import { useDispatch } from 'react-redux';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AddRole from './index';
import { superRender } from '../../../../../../../testUtils/customRender';
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

describe('diagnosis/add role modal', () => {
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
    return superRender(<AddRole />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {
            [ModalName.Add_Role]: status
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
    expect(screen.getByText('添加角色')).toBeInTheDocument();
    expect(screen.getByText('角色名')).toBeInTheDocument();
    expect(screen.getByText('描述')).toBeInTheDocument();
    expect(screen.getByText('操作权限')).toBeInTheDocument();
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
        modalName: ModalName.Add_Role,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should send request when input correct fields info', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const addRoleRequest = userManagement.addRole();
    const getScopeRequest = userManagement.getScopeList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getScopeRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    // role name
    fireEvent.change(getBySelector('#role_name'), {
      target: {
        value: 'test'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#role_name')).toHaveValue('test');
    // desc
    fireEvent.change(getBySelector('#role_desc'), {
      target: {
        value: 'this is role desc'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#role_desc')).toHaveValue('this is role desc');
    // scope
    fireEvent.mouseDown(getBySelector('#scopes'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(addRoleRequest).toHaveBeenCalled();
    expect(addRoleRequest).toHaveBeenCalledWith({
      role_desc: 'this is role desc',
      role_name: 'test',
      scopes: ['auth.UpdatePassword']
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('添加角色 "test" 成功')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_Role,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.Refresh_User_Management);
  });

  it('should send request failed', async () => {
    const addRoleRequest = userManagement.addRole();
    addRoleRequest.mockImplementation(() =>
      createSpySuccessResponse({ code: 500, message: 'error' })
    );
    const getScopeRequest = userManagement.getScopeList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getScopeRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    // role name
    fireEvent.change(getBySelector('#role_name'), {
      target: {
        value: 'test'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#role_name')).toHaveValue('test');
    // desc
    fireEvent.change(getBySelector('#role_desc'), {
      target: {
        value: 'this is role desc'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#role_desc')).toHaveValue('this is role desc');
    // scope
    fireEvent.mouseDown(getBySelector('#scopes'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(addRoleRequest).toHaveBeenCalled();
    expect(addRoleRequest).toHaveBeenCalledWith({
      role_desc: 'this is role desc',
      role_name: 'test',
      scopes: ['auth.UpdatePassword']
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
