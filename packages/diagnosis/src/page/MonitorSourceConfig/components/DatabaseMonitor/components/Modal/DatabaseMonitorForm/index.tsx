import { BasicInput, BasicInputNumber, BasicSelect } from '@actiontech/shared';
import { Form, FormInstance, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IServerMonitorFormProps {
  form: FormInstance;
}

const ServerMonitorForm: React.FC<IServerMonitorFormProps> = ({ form }) => {
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
          <BasicInput />
        </Form.Item>
        <Form.Item
          name="db_type"
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
          <BasicSelect showSearch allowClear>
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
          <BasicInput />
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
          <BasicInputNumber placeholder={t('common.form.placeholder.input')} />
        </Form.Item>
      </Form>
    </>
  );
};

export default ServerMonitorForm;
