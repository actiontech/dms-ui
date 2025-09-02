import AddUser from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import userCenter from '../../../../../testUtils/mockApi/userCenter';
import EventEmitter from '../../../../../utils/EventEmitter';
import { screen, act, cleanup, fireEvent } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('base/UserCenter/Modal/AddUser', () => {
  let opPermissionListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let addUserSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    addUserSpy = userCenter.addUser();

    opPermissionListSpy = userCenter.getOpPermissionsList();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userCenter: { modalStatus: { [ModalName.DMS_Add_User]: true } }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it.skip('should send add user request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(<AddUser />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('添加用户')).toBeInTheDocument();
    expect(opPermissionListSpy).toHaveBeenCalledTimes(1);
    const userName = 'test1';
    fireEvent.input(screen.getByLabelText('用户名'), {
      target: { value: userName }
    });
    fireEvent.input(screen.getByLabelText('密码'), {
      target: { value: '123' }
    });

    fireEvent.input(screen.getByLabelText('确认密码'), {
      target: { value: '123' }
    });

    fireEvent.input(screen.getByLabelText('邮箱'), {
      target: { value: 'test@163.com' }
    });

    fireEvent.input(screen.getByLabelText('手机'), {
      target: { value: '13312341234' }
    });

    fireEvent.input(screen.getByLabelText('微信ID'), {
      target: { value: 'qwe' }
    });
    selectOptionByIndex('平台管理权限', '创建项目', 0);
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(addUserSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(addUserSpy).toHaveBeenCalledWith({
      user: {
        name: userName,
        password: '123',
        email: 'test@163.com',
        phone: '13312341234',
        wxid: 'qwe',
        op_permission_uids: ['700001']
      }
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_User,
        status: false
      }
    });
    expect(screen.getByText(`添加用户 "${userName}" 成功`)).toBeInTheDocument();
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_User_Center_List
    );
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = renderWithReduxAndTheme(<AddUser />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_User,
        status: false
      }
    });
  });
});
