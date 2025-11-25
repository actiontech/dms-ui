import { useRequest } from 'ahooks';
import { useState } from 'react';
import SqlOptimizationService from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
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
      SqlOptimizationService.GetOptimizationSQLDetailV2({
        project_name: projectName,
        optimization_record_id: id
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      }),
    {
      onSuccess: (res) => {
        if (
          res?.status === OptimizationSQLDetailStatusEnum.finish ||
          res?.status === OptimizationSQLDetailStatusEnum.failed
        ) {
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
