import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import UpdateMember from '../UpdateMember';
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
  memberList,
  memberProjectPermissions
} from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { dbServices as dbServicesList } from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/Member/Drawer/UpdateMember', () => {
  let updateMemberSpy: jest.SpyInstance;
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
          modalStatus: { [ModalName.DMS_Update_Member]: true },
          selectMember: memberList[1]
        }
      })
    );
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    updateMemberSpy = member.updateMember();
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

  it('should render update member form with pre-filled data', async () => {
    const { baseElement } = superRender(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(getOpPermissionsSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑成员')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('700003')).toBeChecked();
    expect(screen.getByDisplayValue('700010')).toBeChecked();
    expect(screen.getByDisplayValue('700015')).toBeChecked();
  });

  it('should send update member request with project admin privileges', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    superRender(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByLabelText('是否为项目管理员'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByLabelText('是否为项目管理员')).toBeChecked();
    expect(screen.queryByText('添加项目操作权限')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(updateMemberSpy).toHaveBeenCalledTimes(1);
    expect(updateMemberSpy).toHaveBeenCalledWith({
      member: {
        is_project_admin: true,
        role_with_op_ranges: undefined,
        project_manage_permissions: undefined
      },
      member_uid: memberList[1].uid,
      project_uid: mockProjectInfo.projectID
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Member_List
    );
  });

  it('should send update member request with added role and operation range', async () => {
    const { baseElement } = superRender(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(queryBySelector('.member-form-add-button', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByDisplayValue('700003'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByDisplayValue('700003')).not.toBeChecked();

    fireEvent.click(screen.getByDisplayValue('700001'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByDisplayValue('700001')).toBeChecked();

    expect(screen.getByText('项目角色')).toBeInTheDocument();
    expect(screen.getByText('操作范围')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText('项目角色'));
    const roleOptions = screen.getAllByText('test role 1');
    const option = roleOptions.find((el) =>
      el.classList.contains('full-width-element')
    );
    fireEvent.click(option!);
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

    expect(updateMemberSpy).toHaveBeenCalledWith({
      member: {
        is_project_admin: false,
        role_with_op_ranges: [
          {
            op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
            range_uids: [firstDb.uid],
            role_uid: '1001'
          }
        ],
        project_manage_permissions: ['700001', '700010', '700015']
      },
      member_uid: memberList[1].uid,
      project_uid: mockProjectInfo.projectID
    });
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = superRender(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member,
        status: false
      }
    });
  });
});
