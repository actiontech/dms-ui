import { BasicButton, BasicDrawer } from '@actiontech/shared';
import useModalStatus from '../../../../hooks/useModalStatus';
import {
  DatabaseRoleFilteredDBServiceID,
  DatabaseRoleModalStatus,
  DatabaseRoleSelectData
} from '../../../../store/databaseRole';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import { useTranslation } from 'react-i18next';
import { Form, message, Space, Spin } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import DbRoleService from '@actiontech/shared/lib/api/provision/service/db_role';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../utils/EventEmitter';
import { IDatabaseRoleFormFields } from '../Common/index.type';
import RoleForm from '../Common/RoleForm';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  IDataPermissionForRole,
  IDBAccountDataPermission
} from '@actiontech/shared/lib/api/provision/service/common';

const UpdateRole: React.FC = () => {
  const { t } = useTranslation();
  const { toggleModal, visible } = useModalStatus(
    DatabaseRoleModalStatus,
    ModalName.DatabaseRoleUpdateModal
  );
  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<IDatabaseRoleFormFields>();

  const [messageApi, contextHolder] = message.useMessage();
  const [selectData, updateSelectData] = useRecoilState(DatabaseRoleSelectData);
  const [filteredByDBServiceID] = useRecoilState(
    DatabaseRoleFilteredDBServiceID
  );

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const submit = async () => {
    const values = await form.validateFields();
    startSubmit();

    const dataPermissions = values.operationsPermissions?.reduce<
      IDataPermissionForRole[]
    >((acc, cur) => {
      const operationIDs = [cur[0]];
      const objectIDs = cur.length > 1 ? cur.slice(1, cur.length) : [];

      const dataPermissionForRole: IDataPermissionForRole = {
        data_object_uids: objectIDs,
        data_operation_uids: operationIDs
      };
      return [...acc, dataPermissionForRole];
    }, []);

    DbRoleService.AuthUpdateDBRole({
      project_uid: projectID,
      db_role_uid: selectData?.db_role?.uid ?? '',
      db_service_uid: filteredByDBServiceID ?? '',
      db_role: {
        child_roles: values.dbRoles,
        data_permissions: dataPermissions
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          EventEmitter.emit(EventEmitterKey.Refresh_Database_Role_List_Table);
          messageApi.success(t('databaseRole.actions.update.succeedTips'));
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const onClose = () => {
    form.resetFields();
    toggleModal(ModalName.DatabaseRoleUpdateModal, false);
    updateSelectData(null);
  };

  const { data: dbRoleDetailInfo, loading: getDBRoleDetailInfoPending } =
    useRequest(
      () =>
        DbRoleService.AuthDBRoleDetail({
          project_uid: projectID,
          db_role_uid: selectData?.db_role?.uid ?? '',
          db_service_uid: filteredByDBServiceID ?? ''
        }).then((res) => res.data.data),
      {
        ready: !!selectData?.db_role?.uid && visible && !!filteredByDBServiceID
      }
    );

  useEffect(() => {
    const generateOperationsPermissionValues = (
      dataPermissions?: IDBAccountDataPermission[]
    ): string[][] => {
      return (
        dataPermissions?.flatMap((permission) => {
          const { data_objects, data_operations = [] } = permission;

          if (!data_objects) {
            return data_operations.map((operation) => [operation.uid ?? '']);
          }

          return data_operations.flatMap((operation) =>
            data_objects.map((object) =>
              object.table_uid
                ? [
                    operation.uid ?? '',
                    object.database_uid ?? '',
                    object.table_uid
                  ]
                : [operation.uid ?? '', object.database_uid ?? '']
            )
          );
        }) ?? []
      );
    };

    if (visible) {
      form.setFieldsValue({
        roleName: dbRoleDetailInfo?.db_role?.name ?? '',
        dbServiceID: filteredByDBServiceID ?? '',
        dbRoles: dbRoleDetailInfo?.child_roles?.map((v) => v.uid ?? '') ?? [],
        operationsPermissions: generateOperationsPermissionValues(
          dbRoleDetailInfo?.data_permissions ?? []
        )
      });
    }
  }, [
    form,
    filteredByDBServiceID,
    visible,
    dbRoleDetailInfo?.db_role?.name,
    dbRoleDetailInfo?.child_roles,
    dbRoleDetailInfo?.data_permissions
  ]);

  return (
    <BasicDrawer
      size="large"
      open={visible}
      placement="right"
      title={t('databaseRole.updateRole.title')}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <Spin spinning={getDBRoleDetailInfoPending} delay={300}>
        <RoleForm form={form} mode="update" />
      </Spin>
    </BasicDrawer>
  );
};

export default UpdateRole;
