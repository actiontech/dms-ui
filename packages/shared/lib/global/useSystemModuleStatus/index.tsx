import system from '../../api/sqle/service/system';
import { getSystemModuleStatusModuleNameEnum } from '../../api/sqle/service/system/index.enum';
import { ResponseCode } from '../../enum';
import { useRequest } from 'ahooks';
import { updateSqlOptimizationIsSupported } from '../../../../base/src/store/system';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';

const useSystemModuleStatus = (manual = false) => {
  const dispatch = useDispatch();

  const sqlOptimizationIsSupported = useSelector(
    (state: IReduxState) => state.system.sqlOptimizationIsSupported
  );

  const { loading, run: updateSystemModalStatus } = useRequest(
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
      manual
    }
  );

  return {
    sqlOptimizationIsSupported,
    loading,
    updateSystemModalStatus
  };
};

export default useSystemModuleStatus;
