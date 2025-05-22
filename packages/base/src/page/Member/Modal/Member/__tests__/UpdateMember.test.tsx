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
import { memberList } from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/Member/Modal/UpdateMember', () => {
  let updateMemberSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let listUsersSpy: jest.SpyInstance;
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: { [ModalName.DMS_Update_Member]: true },
          selectMember: memberList[3]
        }
      })
    );
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    jest.useFakeTimers();
    updateMemberSpy = member.updateMember();
    listUsersSpy = userCenter.getUserList();
    litDBServices = dbServices.ListDBServicesTips();
    listRoleSpy = userCenter.getRoleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send update member request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = superRender(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑成员')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('添加平台角色与操作范围')).toBeInTheDocument();
    expect(screen.getByText('test role 1')).toBeInTheDocument();
    expect(screen.getByText('test (127.0.0.1:3306)')).toBeInTheDocument();
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
    expect(updateMemberSpy).toHaveBeenCalledTimes(1);
    expect(updateMemberSpy).toHaveBeenCalledWith({
      member: {
        is_project_admin: true,
        role_with_op_ranges: undefined
      },
      member_uid: memberList[3].uid,
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
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = superRender(<UpdateMember />);
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
