import userCenter from '../../../../../testUtils/mockApi/userCenter';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import UpdateMember from '../UpdateMember';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import member from '../../../../../testUtils/mockApi/member';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '../../../../../testUtils/mockApi/dbServices';
import { memberList } from '../../../../../testUtils/mockApi/member/data';

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
    const { baseElement } = renderWithReduxAndTheme(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listUsersSpy).toBeCalledTimes(1);
    expect(litDBServices).toBeCalledTimes(1);
    expect(listRoleSpy).toBeCalledTimes(1);
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
    expect(updateMemberSpy).toBeCalledTimes(1);
    expect(updateMemberSpy).toBeCalledWith({
      member: {
        is_project_admin: true,
        role_with_op_ranges: undefined
      },
      member_uid: memberList[3].uid,
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member,
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

  it('should close modal when click close button', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UpdateMember />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member,
        status: false
      }
    });
  });
});
