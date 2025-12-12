import { useRequest } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import useRecentlySelectedZone from '@actiontech/dms-kit/es/features/useRecentlySelectedZone';
import { IReduxState } from '../../store';
import { updateAvailabilityZoneTips } from '../../store/availabilityZone';

const useNavigateToWorkbench = () => {
  const dispatch = useDispatch();

  const availabilityZoneTips = useSelector(
    (state: IReduxState) => state.availabilityZone.availabilityZoneTips
  );

  const { availabilityZone, updateRecentlySelectedZone } =
    useRecentlySelectedZone();

  const {
    runAsync: getAvailabilityZoneTipsAsync,
    loading: getAvailabilityZoneTipsLoading
  } = useRequest(
    () =>
      DmsApi.GatewayService.GetGatewayTips().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
        return [];
      }),
    {
      onSuccess: (res) => {
        dispatch(
          updateAvailabilityZoneTips({
            availabilityZoneTips: res ?? []
          })
        );
      },
      manual: true
    }
  );

  const {
    loading: navigateToWorkbenchLoading,
    runAsync: navigateToWorkbenchAsync
  } = useRequest(
    () => {
      return DmsApi.CloudBeaverService.GetSQLQueryConfiguration().then(
        (res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }
      );
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (
          res?.enable_sql_query &&
          res.sql_query_root_uri &&
          res.sql_query_root_uri !== location.pathname
        ) {
          // 如果当前设置了可用区 并且没有最近选择的可用区记录 则设置一个默认的可用区
          if (!!availabilityZoneTips.length && !availabilityZone) {
            updateRecentlySelectedZone(availabilityZoneTips[0]);
          }

          // res.sql_query_root_uri !== location.pathname 防止无限刷新
          // 因为sql_query_root_uri是不携带origin的，只有pathname。所以开发环境localhost不可以直接跳转到CB
          // #if [PROD]
          window.location.href = res.sql_query_root_uri;
          // #endif
        }
      }
    }
  );

  return {
    navigateToWorkbenchLoading,
    navigateToWorkbenchAsync,
    getAvailabilityZoneTipsAsync,
    getAvailabilityZoneTipsLoading
  };
};

export default useNavigateToWorkbench;
