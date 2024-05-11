import system from '../../api/sqle/service/system';
import { getSystemModuleStatusModuleNameEnum } from '../../api/sqle/service/system/index.enum';
import { ResponseCode } from '../../enum';
import { useRequest } from 'ahooks';
import { updateSqlOptimizationIsSupported } from '../../../../base/src/store/permission';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const useFeaturePermission = () => {
  const dispatch = useDispatch();
  const [featurePermissionFetched, setFeaturePermissionFetched] =
    useState(false);

  const { loading, run: updateFeaturePermission } = useRequest(
    () => {
      return system.getSystemModuleStatus({
        module_name: getSystemModuleStatusModuleNameEnum.sql_optimization
      });
    },
    {
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(
            updateSqlOptimizationIsSupported({
              isSupported: res.data.data?.is_supported ?? false
            })
          );
        }
      },
      onFinally: () => {
        setFeaturePermissionFetched(true);
      },
      manual: true
    }
  );

  return {
    loading,
    updateFeaturePermission,
    featurePermissionFetched
  };
};

export default useFeaturePermission;
