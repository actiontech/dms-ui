import { Form } from 'antd';
import { IDatabaseRoleFormProps } from './index.type';
import { useTranslation } from 'react-i18next';
import useServiceOptions from '../../../../hooks/useServiceOptions';
import { BasicInput, BasicSelect } from '@actiontech/shared';
import { useEffect } from 'react';
import RolePermissionSelector from '../../../../components/RolePermissionSelector';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const RoleForm: React.FC<IDatabaseRoleFormProps> = ({ form, mode }) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  const {
    loading: getServiceOptionsPending,
    updateServiceList,
    serviceOptions,
    serviceList
  } = useServiceOptions();
  const selectedDBServiceID = Form.useWatch('dbServiceID', form);

  useEffect(() => {
    updateServiceList();
  }, [updateServiceList]);

  useEffect(() => {
    if (selectedDBServiceID) {
      form.setFieldValue(
        'dbType',
        serviceList.find((v) => v.uid === selectedDBServiceID)?.db_type
      );
    }
  }, [form, selectedDBServiceID, serviceList]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="dbServiceID"
        label={t('databaseRole.createRole.dbService')}
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          options={serviceOptions}
          loading={getServiceOptionsPending}
          disabled
        />
      </Form.Item>

      <Form.Item name="dbType" hidden>
        <BasicInput />
      </Form.Item>

      <Form.Item
        name="roleName"
        label={t('databaseRole.createRole.roleName')}
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput disabled={mode === 'update'} />
      </Form.Item>

      <RolePermissionSelector mode={mode} form={form} projectID={projectID} />
    </Form>
  );
};

export default RoleForm;
