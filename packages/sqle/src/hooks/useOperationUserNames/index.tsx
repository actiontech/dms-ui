import { useCallback, useMemo, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import baseOperationRecord from '@actiontech/shared/lib/api/base/service/OperationRecord';

type OperationUserName = {
  operation_user_name?: string;
  operation_req_ip?: string;
  desc?: string;
};

const useOperationUserNames = (projectName?: string) => {
  const [operationUserNameList, setOperationUserNameList] = useState<
    OperationUserName[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationUserNameList = useCallback(() => {
    setTrue();
    const params = projectName
      ? { filter_operate_project_name: projectName }
      : undefined;
    baseOperationRecord
      .GetOperationUserNameList(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationUserNameList(res.data.data ?? []);
          return;
        }
        setOperationUserNameList([]);
      })
      .catch(() => {
        setOperationUserNameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [projectName, setFalse, setTrue]);

  const operationUserNameOptions = useMemo(() => {
    const seen = new Set<string>();
    return operationUserNameList.reduce<{ label: string; value: string }[]>(
      (options, userName) => {
        const name = userName.operation_user_name ?? '';
        if (!name || seen.has(name)) {
          return options;
        }
        seen.add(name);
        options.push({
          label: name,
          value: name
        });
        return options;
      },
      []
    );
  }, [operationUserNameList]);

  return {
    operationUserNameList,
    loading,
    updateOperationUserNameList,
    operationUserNameOptions
  };
};

export default useOperationUserNames;
