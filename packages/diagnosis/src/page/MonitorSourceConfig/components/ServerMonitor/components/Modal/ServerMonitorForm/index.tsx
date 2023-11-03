import { BasicInput, BasicInputNumber } from '@actiontech/shared';
import { Form, FormInstance } from 'antd5';
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
          <BasicInput disabled={!!isUpdate} />
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
          <BasicInput disabled={!!isUpdate} />
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
          <BasicInputNumber
            placeholder={t('common.form.placeholder.input')}
            disabled={!!isUpdate}
          />
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
