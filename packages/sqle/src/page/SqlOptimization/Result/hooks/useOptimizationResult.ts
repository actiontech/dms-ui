import { useRequest } from 'ahooks';
import { useState } from 'react';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

interface UseOptimizationResultParams {
  pollingInterval?: number;
}

const useOptimizationResult = (params?: UseOptimizationResultParams) => {
  const { pollingInterval = 0 } = params ?? {};

  const { projectName } = useCurrentProject();

  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    data: optimizationResult,
    run: getOptimizationResult,
    loading,
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
      },
      onError: (e) => {
        cancelOptimizationRequestPolling();
        setErrorMessage(e.message);
      },
      manual: true,
      pollingInterval: pollingInterval
    }
  );

  return {
    errorMessage,
    optimizationResult,
    optimizationResultLoading: !!optimizationResult ? false : loading,
    getOptimizationResult,
    cancelOptimizationRequestPolling
  };
};

export default useOptimizationResult;
