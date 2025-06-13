import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import member from '@actiontech/shared/lib/testUtil/mockApi/base/member';
import {
  memberGroupList,
  memberList
} from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';
import { ModalName } from '../../../../../data/ModalName';
import ManageMemberGroup from '../ManageMemberGroup';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/Member/Modal/ManageMemberGroup', () => {
  let listMemberGroupsSpy: jest.SpyInstance;
  let updateMemberGroupSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: { [ModalName.DMS_Manage_Member_Group]: true },
          selectMember: memberList[1]
        }
      })
    );
    mockUseCurrentProject();
    jest.useFakeTimers();

    listMemberGroupsSpy = member.getMemberGroupList();
    updateMemberGroupSpy = member.updateMemberGroup();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render manage member group modal with member groups', async () => {
    listMemberGroupsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberGroupList[2]]
      })
    );

    const { baseElement } = superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listMemberGroupsSpy).toHaveBeenCalledWith({
      page_size: 1000,
      project_uid: mockProjectInfo.projectID
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理成员组')).toBeInTheDocument();
    expect(screen.getByText('member-group3')).toBeInTheDocument();
    expect(screen.getByText('test role 1')).toBeInTheDocument();
    expect(screen.getByText('编辑权限')).toBeInTheDocument();
    expect(screen.getByText('退出组')).toBeInTheDocument();
  });

  it('should render empty state when user has no member groups', async () => {
    listMemberGroupsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('暂无成员组')).toBeInTheDocument();
  });

  it('should handle edit permissions action', async () => {
    listMemberGroupsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberGroupList[2]]
      })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('编辑权限'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member_Group,
        status: true
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateSelectMemberGroup',
      payload: {
        memberGroup: memberGroupList[2]
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Manage_Member_Group,
        status: false
      }
    });
  });

  it('should handle exit group action', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    listMemberGroupsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberGroupList[2]]
      })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('退出组'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('确定要退出成员组"member-group3"吗？')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateMemberGroupSpy).toHaveBeenCalledWith({
      member_group_uid: memberGroupList[2].uid,
      project_uid: mockProjectInfo.projectID,
      member_group: {
        is_project_admin: false,
        role_with_op_ranges: [
          {
            op_range_type: 'db_service',
            range_uids: ['123123'],
            role_uid: '1001'
          }
        ],
        user_uids: ['1647895752866795520']
      }
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('已退出成员组: member-group3')).toBeInTheDocument();
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Member_List
    );
  });

  it('should render permissions correctly', async () => {
    const memberGroupWithMultipleRoles = {
      ...memberGroupList[0],
      users: [memberList[1].user!]
    };

    listMemberGroupsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberGroupWithMultipleRoles]
      })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('Role1')).toBeInTheDocument();
  });

  it('should render dash when no permissions', async () => {
    const memberGroupWithoutRoles = {
      ...memberGroupList[2],
      role_with_op_ranges: [],
      users: [memberList[1].user!]
    };

    listMemberGroupsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberGroupWithoutRoles]
      })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should close modal when click close button', async () => {
    listMemberGroupsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Manage_Member_Group,
        status: false
      }
    });
  });

  it('should not fetch member groups when modal is not visible', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: { [ModalName.DMS_Manage_Member_Group]: false },
          selectMember: memberList[1]
        }
      })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listMemberGroupsSpy).not.toHaveBeenCalled();
  });

  it('should not fetch member groups when no selected member', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: { [ModalName.DMS_Manage_Member_Group]: true },
          selectMember: null
        }
      })
    );

    superRender(<ManageMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listMemberGroupsSpy).not.toHaveBeenCalled();
  });
});
