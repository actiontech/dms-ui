import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';
import { ModuleFeatureSupportStatus } from '../../enum';

const useCurrentPermission = () => {
  // todo 重构完成后删除冗余的导出以及调整 hooks 名称
  const { sqlOptimizationIsSupported } = useSelector((state: IReduxState) => ({
    sqlOptimizationIsSupported: state.permission.sqlOptimizationIsSupported
  }));

  const moduleSupportStatus: ModuleFeatureSupportStatus = {
    sqlOptimization: sqlOptimizationIsSupported
  };

  return {
    sqlOptimizationIsSupported,
    moduleSupportStatus
  };
};

export default useCurrentPermission;
