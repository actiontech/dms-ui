import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import Member from '..';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import member from '@actiontech/shared/lib/testUtil/mockApi/base/member';
import { memberList } from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockCurrentUserReturn,
  mockProjectInfo
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import { SystemRole } from '@actiontech/dms-kit';

describe('base/Member', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    member.mockAllApi();
    mockUseCurrentProject();
    userCenter.getUserList();
    dbServices.ListDBServicesTips();
    userCenter.getRoleList();
    userCenter.getOpPermissionsList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render member list when it first entered the member page', async () => {
    const memberListSpy = member.getMemberList();
    const { baseElement } = superRender(<Member />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${memberList.length} 条数据`)
    ).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(
      getBySelector('.ant-segmented-group', baseElement)
    ).toBeInTheDocument();
  });

  it('should receive "DMS_Refresh_Member_List" event when click refresh icon', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const memberListSpy = member.getMemberList();
    const { baseElement } = superRender(<Member />);
    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(2);
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Member_List
    );
  });

  it('should update content when change segmented value', async () => {
    const memberGroupListSpy = member.getMemberGroupList();
    const { baseElement } = superRender(<Member />);
    fireEvent.click(screen.getByText('成员组列表'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(memberGroupListSpy).toHaveBeenCalledTimes(1);
  });

  it('should render add button when current user is admin or project manager', async () => {
    const mockUseCurrentUserSpy = mockUseCurrentUser();
    const { baseElement } = superRender(<Member />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('添加成员')).toHaveLength(1);
    fireEvent.click(screen.getByText('添加成员'));
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryAllByText('添加成员')).toHaveLength(2);
    cleanup();
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => {
      return {
        ...mockCurrentUserReturn,
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.admin]: false,
          [SystemRole.systemAdministrator]: false
        },
        bindProjects: [
          {
            project_id: mockProjectInfo.projectID,
            project_name: mockProjectInfo.projectName,
            is_manager: true,
            archived: false
          }
        ]
      };
    });
    superRender(<Member />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('添加成员')).toHaveLength(1);
    cleanup();
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => {
      return {
        ...mockCurrentUserReturn,
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.admin]: false,
          [SystemRole.systemAdministrator]: false
        }
      };
    });
    superRender(<Member />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('添加成员')).not.toBeInTheDocument();

    cleanup();
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => {
      return {
        ...mockCurrentUserReturn,
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.admin]: false,
          [SystemRole.systemAdministrator]: false
        },
        bindProjects: [
          {
            project_id: mockProjectInfo.projectID,
            project_name: mockProjectInfo.projectName,
            is_manager: true,
            archived: true
          }
        ]
      };
    });
    superRender(<Member />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('添加成员')).not.toBeInTheDocument();
  });
});
