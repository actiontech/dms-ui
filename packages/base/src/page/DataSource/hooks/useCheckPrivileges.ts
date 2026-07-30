import { useCallback, useState } from 'react';
import { FormInstance } from 'antd';
import { DataSourceFormField } from '../components/Form/index.type';
import { useBoolean } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api/';
import { ResponseCode } from '@actiontech/dms-kit';
import { useAsyncParams, BackendFormItemParams } from '@actiontech/shared';
import { ICheckDBServicesPrivilegesItem } from '@actiontech/shared/lib/api/base/service/common';

const useCheckPrivileges = (form: FormInstance<DataSourceFormField>) => {
  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] =
    useBoolean();
  const [privilegeResult, setPrivilegeResult] =
    useState<ICheckDBServicesPrivilegesItem | null>(null);
  const [privilegeChecked, setPrivilegeChecked] = useState(false);

  const { mergeFromValueIntoParams } = useAsyncParams();

  const onCheckPrivileges = useCallback(
    async (currentAsyncParams?: BackendFormItemParams[]) => {
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
      return DmsApi.ProjectService.CheckDBServicesPrivileges({
        db_services: [
          {
            host: values.ip,
            port: `${values.port}`,
            user: values.user,
            db_type: values.type,
            password: values.password,
            additional_params: values.asyncParams ?? []
          }
        ]
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const result = res.data.data?.[0] ?? null;
            setPrivilegeResult(result);
            setPrivilegeChecked(true);
            return result;
          }
        })
        .finally(() => {
          setLoadingFalse();
        });
    },
    [form, mergeFromValueIntoParams, setLoadingTrue, setLoadingFalse]
  );

  const resetPrivilegeResult = useCallback(() => {
    setPrivilegeResult(null);
    setPrivilegeChecked(false);
  }, []);

  return {
    privilegeLoading: loading,
    privilegeResult,
    privilegeChecked,
    onCheckPrivileges,
    resetPrivilegeResult
  };
};

export default useCheckPrivileges;
