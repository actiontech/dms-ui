import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import MemberList from '../MemberList';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import member from '../../../../testUtils/mockApi/member';
import { memberList } from '../../../../testUtils/mockApi/member/data';
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

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render member table', async () => {
    const { baseElement } = superRender(
      <MemberList activePage={MemberListTypeEnum.member_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
    expect(
      screen.getByText(`共 ${memberList.length} 条数据`)
    ).toBeInTheDocument();
    expect(screen.getAllByText('删 除')).toHaveLength(4);
    expect(screen.getAllByText('删 除')[0]).not.toBeVisible();
    expect(screen.getAllByText('编 辑')).toHaveLength(4);
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

  it('should hide table actions', async () => {
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      }
    }));
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
    useCurrentUserSpy.mockClear();
    cleanup();
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
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
    expect(screen.queryAllByText('删 除')).toHaveLength(4);
    expect(screen.queryAllByText('编 辑')).toHaveLength(4);
    useCurrentUserSpy.mockClear();
    cleanup();
    useCurrentProjectSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
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
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
  });

  it('should refresh member table when emit "DMS_Refresh_Member_List" event', async () => {
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
    const userName = memberList[1].user.name;
    const deleteUserSpy = member.deleteMember();
    superRender(<MemberList activePage={MemberListTypeEnum.member_list} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText(`确定要删除成员:${userName}?`)).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledWith({
      member_uid: memberList[1].uid,
      project_uid: mockProjectInfo.projectID
    });
    expect(screen.getByText(`删除成员${userName}成功`)).toBeInTheDocument();
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
});
