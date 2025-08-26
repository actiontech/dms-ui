import { useRequest } from 'ahooks';
import { useState } from 'react';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OptimizationResultStatus } from '../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const useOptimizationResult = (pollingInterval = 0) => {
  const { projectName } = useCurrentProject();

  const [optimizationResultStatus, setOptimizationResultStatus] =
    useState<OptimizationResultStatus>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    data: optimizationResult,
    loading: optimizationResultLoading,
    run: getOptimizationResult,
    cancel: cancelOptimizationRequestPolling
  } = useRequest(
    (id: string) =>
      SqleApi.SqlOptimizationService.GetOptimizationSQLDetailV2({
        project_name: projectName,
        optimization_record_id: id
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      }),
    {
      onSuccess: (res) => {
        if (res?.status !== OptimizationSQLDetailStatusEnum.optimizing) {
          cancelOptimizationRequestPolling();
        }
        setOptimizationResultStatus(OptimizationResultStatus.RESOLVED);
      },
      onError: (e) => {
        cancelOptimizationRequestPolling();
        setOptimizationResultStatus(OptimizationResultStatus.FAILED);
        setErrorMessage(e.message);
      },
      manual: true,
      pollingInterval: pollingInterval
    }
  );

  return {
    optimizationResultStatus,
    errorMessage,
    optimizationResult,
    optimizationResultLoading,
    getOptimizationResult,
    cancelOptimizationRequestPolling
  };
};

export default useOptimizationResult;
