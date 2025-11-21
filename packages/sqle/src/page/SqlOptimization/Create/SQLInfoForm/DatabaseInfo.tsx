import { useTranslation } from 'react-i18next';
import { DatabaseInfoProps } from '../../index.type';
import { Alert, Form, Space } from 'antd';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { FormItemLabel, FormItemNoLabel } from '@actiontech/shared';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import {
  IconDatabase,
  IconDatabaseActive,
  IconDatabaseSchema,
  IconDatabaseSchemaActive
} from '@actiontech/shared/lib/Icon/common';

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({
  form,
  instanceLoading,
  instanceOptions,
  getInstanceDbType
}) => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

  const instanceName = Form.useWatch('instanceName', form);

  const { loading: getInstanceSchemaListLoading, schemaList } =
    useInstanceSchema(projectName, instanceName);

  const handleInstanceNameChange = (name: string) => {
    form.setFieldsValue({
      instanceSchema: undefined,
      dbType: getInstanceDbType(name)
    });
  };

  return (
    <div>
      <FormItemLabel
        label={t('sqlOptimization.create.sqlInfo.instanceName')}
        className="has-required-style"
        style={{
          marginBottom: 16
        }}
        required={true}
      />
      <Space align="start" size={12}>
        <FormItemNoLabel
          name="instanceName"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('sqlOptimization.create.sqlInfo.instanceName')
              })
            }
          ]}
        >
          <CustomSelect
            className="data-source-row-select"
            allowClear={false}
            prefix={<IconDatabase />}
            valuePrefix={<IconDatabaseActive />}
            size="middle"
            disabled={submitLoading}
            loading={instanceLoading}
            options={instanceOptions}
            onChange={(value) => handleInstanceNameChange(value)}
          />
        </FormItemNoLabel>
        <FormItemNoLabel
          name="instanceSchema"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('sqlOptimization.create.sqlInfo.instanceSchema')
              })
            }
          ]}
        >
          <CustomSelect
            className="data-source-row-select"
            size="middle"
            disabled={submitLoading || !instanceName}
            prefix={<IconDatabaseSchema />}
            valuePrefix={<IconDatabaseSchemaActive />}
            loading={getInstanceSchemaListLoading}
            placeholder={t('common.form.placeholder.select', {
              name: t('sqlOptimization.create.sqlInfo.instanceSchema')
            })}
            options={schemaList.map((item) => ({
              label: item,
              value: item
            }))}
          />
        </FormItemNoLabel>
      </Space>
      <Alert
        type="warning"
        message={t('sqlOptimization.create.sqlInfo.tips')}
        showIcon
        style={{
          marginBottom: 16
        }}
      />
    </div>
  );
};
export default DatabaseInfo;
