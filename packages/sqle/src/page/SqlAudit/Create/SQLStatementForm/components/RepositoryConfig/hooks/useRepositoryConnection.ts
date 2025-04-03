import { useState, useCallback } from 'react';
import { SelectProps, Form } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SQLInfoFormFields } from '../../../../SQLInfoForm/index.type';

const useRepositoryConnection = () => {
  const form = Form.useFormInstance<SQLInfoFormFields>();
  const [branchOptions, setBranchOptions] = useState<SelectProps['options']>(
    []
  );
  const [isConnectable, setConnectable] = useState(false);
  const [
    connectionInfoHide,
    { setTrue: hideConnectionInfo, setFalse: showConnectionInfo }
  ] = useBoolean(true);
  const [connectionErrorMsg, setConnectionErrorMsg] = useState<string>();

  const { run: verifyConnection, loading: verifyConnectionLoading } =
    useRequest(
      async () => {
        await form.validateFields(['gitHttpUrl']);

        return SqleApi.ConfigurationService.TestGitConnectionV1({
          git_http_url: form.getFieldValue('gitHttpUrl'),
          git_user_name: form.getFieldValue('gitUserName'),
          git_user_password: form.getFieldValue('gitUserPassword')
        }).then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            showConnectionInfo();
            setBranchOptions(
              res.data.data?.branches?.map((i: string) => ({
                label: i,
                value: i
              }))
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

  const initConnectionState = useCallback(() => {
    setBranchOptions([]);
    setConnectable(false);
    setConnectionErrorMsg(undefined);
    hideConnectionInfo();
  }, [hideConnectionInfo]);

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

export default useRepositoryConnection;
