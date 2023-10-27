import { BasicInput, BasicSelect } from '@actiontech/shared';
import { Form, FormInstance } from 'antd5';
import i18n from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MonitorSourceConfigTypeEnum } from '../../../../../index.type';

interface IServerMonitorFormProps {
  form: FormInstance;
  isUpdate: boolean;
}

const monitorSourceType = [
  {
    label: i18n.t('monitorSourceConfig.serverMonitor.serverMonitorSource'),
    value: MonitorSourceConfigTypeEnum.server_monitor
  },
  {
    label: i18n.t('monitorSourceConfig.databaseMonitor.databaseMonitorSource'),
    value: MonitorSourceConfigTypeEnum.database_monitor
  }
];

const ServerMonitorForm: React.FC<IServerMonitorFormProps> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <Form form={props.form} layout="vertical">
        <Form.Item
          name="name"
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
          name="type"
          label={t('monitorSourceConfig.monitorSourceType')}
          rules={[
            {
              required: true
            }
          ]}
          initialValue={MonitorSourceConfigTypeEnum.server_monitor}
        >
          <BasicSelect
            options={monitorSourceType}
            disabled={true}
          ></BasicSelect>
        </Form.Item>
        <Form.Item
          name="name"
          label={t('monitorSourceConfig.serverMonitor.serverIp')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.serverMonitor.serverIp')
              })
            }
          ]}
        >
          <BasicInput />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('monitorSourceConfig.serverMonitor.sshPort')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.serverMonitor.sshPort')
              })
            }
          ]}
        >
          <BasicInput />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('monitorSourceConfig.serverMonitor.sshUser')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.serverMonitor.sshUser')
              })
            }
          ]}
        >
          <BasicInput />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('monitorSourceConfig.serverMonitor.sshPassword')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('monitorSourceConfig.serverMonitor.sshPassword')
              })
            }
          ]}
        >
          <BasicInput />
        </Form.Item>
      </Form>
    </>
  );
};

export default ServerMonitorForm;
