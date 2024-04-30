import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';
import { PermissionReduxState } from '../../types/common.type';

const useCurrentPermission = (): PermissionReduxState => {
  const { sqlOptimizationIsSupported } = useSelector((state: IReduxState) => ({
    sqlOptimizationIsSupported: state.permission.sqlOptimizationIsSupported
  }));

  return {
    sqlOptimizationIsSupported
  };
};

export default useCurrentPermission;
