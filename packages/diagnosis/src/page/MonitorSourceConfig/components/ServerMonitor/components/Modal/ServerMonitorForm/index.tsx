import { BasicInput, BasicInputNumber } from '@actiontech/shared';
import { useRequest } from 'ahooks';
import { Form, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import server from '../../../../../../../api/server';
import { IV1GetServerHostnameParams } from '../../../../../../../api/server/index.d';
import { LoadingOutlined } from '@ant-design/icons';
import { ResponseCode } from '@actiontech/shared/lib/enum';

interface IServerMonitorFormProps {
  form: FormInstance;
  visible: boolean;
  signal?: AbortSignal;
  isUpdate?: boolean;
}

const ServerMonitorForm: React.FC<IServerMonitorFormProps> = ({
  form,
  visible,
  signal,
  isUpdate
}) => {
  const { t } = useTranslation();

  const [getHostNameFailed, setGetHostNameFailed] = useState<boolean>(false);

  const {
    data: hostName,
    loading,
    run: getServerHostName
  } = useRequest(
    (params) => {
      return server.V1GetServerHostname(params, { signal });
    },
    {
      manual: true,
      onBefore: () => setGetHostNameFailed(false),
      onSuccess: (data) => {
        if (data.data?.code !== ResponseCode.SUCCESS) {
          setGetHostNameFailed(true);
        }
      },
      onError: () => visible && setGetHostNameFailed(true)
    }
  );

  useEffect(() => {
    if (!visible) {
      setGetHostNameFailed(false);
    }
  }, [visible]);

  useEffect(() => {
    const name = hostName?.data?.hostname;
    if (!!name) form.setFieldValue('name', name);
  }, [hostName, form]);

  const handleGetHostName = () => {
    form.validateFields(['host', 'password', 'port', 'user']).then((res) => {
      const params: IV1GetServerHostnameParams = {
        host: res.host,
        password: res.password,
        port: res.port,
        user: res.user
      };
      if (!loading) getServerHostName(params);
    });
  };

  return (
    <>
      <Form form={form} layout="vertical">
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
          validateStatus={getHostNameFailed ? 'error' : undefined}
          help={
            getHostNameFailed
              ? t('monitorSourceConfig.serverMonitor.getHostNameFailedTip')
              : null
          }
        >
          <BasicInput
            onFocus={handleGetHostName}
            disabled={!!isUpdate}
            suffix={loading ? <LoadingOutlined /> : <span />}
            placeholder={t('common.form.placeholder.input', {
              name: t('monitorSourceConfig.monitorSourceName')
            })}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default ServerMonitorForm;
