import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import {
  userList,
  roleList
} from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter/data';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import AddMemberGroup from '../AddMemberGroup';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import member from '@actiontech/shared/lib/testUtil/mockApi/base/member';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import { dbServices as dbServicesList } from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices/data';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/Member/Modal/AddMemberGroup', () => {
  let addMemberGroupSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let listUsersSpy: jest.SpyInstance;
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: { modalStatus: { [ModalName.DMS_Add_Member_Group]: true } }
      })
    );
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    jest.useFakeTimers();
    addMemberGroupSpy = member.addMemberGroup();
    listUsersSpy = userCenter.getUserList();
    litDBServices = dbServices.ListDBServicesTips();
    listRoleSpy = userCenter.getRoleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send add member group request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = superRender(<AddMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('添加成员组')).toBeInTheDocument();
    expect(screen.getByText('添加平台角色与操作范围')).toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('成员组名'), {
      target: { value: 'testGroup' }
    });
    selectOptionByIndex('用户名', userList[0].name ?? '', 0);
    selectOptionByIndex('用户名', userList[1].name ?? '', 0);
    fireEvent.click(screen.getByLabelText('项目管理员'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.queryByText('添加平台角色与操作范围')
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('项目管理员')).toBeChecked();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(addMemberGroupSpy).toHaveBeenCalledTimes(1);
    expect(addMemberGroupSpy).toHaveBeenCalledWith({
      member_group: {
        is_project_admin: true,
        user_uids: [userList[0].uid, userList[1].uid],
        role_with_op_ranges: undefined,
        name: 'testGroup'
      },
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member_Group,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Member_List
    );
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('should send add member group request when click submit button with role', async () => {
    const { baseElement } = superRender(<AddMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(screen.getByLabelText('成员组名'), {
      target: { value: 'testGroup' }
    });
    selectOptionByIndex('用户名', userList[0].name ?? '', 0);
    selectOptionByIndex('用户名', userList[1].name ?? '', 0);
    fireEvent.click(queryBySelector('.member-form-add-button', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('平台角色')).toBeInTheDocument();
    expect(screen.getByText('操作范围')).toBeInTheDocument();
    expect(screen.queryAllByText('平台角色')).toHaveLength(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(screen.getByLabelText('平台角色'));
    const option = screen.getAllByText(roleList[0].name ?? '')[0];
    expect(option).toHaveClass('full-width-element');
    fireEvent.click(option);
    await act(async () => jest.advanceTimersByTime(3000));
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
    expect(addMemberGroupSpy).toHaveBeenCalledTimes(1);
    expect(addMemberGroupSpy).toHaveBeenCalledWith({
      member_group: {
        is_project_admin: false,
        name: 'testGroup',
        user_uids: [userList[0].uid, userList[1].uid],
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
    const { baseElement } = superRender(<AddMemberGroup />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member_Group,
        status: false
      }
    });
  });
});
