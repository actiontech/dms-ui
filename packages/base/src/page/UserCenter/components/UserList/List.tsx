import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar,
  ColumnsSettingProps,
  FilterCustomProps,
  useTableFilterContainer,
  TableFilterContainer
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { ResponseCode } from '@actiontech/dms-kit';
import { IListUser } from '@actiontech/shared/lib/api/base/service/common';
import { IListUsersParams } from '@actiontech/shared/lib/api/base/service/User/index.d';
import User from '@actiontech/shared/lib/api/base/service/User';
import { UserCenterListEnum } from '../../index.enum';
import {
  updateSelectUser,
  updateUserManageModalStatus
} from '../../../../store/userCenter';
import { UserListColumns } from './column';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useCurrentUser, usePermission } from '@actiontech/shared/lib/features';
import { UserListActions } from './action';
import {
  ListUsersFilterByStatEnum,
  ListUsersFilterByAuthenticationTypeEnum
} from '@actiontech/shared/lib/api/base/service/User/index.enum';

const UserList: React.FC<{ activePage: UserCenterListEnum }> = ({
  activePage
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();
  const { parse2TableActionPermissions } = usePermission();

  const dispatch = useDispatch();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    pagination,
    tableChange,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword,
    updateTableFilterInfo,
    tableFilterInfo
  } = useTableRequestParams<IListUser, IListUsersParams>();

  const { username } = useCurrentUser();

  const {
    data: userList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListUsersParams = {
        ...pagination,
        ...tableFilterInfo,
        fuzzy_keyword: searchKeyword
      };
      return handleTableRequestError(User.ListUsers(params));
    },
    {
      refreshDeps: [pagination, activePage, tableFilterInfo],
      ready: UserCenterListEnum.user_list === activePage
    }
  );

  const onEditUser = useCallback(
    (user?: IListUser) => {
      dispatch(
        updateSelectUser({
          user: user ?? null
        })
      );
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.DMS_Update_User,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onDeleteUser = useCallback(
    (record?: IListUser) => {
      User.DelUser({ user_uid: record?.uid ?? '' }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsUserCenter.user.deleteUser.deleteSuccess', {
              username: record?.name ?? ''
            })
          );
          refresh();
        }
      });
    },
    [refresh, t, messageApi]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      UserListActions(onEditUser, onDeleteUser, username)
    );
  }, [parse2TableActionPermissions, onEditUser, onDeleteUser, username]);

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'user_list',
      username: username
    }),
    [username]
  );

  const columns = useMemo(() => {
    return UserListColumns();
  }, []);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListUser, FilterCustomProps>([
      [
        'stat',
        {
          options: [
            {
              label: t('dmsUserCenter.user.userList.normal'),
              value: ListUsersFilterByStatEnum.Normal
            },
            {
              label: t('dmsUserCenter.user.userList.disabled'),
              value: ListUsersFilterByStatEnum.Disabled
            }
          ]
        }
      ],
      [
        'authentication_type',
        {
          options: Object.keys(ListUsersFilterByAuthenticationTypeEnum).map(
            (key) => ({
              label: key,
              value: key
            })
          )
        }
      ]
    ]);
  }, [t]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<IListUser, IListUsersParams>(
      columns,
      updateTableFilterInfo
    );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_User_Center_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <TableToolbar
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          },
          placeholder: t('dmsUserCenter.user.userList.searchPlaceholder'),
          style: {
            width: '300px'
          }
        }}
        setting={tableSetting}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        rowKey="uid"
        setting={tableSetting}
        dataSource={userList?.list}
        pagination={{
          total: userList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
        scroll={{}}
      />
    </>
  );
};

export default UserList;
