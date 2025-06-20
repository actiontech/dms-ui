import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import MemberList from '../MemberList';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import member from '@actiontech/shared/lib/testUtil/mockApi/base/member';
import { memberList } from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockCurrentUserReturn,
  mockProjectInfo
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { MemberListTypeEnum } from '../../index.enum';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/MemberList', () => {
  let memberListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let useCurrentUserSpy: jest.SpyInstance;
  let useCurrentProjectSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    memberListSpy = member.getMemberList();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useCurrentProjectSpy = mockUseCurrentProject();
    useCurrentUserSpy = mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render member table', async () => {
    const { baseElement } = superRender(
      <MemberList activePage={MemberListTypeEnum.member_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${memberList.length} 条数据`)
    ).toBeInTheDocument();
  });

  it('should render empty tips when request not success', async () => {
    memberListSpy.mockClear();
    memberListSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { baseElement } = superRender(
      <MemberList activePage={MemberListTypeEnum.member_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should handle pagination changes', async () => {
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    expect(memberListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      project_uid: mockProjectInfo.projectID
    });
  });

  it('should not make request when activePage is not member_list', async () => {
    superRender(
      <MemberList activePage={MemberListTypeEnum.member_group_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).not.toHaveBeenCalled();
  });

  it('should hide table actions based on user permissions', async () => {
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      }
    }));
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('移 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
  });

  it('should show table actions for project manager', async () => {
    useCurrentUserSpy.mockClear();
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: false
        }
      ]
    }));
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('移 除')).toHaveLength(3);
    expect(screen.queryAllByText('编 辑')).toHaveLength(3);
    expect(screen.queryAllByText('管理成员组')).toHaveLength(3);
  });

  it('should hide actions for archived project', async () => {
    useCurrentUserSpy.mockClear();
    useCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      archived: true
    }));
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: true
        }
      ]
    }));
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('移 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
  });

  it('should refresh member table when emit refresh event', async () => {
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(2);
  });

  it('should send delete member request', async () => {
    memberListSpy.mockClear();
    memberListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberList[1]]
      })
    );
    const userName = memberList[1].user?.name;
    const deleteUserSpy = member.deleteMember();
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('移 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText(`确定要移除成员:${userName}?`)).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledWith({
      member_uid: memberList[1].uid,
      project_uid: mockProjectInfo.projectID
    });
    expect(screen.getByText(`移除成员${userName}成功`)).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalled();
  });

  it('should dispatch action when edit member info', async () => {
    memberListSpy.mockClear();
    memberListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberList[0]]
      })
    );
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'member/updateSelectMember',
      payload: {
        member: memberList[0]
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member,
        status: true
      }
    });
  });

  it('should dispatch action when manage member group', async () => {
    memberListSpy.mockClear();
    memberListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberList[0]]
      })
    );
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);

    const manageButtons = screen.getAllByText('管理成员组');
    if (manageButtons.length > 0) {
      fireEvent.click(manageButtons[0]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'member/updateSelectMember',
        payload: {
          member: memberList[0]
        }
      });
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'member/updateModalStatus',
        payload: {
          modalName: ModalName.DMS_Manage_Member_Group,
          status: true
        }
      });
    }
  });
});
