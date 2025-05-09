import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '../../../../testUtil/mockApi/dbAccountService';
import { dbAccountMockData } from '../../../../testUtil/mockApi/dbAccountService/data';
import auth from '../../../../testUtil/mockApi/auth';
import EventEmitter from '../../../../utils/EventEmitter';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '../../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import AccountAuthorizeModal from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { IListMemberGroup } from '@actiontech/shared/lib/api/base/service/common';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { MemberGroupService } from '@actiontech/shared/lib/api/base';

describe('provision/DatabaseAccount/AccountAuthorizeModal', () => {
  let listUsersSpy: jest.SpyInstance;
  let authUpdateDBAccountSpy: jest.SpyInstance;
  let authListMemberGroupSpy: jest.SpyInstance;
  const memberGroupList: IListMemberGroup[] = [
    {
      is_project_admin: true,
      name: 'member-group1',
      role_with_op_ranges: [
        {
          op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
          range_uids: [
            { uid: '701', name: 'Range1' },
            { uid: '702', name: 'Range2' }
          ],
          role_uid: { uid: '5001', name: 'Role1' }
        }
      ],
      uid: '10029384',
      users: [
        {
          uid: '100283',
          name: 'test1'
        },
        {
          uid: '102393',
          name: 'test2'
        }
      ]
    }
  ];
  const mockDatabaseAccountInfo = dbAccountMockData[0];

  beforeEach(() => {
    listUsersSpy = auth.listUsers();
    authUpdateDBAccountSpy = dbAccountService.authUpdateDBAccount();
    auth.mockAllApi();
    mockUseCurrentProject();
    authListMemberGroupSpy = jest
      .spyOn(MemberGroupService, 'ListMemberGroups')
      .mockImplementation(() =>
        createSpySuccessResponse({ data: memberGroupList })
      );

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (
    defaultVisible = true,
    selectData: IListDBAccount = mockDatabaseAccountInfo
  ) => {
    return superRender(<AccountAuthorizeModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [ModalName.DatabaseAccountAuthorizeModal]: defaultVisible
          });
          set(DatabaseAccountSelectData, selectData);
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(authListMemberGroupSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).not.toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('账号授权')).toBeInTheDocument();
  });

  it('render update auth user', async () => {
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true, {
      ...mockDatabaseAccountInfo,
      auth_users: [
        {
          name: 'Kari Bode',
          uid: '67483'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`当前账号: test1@%`)).toBeInTheDocument();
    expect(screen.getByText(`Kari Bode`)).toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#userId'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('Dewey Connelly')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Dewey Connelly'));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        permission_users: {
          permission_user_uids: ['67483', '85315']
        },
        permission_user_groups: {
          permission_user_group_uids: [
            '1267103833235787773',
            '1267103833235787774'
          ]
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('授权成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render update auth user group', async () => {
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true, {
      ...mockDatabaseAccountInfo,
      auth_users: [
        {
          name: 'Kari Bode',
          uid: '67483'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`当前账号: test1@%`)).toBeInTheDocument();
    expect(screen.getByText(`Kari Bode`)).toBeInTheDocument();

    fireEvent.click(screen.getByText('授权成员组'));

    fireEvent.mouseDown(getBySelector('#memberGroupUid'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('member-group1'));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        permission_users: {
          permission_user_uids: ['67483']
        },
        permission_user_groups: {
          permission_user_group_uids: [
            '1267103833235787773',
            '1267103833235787774',
            '10029384'
          ]
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('授权成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render no auth users', async () => {
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true, {
      ...mockDatabaseAccountInfo,
      auth_users: [],
      auth_user_groups: []
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`当前账号: test1@%`)).toBeInTheDocument();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        permission_users: {
          permission_user_uids: []
        },
        permission_user_groups: {
          permission_user_group_uids: []
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('授权成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render update account failed', async () => {
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    authUpdateDBAccountSpy.mockClear();
    authUpdateDBAccountSpy.mockImplementation(() => createSpyFailResponse({}));
    customRender(true, {
      ...mockDatabaseAccountInfo,
      auth_users: []
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#userId'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('Dewey Connelly')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Dewey Connelly'));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        permission_users: {
          permission_user_uids: ['85315']
        },
        permission_user_groups: {
          permission_user_group_uids: [
            '1267103833235787773',
            '1267103833235787774'
          ]
        }
      }
    });
    expect(screen.getByText('提 交').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitterSpy).not.toHaveBeenCalled();
    expect(screen.getByText('提 交').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));
  });
});
