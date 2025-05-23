import { renderHook, act, screen, fireEvent } from '@testing-library/react';
import useCheckMemberGroupAuth from '../useCheckMemberGroupAuth';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import dbAccountService from 'provision/src/testUtil/mockApi/dbAccountService';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { paramsSerializer } from '@actiontech/shared';
import { baseSuperRender } from '../../../../../../../testUtils/superRender';
import { useState } from 'react';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('useCheckMemberGroupAuth', () => {
  const mockUserUids = ['user1', 'user2'];
  const mockMemberGroupUid = 'group1';
  const mockMemberGroupName = 'Test Group';

  const mockDbAccountListWithFilterUsers = [
    {
      db_service: {
        uid: 'service1',
        name: 'Oracle-prod'
      },
      db_account_uid: 'account1',
      account_info: {
        name: 'account1'
      },
      auth_users: [
        {
          uid: 'user1',
          name: 'User 1'
        }
      ],
      auth_user_groups: []
    }
  ];

  const mockDbAccountListWithFilterUserGroup = [
    {
      db_service: {
        uid: 'service1',
        name: 'Oracle-prod'
      },
      db_account_uid: 'account2',
      account_info: {
        name: 'account2'
      },
      auth_users: [],
      auth_user_groups: []
    }
  ];

  // 多个用户冲突的场景
  const mockMultipleUsersConflict = [
    {
      db_service: {
        uid: 'service1',
        name: 'Oracle-prod'
      },
      db_account_uid: 'account1',
      account_info: {
        name: 'account1'
      },
      auth_users: [
        {
          uid: 'user1',
          name: 'User 1'
        },
        {
          uid: 'user2',
          name: 'User 2'
        }
      ],
      auth_user_groups: []
    }
  ];

  // 多个数据源冲突的场景
  const mockMultipleServicesConflict = [
    {
      db_service: {
        uid: 'service1',
        name: 'Oracle-prod'
      },
      db_account_uid: 'account1',
      account_info: {
        name: 'account1'
      },
      auth_users: [
        {
          uid: 'user1',
          name: 'User 1'
        }
      ],
      auth_user_groups: []
    },
    {
      db_service: {
        uid: 'service2',
        name: 'MySQL-prod'
      },
      db_account_uid: 'account3',
      account_info: {
        name: 'account3'
      },
      auth_users: [
        {
          uid: 'user1',
          name: 'User 1'
        }
      ],
      auth_user_groups: []
    }
  ];

  let mockAuthListDBAccount: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockAuthListDBAccount = dbAccountService.authListDBAccount();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should handle loading state correctly', async () => {
    mockAuthListDBAccount
      .mockImplementationOnce(() => createSpySuccessResponse({ data: [] }))
      .mockImplementationOnce(() => createSpySuccessResponse({ data: [] }));

    const { result } = renderHook(() => useCheckMemberGroupAuth());
    expect(result.current.loading).toBe(false);

    let checkPromise: Promise<boolean>;
    act(() => {
      checkPromise = result.current.checkMemberGroupAuth({
        userUids: mockUserUids,
        memberGroupUid: mockMemberGroupUid,
        memberGroupName: mockMemberGroupName
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(3000);
      return await checkPromise;
    });

    expect(result.current.loading).toBe(false);
    expect(mockAuthListDBAccount).toHaveBeenCalledTimes(2);
    expect(mockAuthListDBAccount).toHaveBeenNthCalledWith(
      1,
      {
        page_size: 9999,
        page_index: 1,
        filter_by_users: mockUserUids,
        project_uid: mockProjectInfo.projectID
      },
      {
        paramsSerializer
      }
    );
    expect(mockAuthListDBAccount).toHaveBeenNthCalledWith(2, {
      page_size: 9999,
      page_index: 1,
      filter_by_user_group: mockMemberGroupUid,
      project_uid: mockProjectInfo.projectID
    });
  });

  it('should return true when no auth conflicts exist', async () => {
    mockAuthListDBAccount
      .mockImplementationOnce(() => createSpySuccessResponse({ data: [] }))
      .mockImplementationOnce(() => createSpySuccessResponse({ data: [] }));

    const { result } = renderHook(() => useCheckMemberGroupAuth());
    let checkResult = false;
    let checkPromise: Promise<boolean>;

    await act(async () => {
      checkPromise = result.current.checkMemberGroupAuth({
        userUids: mockUserUids,
        memberGroupUid: mockMemberGroupUid,
        memberGroupName: mockMemberGroupName
      });
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
      checkResult = await checkPromise;
    });

    expect(mockAuthListDBAccount).toHaveBeenCalledTimes(2);
    expect(mockAuthListDBAccount).toHaveBeenNthCalledWith(
      1,
      {
        page_size: 9999,
        page_index: 1,
        filter_by_users: mockUserUids,
        project_uid: mockProjectInfo.projectID
      },
      {
        paramsSerializer
      }
    );
    expect(mockAuthListDBAccount).toHaveBeenNthCalledWith(2, {
      page_size: 9999,
      page_index: 1,
      filter_by_user_group: mockMemberGroupUid,
      project_uid: mockProjectInfo.projectID
    });
    expect(checkResult).toBe(true);
  });

  it('should handle different auth conflict scenarios', async () => {
    const Wrapper = () => {
      const { checkMemberGroupAuth, loading, contextHolder } =
        useCheckMemberGroupAuth();

      const [result, setResult] = useState<boolean>(false);
      return (
        <>
          {contextHolder}
          {result ? <div>pass</div> : <div>error</div>}
          <button
            disabled={loading}
            onClick={async () =>
              setResult(
                await checkMemberGroupAuth({
                  userUids: mockUserUids,
                  memberGroupUid: mockMemberGroupUid,
                  memberGroupName: mockMemberGroupName
                })
              )
            }
          >
            点击
          </button>
        </>
      );
    };

    const { baseElement } = baseSuperRender(<Wrapper />);
    mockAuthListDBAccount
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockDbAccountListWithFilterUsers })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockDbAccountListWithFilterUserGroup })
      );

    await act(async () => {
      fireEvent.click(screen.getByText('点击'));
      jest.advanceTimersByTime(3000);
    });
    expect(baseElement).toMatchSnapshot('single-user-conflict');
    expect(screen.queryByText('error')).toBeInTheDocument();

    mockAuthListDBAccount
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockMultipleUsersConflict })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockDbAccountListWithFilterUserGroup })
      );

    await act(async () => {
      fireEvent.click(screen.getByText('点击'));
      jest.advanceTimersByTime(3000);
    });
    expect(baseElement).toMatchSnapshot('multiple-users-conflict');

    mockAuthListDBAccount
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockMultipleServicesConflict })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({ data: mockDbAccountListWithFilterUserGroup })
      );

    await act(async () => {
      fireEvent.click(screen.getByText('点击'));
      jest.advanceTimersByTime(3000);
    });
    expect(baseElement).toMatchSnapshot('multiple-services-conflict');
  });

  it('should handle API failed gracefully', async () => {
    mockAuthListDBAccount.mockImplementation(() => createSpyFailResponse({}));
    const { result } = renderHook(() => useCheckMemberGroupAuth());

    let checkResult = true;
    let checkPromise: Promise<boolean>;

    await act(async () => {
      checkPromise = result.current.checkMemberGroupAuth({
        userUids: mockUserUids,
        memberGroupUid: mockMemberGroupUid,
        memberGroupName: mockMemberGroupName
      });
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
      checkResult = await checkPromise;
    });

    expect(checkResult).toBe(false);
  });
});
