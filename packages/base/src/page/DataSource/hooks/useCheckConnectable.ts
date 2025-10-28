import { useCallback, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { DataSourceFormField } from '../components/Form/index.type';
import { useBoolean } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api/';
import { ResponseCode } from '@actiontech/dms-kit';
import { useAsyncParams, FormItem } from '@actiontech/shared';
import {
  getDBServiceConnectableErrorMessage,
  getDbServiceIsConnectbale
} from '../../../utils/common';

const useCheckConnectable = (form: FormInstance<DataSourceFormField>) => {
  const projectID = Form.useWatch('project', form);

  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] =
    useBoolean();
  const [connectAble, setConnectAble] = useState(false);
  const [connectErrorMessage, setConnectErrorMessage] = useState('');

  const { mergeFromValueIntoParams } = useAsyncParams();

  const onCheckConnectable = useCallback(
    async (currentAsyncParams?: FormItem[]) => {
      const values = await form.validateFields([
        'ip',
        'password',
        'port',
        'user',
        'type',
        'params'
      ]);

      if (values.params && currentAsyncParams) {
        values.asyncParams = mergeFromValueIntoParams(
          values.params,
          currentAsyncParams
        ).map((v) => ({ name: v.key, value: v.value }));
        delete values.params;
      }

      setLoadingTrue();
      return DmsApi.DBServiceService.CheckDBServiceIsConnectable({
        db_service: {
          host: values.ip,
          port: `${values.port}`,
          user: values.user,
          db_type: values.type,
          password: values.password,
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
    [form, projectID, mergeFromValueIntoParams, setLoadingTrue, setLoadingFalse]
  );

  return {
    loading,
    connectAble,
    connectErrorMessage,
    onCheckConnectable
  };
};

export default useCheckConnectable;
