import { useMemo, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ResponseCode } from '@actiontech/dms-kit';
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import Role from '@actiontech/shared/lib/api/base/service/Role';
import { ModalName } from '../../../../data/ModalName';
import { roleListColumns } from './column';
import {
  updateUserManageModalStatus,
  updateSelectRole
} from '../../../../store/userCenter';
import { UserCenterListEnum } from '../../index.enum';
import { IListRolesParams } from '@actiontech/shared/lib/api/base/service/Role/index.d';
import { useRequest } from 'ahooks';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { RoleListActions } from './action';
import { usePermission } from '@actiontech/shared/lib/features';

const RoleList: React.FC<{ activePage: UserCenterListEnum }> = ({
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
    refreshBySearchKeyword,
    setSearchKeyword,
    searchKeyword
  } = useTableRequestParams<IListRole, IListRolesParams>();

  const {
    data: roleList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListRolesParams = {
        ...pagination,
        fuzzy_keyword: searchKeyword
      };
      return handleTableRequestError(Role.ListRoles(params));
    },
    {
      refreshDeps: [pagination, activePage],
      ready: activePage === UserCenterListEnum.role_list
    }
  );

  const onEditRole = useCallback(
    (role?: IListRole) => {
      dispatch(updateSelectRole({ role: role ?? null }));
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.DMS_Update_Role,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onDeleteRole = useCallback(
    (role?: IListRole) => {
      Role.DelRole({
        role_uid: role?.uid || ''
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsUserCenter.role.deleteRole.deleteSuccessTips', {
              name: role?.name
            })
          );
          refresh();
        }
      });
    },
    [refresh, t, messageApi]
  );

  const onCloneRole = useCallback(
    (role?: IListRole) => {
      dispatch(updateSelectRole({ role: role ?? null }));
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.DMS_Clone_Role,
          status: true
        })
      );
    },
    [dispatch]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      RoleListActions(onEditRole, onDeleteRole, onCloneRole)
    );
  }, [parse2TableActionPermissions, onEditRole, onDeleteRole, onCloneRole]);

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
          placeholder: t('dmsUserCenter.role.roleList.searchPlaceholder')
        }}
      />
      <ActiontechTable
        rowKey="uid"
        dataSource={roleList?.list}
        pagination={{
          total: roleList?.total ?? 0
        }}
        loading={loading}
        columns={roleListColumns()}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
    </>
  );
};

export default RoleList;
