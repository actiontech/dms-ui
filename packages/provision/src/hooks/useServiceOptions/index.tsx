import {
  useCurrentProject,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useMemo, useCallback, useState } from 'react';
import { IListService } from '@actiontech/shared/lib/api/provision/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { DatabaseTypeLogo } from '@actiontech/shared';

const useServiceOptions = () => {
  const { projectID } = useCurrentProject();

  const [serviceList, setServiceList] = useState<IListService[]>([]);

  const [loading, { setTrue, setFalse }] = useBoolean();

  const { getLogoUrlByDbType } = useDbServiceDriver();

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

  const dbTypeList: string[] = useMemo(
    () => Array.from(new Set(serviceList.map((v) => v.db_type ?? ''))),
    [serviceList]
  );

  const serviceOptions = useMemo(() => {
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
          value: service?.uid ?? '',
          label: !!service.address
            ? `${service.name} (${service.address})`
            : service.name
        }))
    }));
  }, [dbTypeList, getLogoUrlByDbType, serviceList]);

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
