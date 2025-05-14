import userCenter from '../../../../../testUtils/mockApi/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import AddRole from '.';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/UserCenter/Modal/Role/AddRole', () => {
  let addRoleSpy: jest.SpyInstance;
  let opPermissionListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    addRoleSpy = userCenter.addRole();

    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    opPermissionListSpy = userCenter.getOpPermissionsList();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userCenter: { modalStatus: { [ModalName.DMS_Add_Role]: true } }
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send add role request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const mockRoleName = 'test_role_name';
    const { baseElement } = superRender(<AddRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(opPermissionListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加角色')).toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('角色名'), {
      target: { value: mockRoleName }
    });
    fireEvent.input(screen.getByLabelText('描述'), {
      target: { value: 'test1' }
    });
    selectOptionByIndex('操作权限', '创建项目', 0);
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(addRoleSpy).toHaveBeenCalledTimes(1);
    expect(addRoleSpy).toHaveBeenCalledWith({
      role: {
        name: mockRoleName,
        desc: 'test1',
        op_permission_uids: ['700001']
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`添加角色 "${mockRoleName}" 成功`));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Role,
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

  it('should close modal when click close button', async () => {
    const { baseElement } = superRender(<AddRole />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Role,
        status: false
      }
    });
  });
});
