import { BasicInput, BasicInputNumber, BasicSelect } from '@actiontech/shared';
import { Form, FormInstance, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IServerMonitorFormProps {
  form: FormInstance;
  isUpdate?: boolean;
}

const ServerMonitorForm: React.FC<IServerMonitorFormProps> = ({
  form,
  isUpdate
}) => {
  const { t } = useTranslation();

  const renderDbTypeOption = () => {
    return ['MySQL'].map((item) => (
      <Select.Option key={item} value={item} label={item}>
        {item}
      </Select.Option>
    ));
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          name="monitor_name"
          label={t('monitorSourceConfig.monitorSourceName')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.monitorSourceName')
              })
            }
          ]}
        >
          <BasicInput disabled={!!isUpdate} />
        </Form.Item>
        <Form.Item
          name="monitor_type"
          label={t('monitorSourceConfig.databaseMonitor.databaseType')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.databaseMonitor.databaseType')
              })
            }
          ]}
        >
          <BasicSelect showSearch allowClear disabled={!!isUpdate}>
            {renderDbTypeOption()}
          </BasicSelect>
        </Form.Item>
        <Form.Item
          name="host"
          label={t('monitorSourceConfig.databaseMonitor.databaseIp')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.databaseMonitor.databaseIp')
              })
            }
          ]}
        >
          <BasicInput disabled={!!isUpdate} />
        </Form.Item>
        <Form.Item
          name="port"
          label={t('monitorSourceConfig.databaseMonitor.databasePort')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.databaseMonitor.databasePort')
              })
            }
          ]}
        >
          <BasicInputNumber
            disabled={!!isUpdate}
            placeholder={t('common.form.placeholder.input')}
          />
        </Form.Item>
        <Form.Item
          name="username"
          label={t('common.username')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('common.username')
              })
            }
          ]}
        >
          <BasicInput />
        </Form.Item>
        <Form.Item
          name="password"
          label={t('common.password')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('common.password')
              })
            }
          ]}
        >
          <BasicInput.Password />
        </Form.Item>
      </Form>
    </>
  );
};

export default ServerMonitorForm;
