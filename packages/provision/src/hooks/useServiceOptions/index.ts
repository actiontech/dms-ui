import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';

const useServiceOptions = (business?: string) => {
  const { projectID } = useCurrentProject();

  const { data: serviceOptions } = useRequest(
    () =>
      auth
        .AuthListService({
          page_index: 1,
          page_size: 999,
          filter_by_namespace: projectID,
          business
        })
        .then((res) => {
          return res.data.data?.map((item) => ({
            value: item.uid ?? '',
            label: item.name
          }));
        }),
    {
      refreshDeps: [business]
    }
  );

  const serviceNameOptions = useMemo(() => {
    return serviceOptions?.map((user) => {
      return {
        value: user.label,
        label: user.label
      };
    });
  }, [serviceOptions]);

  return { serviceOptions, serviceNameOptions };
};

export default useServiceOptions;
