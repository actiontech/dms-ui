import {
  useCurrentProject,
  useDbServiceDriver,
  usePermission
} from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useMemo, useCallback, useState } from 'react';
import { IListService } from '@actiontech/shared/lib/api/provision/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const useServiceOptions = (isNeedFilterByOperationPermission = false) => {
  const { projectID } = useCurrentProject();

  const [serviceList, setServiceList] = useState<IListService[]>([]);

  const [loading, { setTrue, setFalse }] = useBoolean();

  const { getLogoUrlByDbType } = useDbServiceDriver();

  const { checkDbServicePermission } = usePermission();

  const updateServiceList = useCallback(
    (business?: string, onSuccess?: (data?: IListService[]) => void) => {
      setTrue();
      auth
        .AuthListService({
          page_index: 1,
          page_size: 999,
          filter_by_namespace: projectID,
          business
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setServiceList(res.data?.data ?? []);
            onSuccess?.(res.data.data);
          } else {
            setServiceList([]);
          }
        })
        .catch(() => {
          setServiceList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue, projectID]
  );

  const dbTypeList: string[] = useMemo(() => {
    if (isNeedFilterByOperationPermission) {
      return Array.from(
        new Set(
          serviceList
            .filter((i) =>
              checkDbServicePermission(
                OpPermissionItemOpPermissionTypeEnum.auth_db_service_data,
                i.uid
              )
            )
            .map((v) => v.db_type ?? '')
        )
      );
    }
    return Array.from(new Set(serviceList.map((v) => v.db_type ?? '')));
  }, [
    serviceList,
    isNeedFilterByOperationPermission,
    checkDbServicePermission
  ]);

  const serviceOptions = useMemo(() => {
    return dbTypeList.map((type) => {
      const optionSource = serviceList.filter((service) => {
        if (isNeedFilterByOperationPermission) {
          return (
            service.db_type === type &&
            checkDbServicePermission(
              OpPermissionItemOpPermissionTypeEnum.auth_db_service_data,
              service.uid
            )
          );
        }
        return service.db_type === type;
      });
      return {
        label: (
          <DatabaseTypeLogo
            dbType={type ?? ''}
            logoUrl={getLogoUrlByDbType(type ?? '')}
          />
        ),
        options: optionSource.map((service) => ({
          value: service?.uid ?? '',
          label: !!service.address
            ? `${service.name} (${service.address})`
            : service.name
        }))
      };
    });
  }, [
    dbTypeList,
    getLogoUrlByDbType,
    serviceList,
    checkDbServicePermission,
    isNeedFilterByOperationPermission
  ]);

  const serviceNameOptions = useMemo(() => {
    return dbTypeList.map((type) => ({
      label: (
        <DatabaseTypeLogo
          dbType={type ?? ''}
          logoUrl={getLogoUrlByDbType(type ?? '')}
        />
      ),
      options: serviceList
        .filter((service) => service.db_type === type)
        .map((service) => ({
          value: service?.name ?? '',
          label: !!service.address
            ? `${service.name} (${service.address})`
            : service.name
        }))
    }));
  }, [dbTypeList, getLogoUrlByDbType, serviceList]);

  return {
    loading,
    serviceList,
    updateServiceList,
    serviceOptions,
    serviceNameOptions
  };
};

export default useServiceOptions;
