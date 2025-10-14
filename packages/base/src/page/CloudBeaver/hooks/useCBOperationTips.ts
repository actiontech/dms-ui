import { useBoolean } from 'ahooks';
import { useCallback, useState, useMemo } from 'react';
import { ResponseCode } from '@actiontech/dms-kit';
import CBOperationLogs from '@actiontech/shared/lib/api/base/service/CBOperationLogs';
import { IGetCBOperationLogTipsParams } from '@actiontech/shared/lib/api/base/service/CBOperationLogs/index.d';

const useCBOperationTips = () => {
  const [operationTipsList, setOperationTipsList] = useState<string[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateCBOperationList = useCallback(
    (params: IGetCBOperationLogTipsParams) => {
      setTrue();
      CBOperationLogs.GetCBOperationLogTips(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setOperationTipsList(res.data?.data?.exec_result ?? []);
          }
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const cbOperationOptions = useMemo(() => {
    return operationTipsList.map((i) => {
      return {
        label: i,
        value: i
      };
    });
  }, [operationTipsList]);

  return {
    operationTipsList,
    loading,
    cbOperationOptions,
    updateCBOperationList
  };
};

export default useCBOperationTips;
