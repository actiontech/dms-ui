import { BasicInput, BasicInputNumber } from '@actiontech/shared';
import { Form, FormInstance } from 'antd5';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IServerMonitorFormProps {
  form: FormInstance;
}

const ServerMonitorForm: React.FC<IServerMonitorFormProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <>
      <Form form={form} layout="vertical">
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
          name="host"
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
          name="port"
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
          <BasicInputNumber />
        </Form.Item>
        <Form.Item
          name="user"
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
          name="password"
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
          <BasicInput.Password />
        </Form.Item>
      </Form>
    </>
  );
};

export default ServerMonitorForm;
