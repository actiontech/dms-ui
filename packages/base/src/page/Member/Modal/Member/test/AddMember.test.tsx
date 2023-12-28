import userCenter from '../../../../../testUtils/mockApi/userCenter';
import {
  userList,
  roleList
} from '../../../../../testUtils/mockApi/userCenter/data';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import AddMember from '../AddMember';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import member from '../../../../../testUtils/mockApi/member';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '../../../../../testUtils/mockApi/dbServices';
import { dbServices as dbServicesList } from '../../../../../testUtils/mockApi/dbServices/data';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/Member/Modal/AddMember', () => {
  let addMemberSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let listUsersSpy: jest.SpyInstance;
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: { modalStatus: { [ModalName.DMS_Add_Member]: true } }
      })
    );
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    jest.useFakeTimers();
    addMemberSpy = member.addMember();
    listUsersSpy = userCenter.getUserList();
    litDBServices = dbServices.ListDBServices();
    listRoleSpy = userCenter.getRoleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send add member request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listUsersSpy).toBeCalledTimes(1);
    expect(litDBServices).toBeCalledTimes(1);
    expect(listRoleSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('添加成员')).toBeInTheDocument();
    expect(screen.getByText('添加平台角色与操作范围')).toBeInTheDocument();
    selectOptionByIndex('用户名称', userList[0].name ?? '', 0);
    fireEvent.click(screen.getByLabelText('项目管理权限'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.queryByText('添加平台角色与操作范围')
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('项目管理权限')).toBeChecked();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(addMemberSpy).toBeCalledTimes(1);
    expect(addMemberSpy).toBeCalledWith({
      member: {
        is_project_admin: true,
        user_uid: userList[0].uid,
        role_with_op_ranges: undefined
      },
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member,
        status: false
      }
    });
    expect(eventEmitSpy).toBeCalledTimes(1);
    expect(eventEmitSpy).toBeCalledWith(EmitterKey.DMS_Refresh_Member_List);
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('should send add member request when click submit button with role', async () => {
    const { baseElement } = renderWithReduxAndTheme(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('用户名称', userList[0].name ?? '', 0);
    fireEvent.click(queryBySelector('.member-form-add-button', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('平台角色')).toBeInTheDocument();
    expect(screen.getByText('操作范围')).toBeInTheDocument();
    expect(screen.queryAllByText('平台角色')).toHaveLength(1);
    selectOptionByIndex('平台角色', roleList[0].name ?? '', 0);
    const firstDb = dbServicesList[0];
    selectOptionByIndex(
      '操作范围',
      `${firstDb.name} (${firstDb.host}:${firstDb.port})`,
      0
    );

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(addMemberSpy).toBeCalledTimes(1);
    expect(addMemberSpy).toBeCalledWith({
      member: {
        is_project_admin: false,
        user_uid: userList[0].uid,
        role_with_op_ranges: [
          {
            op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
            range_uids: [firstDb.uid],
            role_uid: roleList[0].uid
          }
        ]
      },
      project_uid: mockProjectInfo.projectID
    });
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = renderWithReduxAndTheme(<AddMember />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member,
        status: false
      }
    });
  });
});
