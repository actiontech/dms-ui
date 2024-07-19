import {
  useCurrentProject,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { IListService } from '@actiontech/shared/lib/api/provision/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { DatabaseTypeLogo } from '@actiontech/shared';
import useUserOperationPermission from '../useUserOperationPermission';

const useServiceOptions = (isNeedFilterByOperationPermission = false) => {
  const { projectID } = useCurrentProject();

  const [serviceList, setServiceList] = useState<IListService[]>([]);

  const [loading, { setTrue, setFalse }] = useBoolean();

  const { getLogoUrlByDbType } = useDbServiceDriver();

  const { isHaveServicePermission, updateUserOperationPermission } =
    useUserOperationPermission();

  const updateServiceList = useCallback(
    (business?: string) => {
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
            .filter((i) => isHaveServicePermission(i.uid))
            .map((v) => v.db_type ?? '')
        )
      );
    }
    return Array.from(new Set(serviceList.map((v) => v.db_type ?? '')));
  }, [serviceList, isNeedFilterByOperationPermission, isHaveServicePermission]);

  const serviceOptions = useMemo(() => {
    return dbTypeList.map((type) => {
      const optionSource = serviceList.filter((service) => {
        if (isNeedFilterByOperationPermission) {
          return (
            service.db_type === type && isHaveServicePermission(service.uid)
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
    isHaveServicePermission,
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

  useEffect(() => {
    if (isNeedFilterByOperationPermission) {
      updateUserOperationPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    serviceList,
    updateServiceList,
    serviceOptions,
    serviceNameOptions
  };
};

export default useServiceOptions;
