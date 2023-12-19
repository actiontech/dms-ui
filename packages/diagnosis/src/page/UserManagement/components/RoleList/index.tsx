import { useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { RoleListColumns, RoleListActions } from './index.data';
import useUserManagementRedux from '../../hooks/useUserManagementRedux';
import auth from '../../../../api/auth';
import { IV1ListRolesParams } from '../../../../api/auth/index.d';
import { IViewRoleReply } from '../../../../api/common';
import RoleModal from './components';
import { SegmentedValue } from 'antd/es/segmented';
import { UserManagementTypeEnum } from '../../index.type';

const RoleList: React.FC<{ handleChange: (key: SegmentedValue) => void }> = ({
  handleChange
}) => {
  const { t } = useTranslation();

  const { setModalStatus, setSelectRoleData, setPermissionRoleId } =
    useUserManagementRedux();

  const [messageApi, contextHolder] = message.useMessage();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IViewRoleReply,
    IV1ListRolesParams
  >();

  const {
    data: roleList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IV1ListRolesParams = {
        ...pagination
      };
      return handleTableRequestError(auth.V1ListRoles(params));
    },
    {
      refreshDeps: [pagination]
    }
  );

  const onEditRole = useCallback((record?: IViewRoleReply) => {
    setSelectRoleData(record ?? null);
    setModalStatus(ModalName.Update_Role, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteRole = useCallback(
    (record?: IViewRoleReply) => {
      const hideLoading = messageApi.loading(
        t('userManagement.role.deleteRole.deleting', {
          name: record?.role_name
        }),
        0
      );
      auth
        .V1DeleteRole({ role_id: record?.id ?? '' })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success({
              content: t('userManagement.role.deleteRole.deleteSuccessTips', {
                name: record?.role_name ?? ''
              })
            });
            refresh();
          }
        })
        .finally(() => hideLoading());
    },
    [refresh, t, messageApi]
  );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_User_Management,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  const onCheckRolePermission = (id?: string) => {
    if (id) {
      setPermissionRoleId(id);
      handleChange(UserManagementTypeEnum.permission_list);
    }
  };

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey="id"
        dataSource={roleList?.list ?? []}
        pagination={{
          total: roleList?.total ?? 0
        }}
        loading={loading}
        columns={RoleListColumns(onCheckRolePermission)}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={RoleListActions(onEditRole, onDeleteRole)}
      />
      <RoleModal />
    </>
  );
};

export default RoleList;
