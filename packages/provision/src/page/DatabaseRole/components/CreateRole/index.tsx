import {
  BackButton,
  BasicButton,
  BasicResult,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Form, Space } from 'antd';
import { useBoolean } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import DbRoleService from '@actiontech/shared/lib/api/provision/service/db_role';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IDatabaseRoleFormFields } from '../../components/Common/index.type';
import RoleForm from '../../components/Common/RoleForm';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { generatePrivilegesSubmitDataByFormValues } from '../../../../components/DatabasePrivilegesSelector/ObjectPrivilegesSelector/utils';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const CreateRole: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<IDatabaseRoleFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const [
    submitResultVisibility,
    { setTrue: showResult, setFalse: hiddenResult }
  ] = useBoolean();

  const { db_service_id } = useParams<{
    db_service_id: string;
  }>();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();

    DbRoleService.AuthAddDBRole({
      project_uid: projectID,
      db_service_uid: db_service_id ?? '',
      db_role: {
        name: values.roleName,
        db_role_uids: values.dbRoles,
        data_permissions: generatePrivilegesSubmitDataByFormValues(
          values.systemPrivileges ?? [],
          values.objectPrivileges ?? [],
          db_service_id ?? ''
        )
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          showResult();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const resetAndHideResult = () => {
    form.resetFields([
      'roleName',
      'dbRoles',
      'objectPrivileges',
      'systemPrivileges'
    ]);
    hiddenResult();
  };

  useEffect(() => {
    if (db_service_id) {
      form.setFieldsValue({ dbServiceID: db_service_id });
    }
  }, [db_service_id, form]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={
          <BackButton>{t('databaseRole.createRole.backToRoleList')}</BackButton>
        }
        extra={
          <EmptyBox if={!submitResultVisibility}>
            <Space>
              <BasicButton
                onClick={resetAndHideResult}
                disabled={submitLoading}
              >
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
          </EmptyBox>
        }
      />

      <LazyLoadComponent open={!submitResultVisibility} animation={false}>
        <RoleForm
          form={form}
          mode="create"
          title={t('databaseRole.createRole.title')}
        />
      </LazyLoadComponent>

      <LazyLoadComponent open={submitResultVisibility} animation={false}>
        <BasicResult
          status="success"
          title={t('databaseRole.createRole.successTips')}
          extra={[
            <BasicButton key="close" onClick={hiddenResult}>
              {t('common.close')}
            </BasicButton>,
            <BasicButton
              type="primary"
              key="resetAndClose"
              onClick={resetAndHideResult}
            >
              {t('common.resetAndClose')}
            </BasicButton>,
            <BackButton icon={null} type="primary" key="back-to-list">
              {t('databaseRole.createRole.backToRoleList')}
            </BackButton>
          ]}
        />
      </LazyLoadComponent>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default CreateRole;
