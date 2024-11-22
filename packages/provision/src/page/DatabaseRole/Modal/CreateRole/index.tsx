import { BasicButton, BasicDrawer } from '@actiontech/shared';
import useModalStatus from '../../../../hooks/useModalStatus';
import {
  DatabaseRoleFilteredDBServiceID,
  DatabaseRoleModalStatus
} from '../../../../store/databaseRole';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import { useTranslation } from 'react-i18next';
import { Form, message, Space } from 'antd';
import { useBoolean } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import DbRoleService from '@actiontech/shared/lib/api/provision/service/db_role';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../utils/EventEmitter';
import { IDatabaseRoleFormFields } from '../Common/index.type';
import RoleForm from '../Common/RoleForm';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { IDataPermissionForRole } from '@actiontech/shared/lib/api/provision/service/common';

const CreateRole: React.FC = () => {
  const { t } = useTranslation();
  const { toggleModal, visible } = useModalStatus(
    DatabaseRoleModalStatus,
    ModalName.DatabaseRoleCreateModal
  );
  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<IDatabaseRoleFormFields>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const [filteredByDBServiceID] = useRecoilState(
    DatabaseRoleFilteredDBServiceID
  );

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

    DbRoleService.AuthAddDBRole({
      project_uid: projectID,
      db_service_uid: filteredByDBServiceID ?? '',
      db_role: {
        name: values.roleName,
        db_role_uids: values.dbRoles,
        data_permissions: dataPermissions
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          EventEmitter.emit(EventEmitterKey.Refresh_Database_Role_List_Table);
          messageApi.success(t('databaseRole.actions.create.succeedTips'));
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const onClose = () => {
    form.resetFields();
    toggleModal(ModalName.DatabaseRoleCreateModal, false);
  };

  useEffect(() => {
    if (visible && filteredByDBServiceID) {
      form.setFieldsValue({ dbServiceID: filteredByDBServiceID ?? '' });
    }
  }, [filteredByDBServiceID, form, visible]);

  return (
    <BasicDrawer
      size="large"
      open={visible}
      placement="right"
      title={t('databaseRole.createRole.title')}
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
      <RoleForm form={form} mode="create" />
    </BasicDrawer>
  );
};

export default CreateRole;
