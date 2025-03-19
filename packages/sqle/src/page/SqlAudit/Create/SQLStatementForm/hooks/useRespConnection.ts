import { useState, useCallback } from 'react';
import { SelectProps } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SQLStatementFormProps } from '../../SQLInfoForm/index.type';

const useRespConnection = (form: SQLStatementFormProps['form']) => {
  const [branchOptions, setBranchOptions] = useState<SelectProps['options']>(
    []
  );

  const [isConnectable, setConnectable] = useState(false);

  const [
    connectionInfoHide,
    { setTrue: hideConnectionInfo, setFalse: showConnectionInfo }
  ] = useBoolean(true);

  const [connectionErrorMsg, setConnectionErrorMsg] = useState<string>();

  const { run, loading: verifyConnectionLoading } = useRequest(
    () => {
      return SqleApi.ConfigurationService.TestGitConnectionV1({
        git_http_url: form.getFieldValue('gitHttpUrl'),
        git_user_name: form.getFieldValue('gitUserName'),
        git_user_password: form.getFieldValue('gitUserPassword')
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          showConnectionInfo();
          setBranchOptions(
            res.data.data?.branches?.map((i) => ({ label: i, value: i }))
          );
          setConnectable(res.data.data?.is_connected_success ?? false);
          setConnectionErrorMsg(res.data.data?.error_message);
        }
      });
    },
    {
      manual: true
    }
  );

  const verifyConnection = useCallback(async () => {
    await form.validateFields(['gitHttpUrl', 'gitUserName', 'gitUserPassword']);
    run();
  }, [form, run]);

  const initConnectionState = () => {
    setBranchOptions([]);
    setConnectable(false);
    setConnectionErrorMsg(undefined);
    hideConnectionInfo();
  };

  return {
    branchOptions,
    isConnectable,
    verifyConnection,
    verifyConnectionLoading,
    connectionInfoHide,
    connectionErrorMsg,
    initConnectionState
  };
};

export default useRespConnection;
