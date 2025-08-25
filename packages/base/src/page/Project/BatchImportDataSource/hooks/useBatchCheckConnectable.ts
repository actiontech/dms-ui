import { useRequest } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { IImportDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { useBoolean } from 'ahooks';
import {
  getDBServiceConnectableErrorMessage,
  getDbServiceIsConnectbale
} from '../../../../utils/common';

const useBatchCheckConnectable = () => {
  const [
    connectErrorModalVisible,
    { setTrue: showConnectErrorModal, setFalse: hideConnectErrorModal }
  ] = useBoolean();

  const {
    data: connectableInfo,
    runAsync: batchCheckConnectable,
    loading: batchCheckConnectableLoading
  } = useRequest(
    (dbServices: IImportDBServiceV2[]) =>
      DmsApi.ProjectService.CheckDBServicesPrivileges({
        db_services: dbServices.map((item) => ({
          db_type: item.db_type ?? '',
          host: item.host ?? '',
          port: item.port ?? '',
          user: item.user ?? '',
          password: item.password ?? '',
          additional_params: item.additional_params
        }))
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const formattedData = res.data.data?.map((i, index) => {
            const CheckDBServicesPrivileges = i.CheckDBServicesPrivileges ?? [];
            return {
              ...i,
              name: dbServices[index].name,
              is_connectable: getDbServiceIsConnectbale(
                CheckDBServicesPrivileges
              ),
              connect_error_message: getDBServiceConnectableErrorMessage(
                CheckDBServicesPrivileges
              )
            };
          });

          return {
            isConnectable: formattedData?.every((item) => item.is_connectable),
            connectErrorList: formattedData
              ?.filter((item) => !item.is_connectable)
              .map((item) => ({
                name: item.name,
                connect_error_message: item.connect_error_message
              }))
          };
        }
      }),
    {
      manual: true
    }
  );

  return {
    batchCheckConnectable,
    batchCheckConnectableLoading,
    connectableInfo,
    connectErrorModalVisible,
    showConnectErrorModal,
    hideConnectErrorModal
  };
};

export default useBatchCheckConnectable;
