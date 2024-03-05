import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import MemberGroupList from '../MemberGroupList';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import member from '../../../../testUtils/mockApi/member';
import { memberGroupList } from '../../../../testUtils/mockApi/member/data';
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

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/MemberGroupList', () => {
  let memberGroupListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let useCurrentUserSpy: jest.SpyInstance;
  let useCurrentProjectSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    memberGroupListSpy = member.getMemberGroupList();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useCurrentProjectSpy = mockUseCurrentProject();
    useCurrentUserSpy = mockUseCurrentUser();
  });

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render member group table', async () => {
    const { baseElement } = renderWithReduxAndTheme(<MemberGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberGroupListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('member-group1')).toBeInTheDocument();
    expect(screen.getByText('member-group2')).toBeInTheDocument();
    expect(
      screen.getByText(`共 ${memberGroupList.length} 条数据`)
    ).toBeInTheDocument();
    expect(screen.getAllByText('删 除')).toHaveLength(4);
    expect(screen.getAllByText('编 辑')).toHaveLength(4);
  });

  it('should render empty tips when request not success', async () => {
    memberGroupListSpy.mockClear();
    memberGroupListSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { baseElement } = renderWithReduxAndTheme(<MemberGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should hide table actions', async () => {
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      isAdmin: false
    }));
    renderWithReduxAndTheme(<MemberGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
    useCurrentUserSpy.mockClear();
    cleanup();
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      isProjectManager: jest.fn().mockImplementation(() => true),
      isAdmin: false
    }));
    renderWithReduxAndTheme(<MemberGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(4);
    expect(screen.queryAllByText('编 辑')).toHaveLength(4);
    useCurrentUserSpy.mockClear();
    cleanup();
    useCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      projectArchive: true
    }));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
  });

  it('should refresh member group table when emit "DMS_Refresh_Member_List" event', async () => {
    renderWithReduxAndTheme(<MemberGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberGroupListSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberGroupListSpy).toHaveBeenCalledTimes(2);
  });

  it('should send delete member request', async () => {
    memberGroupListSpy.mockClear();
    memberGroupListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberGroupList[1]]
      })
    );
    const memberGroupName = memberGroupList[1].name;
    const deleteUserSpy = member.deleteMemberGroup();
    renderWithReduxAndTheme(<MemberGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberGroupListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(`确定要删除成员组:${memberGroupName}?`)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledWith({
      member_group_uid: memberGroupList[1].uid,
      project_uid: mockProjectInfo.projectID
    });
    expect(
      screen.getByText(`删除成员组${memberGroupName}成功`)
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberGroupListSpy).toHaveBeenCalled();
  });
  it('should dispatch action when edit member group info', async () => {
    memberGroupListSpy.mockClear();
    memberGroupListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [memberGroupList[0]]
      })
    );
    renderWithReduxAndTheme(<MemberGroupList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberGroupListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'member/updateSelectMemberGroup',
      payload: {
        memberGroup: memberGroupList[0]
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Member_Group,
        status: true
      }
    });
  });
});
