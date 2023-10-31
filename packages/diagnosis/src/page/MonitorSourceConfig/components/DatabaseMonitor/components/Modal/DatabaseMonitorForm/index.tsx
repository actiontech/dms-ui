import { BasicInput, BasicInputNumber, BasicSelect } from '@actiontech/shared';
import { Form, FormInstance } from 'antd5';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useDbService from '../../../../../../../../../base/src/hooks/useDbService';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';

interface IServerMonitorFormProps {
  form: FormInstance;
  project_uid: string;
}

const ServerMonitorForm: React.FC<IServerMonitorFormProps> = ({
  form,
  project_uid
}) => {
  const { t } = useTranslation();

  const { updateDbServiceList, generateDbServiceSelectOption } = useDbService();

  useEffect(() => {
    updateDbServiceList(project_uid);
  }, [project_uid, updateDbServiceList]);

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
          >
            {generateDbServiceSelectOption()}
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
          <BasicInputNumber />
        </Form.Item>
      </Form>
    </>
  );
};

export default ServerMonitorForm;
