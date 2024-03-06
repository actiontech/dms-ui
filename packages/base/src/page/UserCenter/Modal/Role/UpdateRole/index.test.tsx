import userCenter from '../../../../../testUtils/mockApi/userCenter';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import UpdateRole from '.';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/UserCenter/Modal/Role/UpdateRole', () => {
  let updateRoleSpy: jest.SpyInstance;
  let opPermissionListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    updateRoleSpy = userCenter.updateRole();

    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    opPermissionListSpy = userCenter.getOpPermissionsList();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userCenter: {
          modalStatus: { [ModalName.DMS_Update_Role]: true },
          selectRole: {
            name: 'test',
            desc: 'test desc',
            uid: '1001',
            op_permissions: [
              {
                name: '创建项目',
                uid: '700001'
              }
            ]
          }
        }
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send update role request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(<UpdateRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('编辑角色')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(opPermissionListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('角色名')).toHaveValue('test');
    expect(screen.getByLabelText('角色名')).toHaveAttribute('disabled');
    expect(screen.getByLabelText('是否禁用')).not.toBeChecked();
    fireEvent.input(screen.getByLabelText('描述'), {
      target: { value: 'test1' }
    });
    fireEvent.click(screen.getByLabelText('是否禁用'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByLabelText('是否禁用')).toBeChecked();
    selectOptionByIndex('操作权限', '修改项目', 0);
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(updateRoleSpy).toHaveBeenCalledTimes(1);
    expect(updateRoleSpy).toHaveBeenCalledWith({
      role: {
        desc: 'test1',
        op_permission_uids: ['700001', '20150'],
        is_disabled: true
      },
      role_uid: '1001'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`编辑角色 "test" 成功`));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Role,
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
    const { baseElement } = renderWithReduxAndTheme(<UpdateRole />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Role,
        status: false
      }
    });
  });
});
