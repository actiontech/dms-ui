import { useRequest } from 'ahooks';
import { useState } from 'react';
import { getSystemModuleStatusModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/system/index.enum';
import SystemService from '@actiontech/shared/lib/api/sqle/service/system';

const REQUIRED_MODULES = [
  getSystemModuleStatusModuleNameEnum.sql_optimization
] as const;

const useFetchPermissionData = () => {
  const [isFeatureSupportFetched, setIsFeatureSupportFetched] = useState(false);

  const { loading: isModuleStatusLoading, runAsync: fetchModuleSupportStatus } =
    useRequest(
      async () => {
        const requests = REQUIRED_MODULES.map((moduleName) =>
          SystemService.getSystemModuleStatus({
            module_name: moduleName
          })
        );

        const results = await Promise.all(requests);
        return results.reduce((acc, curr, index) => {
          acc[REQUIRED_MODULES[index]] = curr.data?.data?.is_supported ?? false;
          return acc;
        }, {} as Record<getSystemModuleStatusModuleNameEnum, boolean>);
      },
      {
        onFinally: () => {
          setIsFeatureSupportFetched(true);
        },
        manual: true
      }
    );
  return {
    isModuleStatusLoading,
    fetchModuleSupportStatus,
    isFeatureSupportFetched
  };
};

export default useFetchPermissionData;
