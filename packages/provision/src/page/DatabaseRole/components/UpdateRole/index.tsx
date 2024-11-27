import { BackButton, BasicButton, PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Form, message, Space, Spin } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import DbRoleService from '@actiontech/shared/lib/api/provision/service/db_role';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IDatabaseRoleFormFields } from '../../components/Common/index.type';
import RoleForm from '../../components/Common/RoleForm';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  generatePrivilegesFormValuesByBackendData,
  generatePrivilegesSubmitDataByFormValues
} from '../../../../components/DatabasePrivilegesSelector/ObjectPrivilegesSelector/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const UpdateRole: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<IDatabaseRoleFormFields>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { db_service_id, role_id } = useParams<{
    db_service_id: string;
    role_id: string;
  }>();

  const navigate = useNavigate();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();

    DbRoleService.AuthUpdateDBRole({
      project_uid: projectID,
      db_role_uid: role_id ?? '',
      db_service_uid: db_service_id ?? '',
      db_role: {
        child_roles: values.dbRoles,
        data_permissions: generatePrivilegesSubmitDataByFormValues(
          values.systemPrivileges ?? [],
          values.objectPrivileges ?? []
        )
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('databaseRole.updateRole.successTips'));
          navigate(`/provision/project/${projectID}/database-role`);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const { data: dbRoleDetailInfo, loading: getDBRoleDetailInfoPending } =
    useRequest(
      () =>
        DbRoleService.AuthDBRoleDetail({
          project_uid: projectID,
          db_role_uid: role_id ?? '',
          db_service_uid: db_service_id ?? ''
        }).then((res) => res.data.data),
      {
        ready: !!db_service_id && !!role_id
      }
    );

  const resetFormValues = () => {
    form.resetFields(['dbRoles', 'objectPrivileges', 'systemPrivileges']);
  };

  useEffect(() => {
    form.setFieldsValue({
      roleName: dbRoleDetailInfo?.db_role?.name ?? '',
      dbServiceID: db_service_id ?? '',
      dbRoles: dbRoleDetailInfo?.child_roles?.map((v) => v.uid ?? '') ?? [],
      systemPrivileges:
        dbRoleDetailInfo?.data_permissions
          ?.filter((v) => (v.data_objects ?? []).length === 0)
          .flatMap(
            (v) =>
              v.data_operations?.map((operation) => operation.uid ?? '') ?? []
          ) ?? [],
      objectPrivileges: generatePrivilegesFormValuesByBackendData(
        dbRoleDetailInfo?.data_permissions?.filter(
          (v) => (v.data_objects ?? []).length > 0
        ) ?? [],
        db_service_id ?? ''
      )
    });
  }, [
    dbRoleDetailInfo?.child_roles,
    dbRoleDetailInfo?.data_permissions,
    dbRoleDetailInfo?.db_role?.name,
    db_service_id,
    form
  ]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {messageContextHolder}
      <PageHeader
        fixed
        title={
          <BackButton>{t('databaseRole.updateRole.backToRoleList')}</BackButton>
        }
        extra={
          <Space>
            <BasicButton onClick={resetFormValues} disabled={submitLoading}>
              {t('common.reset')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={onSubmit}
              loading={submitLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      />
      <Spin spinning={getDBRoleDetailInfoPending} delay={300}>
        <RoleForm
          form={form}
          mode="update"
          title={t('databaseRole.updateRole.title')}
        />
      </Spin>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default UpdateRole;
