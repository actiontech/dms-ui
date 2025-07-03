import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import UpdateMemberGroup from '../UpdateMemberGroup';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import member from '@actiontech/shared/lib/testUtil/mockApi/base/member';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import {
  memberGroupList,
  memberProjectPermissions
} from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/Member/Drawer/UpdateMemberGroup', () => {
  let updateMemberGroup: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let listUsersSpy: jest.SpyInstance;
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  let getOpPermissionsSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: { [ModalName.DMS_Update_Member_Group]: true },
          selectMemberGroup: memberGroupList[2]
        }
      })
    );
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    updateMemberGroup = member.updateMemberGroup();
    listUsersSpy = userCenter.getUserList();
    litDBServices = dbServices.ListDBServicesTips();
    listRoleSpy = userCenter.getRoleList();

    getOpPermissionsSpy = userCenter.getOpPermissionsList();
    getOpPermissionsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: memberProjectPermissions })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render update member group form with pre-filled data', async () => {
    const { baseElement } = superRender(<UpdateMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(getOpPermissionsSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('更新成员组')).toBeInTheDocument();
    expect(screen.getByText('添加项目操作权限')).toBeInTheDocument();
    expect(screen.getByText('test role 1')).toBeInTheDocument();
    expect(screen.getByText('test (127.0.0.1:3306)')).toBeInTheDocument();

    expect(screen.getByDisplayValue('700003')).toBeChecked();
    expect(screen.getByDisplayValue('700010')).toBeChecked();
  });

  it('should send update member group request with modified project management permissions', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    superRender(<UpdateMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByDisplayValue('700003'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByDisplayValue('700003')).not.toBeChecked();

    fireEvent.click(screen.getByDisplayValue('700001'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByDisplayValue('700001')).toBeChecked();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateMemberGroup).toHaveBeenCalledWith({
      member_group: {
        is_project_admin: false,
        role_with_op_ranges: [
          {
            op_range_type: 'db_service',
            range_uids: ['123123'],
            role_uid: '1001'
          }
        ],
        user_uids: ['11132422', '1647895752866795520'],
        project_manage_permissions: ['700001', '700010']
      },
      member_group_uid: memberGroupList[2].uid,
      project_uid: mockProjectInfo.projectID
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Member_List
    );
  });

  it('should send update member group request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = superRender(<UpdateMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('更新成员组')).toBeInTheDocument();
    expect(screen.getByText('添加项目操作权限')).toBeInTheDocument();
    expect(screen.getByText('test role 1')).toBeInTheDocument();
    expect(screen.getByText('test (127.0.0.1:3306)')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('是否为项目管理员'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.queryByText('添加项目操作权限')).not.toBeInTheDocument();
    expect(screen.getByLabelText('是否为项目管理员')).toBeChecked();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(updateMemberGroup).toHaveBeenCalledTimes(1);
    expect(updateMemberGroup).toHaveBeenCalledWith({
      member_group: {
        is_project_admin: true,
        role_with_op_ranges: undefined,
        user_uids: ['11132422', '1647895752866795520']
      },
      member_group_uid: memberGroupList[2].uid,
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member_Group,
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

  it('should close modal when click close button', async () => {
    const { baseElement } = superRender(<UpdateMemberGroup />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member_Group,
        status: false
      }
    });
  });
});
