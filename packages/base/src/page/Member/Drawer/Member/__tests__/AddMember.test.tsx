import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import {
  userList,
  roleList
} from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter/data';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import AddMember from '../AddMember';
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
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { memberProjectPermissions } from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/Member/Drawer/AddMember', () => {
  let addMemberSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let listUsersSpy: jest.SpyInstance;
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  let getOpPermissionsSpy: jest.SpyInstance;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: { modalStatus: { [ModalName.DMS_Add_Member]: true } }
      })
    );
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(true)
      },
      {
        useSpyOnMockHooks: true
      }
    );
    jest.useFakeTimers();
    addMemberSpy = member.addMember();
    listUsersSpy = userCenter.getUserList();
    litDBServices = dbServices.ListDBServicesTips();
    listRoleSpy = userCenter.getRoleList();

    getOpPermissionsSpy = userCenter.getOpPermissionsList();
    getOpPermissionsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: memberProjectPermissions
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
    dispatchSpy.mockClear();
  });

  it('should render add member form with all fields', async () => {
    const { baseElement } = superRender(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(getOpPermissionsSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('添加成员')).toBeInTheDocument();
    expect(screen.getByText('用户名称')).toBeInTheDocument();
    expect(screen.getByText('是否为项目管理员')).toBeInTheDocument();
    expect(screen.getByText('项目管理权限')).toBeInTheDocument();
    expect(screen.getByText('项目操作权限')).toBeInTheDocument();
    expect(screen.getByText('添加项目操作权限')).toBeInTheDocument();
  });

  it('should send add member request with project admin privileges', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    superRender(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('用户名称', userList[0].name ?? '', 0);
    fireEvent.click(screen.getByLabelText('是否为项目管理员'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByLabelText('是否为项目管理员')).toBeChecked();
    expect(screen.queryByText('添加项目操作权限')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(addMemberSpy).toHaveBeenCalledTimes(1);
    expect(addMemberSpy).toHaveBeenCalledWith({
      member: {
        is_project_admin: true,
        user_uid: userList[0].uid,
        role_with_op_ranges: undefined,
        project_manage_permissions: undefined
      },
      project_uid: mockProjectInfo.projectID
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Member_List
    );
  });

  it('should send add member request with both management permissions and roles', async () => {
    const { baseElement } = superRender(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('用户名称', userList[0].name ?? '', 0);

    fireEvent.click(screen.getByDisplayValue('700003'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(queryBySelector('.member-form-add-button', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('项目角色'));
    const option = screen.getAllByText(roleList[0].name ?? '')[0];
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

    expect(addMemberSpy).toHaveBeenCalledWith({
      member: {
        is_project_admin: false,
        user_uid: userList[0].uid,
        role_with_op_ranges: [
          {
            op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
            range_uids: [firstDb.uid],
            role_uid: roleList[0].uid
          }
        ],
        project_manage_permissions: ['700003']
      },
      project_uid: mockProjectInfo.projectID
    });
  });

  it('should reset form and close modal when click close button', async () => {
    const { baseElement } = superRender(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('用户名称', userList[0].name ?? '', 0);
    fireEvent.click(screen.getByDisplayValue('700003'));

    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member,
        status: false
      }
    });
  });

  it('should disable project operation permissions when project admin is enabled', async () => {
    superRender(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('用户名称', userList[0].name ?? '', 0);

    expect(screen.getByText('添加项目操作权限')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('是否为项目管理员'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.queryByText('添加项目操作权限')).not.toBeInTheDocument();
    expect(
      screen.getByText('项目管理员默认拥有项目下所有管理权限')
    ).toBeInTheDocument();
  });
});
