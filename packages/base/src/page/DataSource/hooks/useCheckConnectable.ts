import { useCallback, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import { DataSourceFormField } from '../components/Form/index.type';
import { useBoolean } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api/';
import { ResponseCode } from '@actiontech/dms-kit';
import { useAsyncParams, BackendFormItemParams } from '@actiontech/shared';
import {
  getDBServiceConnectableErrorMessage,
  getDbServiceIsConnectbale
} from '../../../utils/common';
import { mergeRedisConnectionModeIntoParams } from '../tool';
import {
  encryptPasswordForTransport,
  PasswordTransportError
} from '../../../utils/passwordTransportEncryption';

const useCheckConnectable = (form: FormInstance<DataSourceFormField>) => {
  const { t } = useTranslation();
  const projectID = Form.useWatch('project', form);

  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] =
    useBoolean();
  const [connectAble, setConnectAble] = useState(false);
  const [connectErrorMessage, setConnectErrorMessage] = useState('');

  const { mergeFromValueIntoParams } = useAsyncParams();

  const resolveTransportErrorMessage = useCallback(
    (error: unknown) => {
      if (
        error instanceof PasswordTransportError &&
        error.reason === 'encrypt_failed'
      ) {
        return t('dmsDataSource.passwordTransport.encryptFailed');
      }
      return t('dmsDataSource.passwordTransport.encryptFailed');
    },
    [t]
  );

  const onCheckConnectable = useCallback(
    async (currentAsyncParams?: BackendFormItemParams[]) => {
      const values = await form.validateFields([
        'ip',
        'password',
        'port',
        'user',
        'type',
        'params',
        'connectionMode'
      ]);

      if (values.params && currentAsyncParams) {
        values.asyncParams = mergeFromValueIntoParams(
          values.params,
          currentAsyncParams
        ).map((v) => ({ name: v.key, value: v.value }));
        delete values.params;
      }

      values.asyncParams = mergeRedisConnectionModeIntoParams(
        values.asyncParams,
        values.type,
        values.connectionMode
      );

      setLoadingTrue();
      let cipher;
      try {
        cipher = await encryptPasswordForTransport(values.password ?? '');
      } catch (error) {
        setConnectAble(false);
        setConnectErrorMessage(resolveTransportErrorMessage(error));
        setLoadingFalse();
        return false;
      }

      return DmsApi.DBServiceService.CheckDBServiceIsConnectable({
        db_service: {
          host: values.ip,
          port: `${values.port}`,
          user: values.user,
          db_type: values.type,
          secret_password: cipher.secret_password,
          additional_params: values.asyncParams ?? []
        },
        project_uid: projectID
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const connections = res.data.data ?? [];
            const isConnectable = getDbServiceIsConnectbale(connections);
            const errorMessage =
              getDBServiceConnectableErrorMessage(connections);

            setConnectAble(isConnectable);
            setConnectErrorMessage(errorMessage);
            return isConnectable;
          }
        })
        .finally(() => {
          setLoadingFalse();
        });
    },
    [
      form,
      projectID,
      mergeFromValueIntoParams,
      setLoadingTrue,
      setLoadingFalse,
      resolveTransportErrorMessage
    ]
  );

  return {
    loading,
    connectAble,
    connectErrorMessage,
    onCheckConnectable
  };
};

export default useCheckConnectable;
