import { BasicInput, BasicInputNumber, BasicSelect } from '@actiontech/shared';
import { Form, FormInstance } from 'antd5';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';

interface IServerMonitorFormProps {
  form: FormInstance;
  dbLoading: boolean;
  dbServiceOption: React.ReactNode;
}

const ServerMonitorForm: React.FC<IServerMonitorFormProps> = ({
  form,
  dbLoading,
  dbServiceOption
}) => {
  const { t } = useTranslation();

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
          name="datasource_uid"
          label={t('monitorSourceConfig.databaseMonitor.dataSourceName')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.databaseMonitor.dataSourceName')
              })
            }
          ]}
        >
          <BasicSelect
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={filterOptionByLabel}
            loading={dbLoading}
          >
            {dbServiceOption}
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
