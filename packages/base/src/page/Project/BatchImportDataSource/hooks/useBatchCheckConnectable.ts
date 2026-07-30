import { useRequest } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import {
  ICheckDBServicesPrivilegesItem,
  IImportDBServiceV2
} from '@actiontech/shared/lib/api/base/service/common';
import { useBoolean } from 'ahooks';
import {
  getDBServiceConnectableErrorMessage,
  getDbServiceIsConnectbale
} from '../../../../utils/common';

export type BatchImportConnectResultItem = {
  name: string | undefined;
  is_connectable: boolean;
  connect_error_message: string;
};

export type BatchImportPrivilegeResultItem = ICheckDBServicesPrivilegesItem & {
  name?: string;
};

export type BatchImportCheckInfo = {
  isConnectable: boolean;
  connectErrorList: BatchImportConnectResultItem[];
  connectResultList: BatchImportConnectResultItem[];
  privilegeResultList: BatchImportPrivilegeResultItem[];
};

const toConnectablePayload = (item: IImportDBServiceV2) => ({
  db_type: item.db_type ?? '',
  host: item.host ?? '',
  port: item.port ?? '',
  user: item.user ?? '',
  password: item.password ?? '',
  additional_params: item.additional_params
});

/**
 * 批量导入导入前校验：连通 API 与权限 API 分流。
 * Modal 开关仅由连通结果驱动；权限结果只进 privilegeResultList。
 */
const useBatchCheckConnectable = (fallbackProjectUid?: string) => {
  const [
    connectErrorModalVisible,
    { setTrue: showConnectErrorModal, setFalse: hideConnectErrorModal }
  ] = useBoolean();

  const {
    data: connectableInfo,
    runAsync: batchCheckConnectable,
    loading: batchCheckConnectableLoading
  } = useRequest(
    async (dbServices: IImportDBServiceV2[]): Promise<BatchImportCheckInfo> => {
      const connectSettled = await Promise.all(
        dbServices.map(async (item) => {
          const projectUid = item.project_uid || fallbackProjectUid || '';
          if (!projectUid) {
            return {
              name: item.name,
              is_connectable: false,
              connect_error_message: 'project_uid is required'
            } satisfies BatchImportConnectResultItem;
          }

          const res = await DmsApi.DBServiceService.CheckDBServiceIsConnectable(
            {
              project_uid: projectUid,
              db_service: toConnectablePayload(item)
            }
          );

          if (res.data.code !== ResponseCode.SUCCESS) {
            return {
              name: item.name,
              is_connectable: false,
              connect_error_message: res.data.message || ''
            } satisfies BatchImportConnectResultItem;
          }

          const connections = res.data.data ?? [];
          return {
            name: item.name,
            is_connectable: getDbServiceIsConnectbale(connections),
            connect_error_message:
              getDBServiceConnectableErrorMessage(connections)
          } satisfies BatchImportConnectResultItem;
        })
      );

      let privilegeResultList: BatchImportPrivilegeResultItem[] = [];
      const privilegeRes =
        await DmsApi.ProjectService.CheckDBServicesPrivileges({
          db_services: dbServices.map(toConnectablePayload)
        });

      if (privilegeRes.data.code === ResponseCode.SUCCESS) {
        privilegeResultList =
          privilegeRes.data.data?.map((item, index) => ({
            ...item,
            name: dbServices[index]?.name
          })) ?? [];
      }

      const connectErrorList = connectSettled.filter(
        (item) => !item.is_connectable
      );

      return {
        isConnectable: connectSettled.every((item) => item.is_connectable),
        connectErrorList,
        connectResultList: connectSettled,
        privilegeResultList
      };
    },
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
