import { useDispatch } from 'react-redux';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import UpdateRole from './index';
import { superRender } from '../../../../../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../../data/ModalName';
import eventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import userManagement from '../../../../../../../testUtils/mockApi/userManagement';
import { roleListData } from '../../../../../../../testUtils/mockApi/userManagement/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/update role modal', () => {
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
    return superRender(<UpdateRole />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {
            [ModalName.Update_Role]: status
          },
          selectRoleData: roleListData[1]
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
    expect(screen.getByText('编辑角色')).toBeInTheDocument();
    expect(screen.getByText('角色名')).toBeInTheDocument();
    expect(screen.getByText('描述')).toBeInTheDocument();
    expect(screen.getByText('操作权限')).toBeInTheDocument();
    expect(getBySelector('#role_name')).toHaveClass('ant-input-disabled');
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
        modalName: ModalName.Update_Role,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should send request when input correct fields info', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const updateRoleRequest = userManagement.updateRole();
    const getScopeRequest = userManagement.getScopeList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getScopeRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    // desc
    fireEvent.change(getBySelector('#role_desc'), {
      target: {
        value: 'role desc'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#role_desc')).toHaveValue('role desc');
    // scope
    fireEvent.mouseDown(getBySelector('#scopes'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[1]);
      await act(async () => jest.advanceTimersByTime(300));
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateRoleRequest).toBeCalled();
    expect(updateRoleRequest).toBeCalledWith({
      role_desc: 'role desc',
      role_id: '1735188490427039744',
      scopes: ['auth.UpdatePassword']
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('编辑角色 "test" 成功')).toBeInTheDocument();
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_Role,
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Role_List);
  });
});
