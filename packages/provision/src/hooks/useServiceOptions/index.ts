import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useMemo, useCallback, useState } from 'react';
import { IListService } from '@actiontech/shared/lib/api/provision/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';

const useServiceOptions = () => {
  const { projectID } = useCurrentProject();

  const [serviceList, setServiceList] = useState<IListService[]>([]);

  const [loading, { setTrue, setFalse }] = useBoolean();

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

  const serviceOptions = useMemo(() => {
    return serviceList?.map((service) => {
      return {
        value: service.uid,
        label: service.name
      };
    });
  }, [serviceList]);

  const serviceNameOptions = useMemo(() => {
    return serviceList?.map((service) => {
      return {
        value: service.name,
        label: service.name
      };
    });
  }, [serviceList]);

  return {
    loading,
    serviceList,
    updateServiceList,
    serviceOptions,
    serviceNameOptions
  };
};

export default useServiceOptions;
