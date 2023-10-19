import { useRequest } from 'ahooks';
import { useMemo } from 'react';
import { IDataObjects } from '../index.d';
import qs from 'query-string';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

const defaultParams = {
  page_index: 1,
  page_size: 9999
};

export const useQueryData = (
  visible: boolean,
  business?: string,
  service?: string,
  dataObjects?: IDataObjects[]
) => {
  const { projectID } = useCurrentProject();
  const { data: businessOptions } = useRequest(
    () =>
      auth
        .AuthListBusiness({
          namespace_uid: projectID
        })
        .then((res) => {
          return res.data.data?.businesses?.map((item) => ({
            value: item ?? '',
            label: item ?? ''
          }));
        }),
    {
      ready: visible
    }
  );

  const { data: serviceOptions } = useRequest(
    () =>
      auth
        .AuthListService({
          business,
          filter_by_namespace: projectID,
          ...defaultParams
        })
        .then((res) => {
          return res.data.data?.map((item) => ({
            value: item.uid ?? '',
            label: `${item.name}(${item.db_type})`
          }));
        }),
    {
      refreshDeps: [business, projectID],
      debounceWait: 200,
      ready: !!business
    }
  );
  const { data: databaseOptions, refresh: refreshDatabaseOptions } = useRequest(
    () =>
      auth
        .AuthListDatabase({
          service_uid: service ?? '',
          ...defaultParams
        })
        .then((res) => {
          return res.data.data?.map((item) => ({
            value: item.uid ?? '',
            label: item.name ?? ''
          }));
        }),
    {
      refreshDeps: [service],
      ready: !!service
    }
  );

  const { runAsync: getTableOptions } = useRequest(
    (id: string) =>
      auth
        .AuthListTable({
          database_uid: id,
          ...defaultParams
        })
        .then((res) => {
          return res.data.data?.map((item) => ({
            value: item.uid ?? '',
            label: item.name ?? ''
          }));
        }),
    {
      manual: true
    }
  );
  const objects = useMemo(() => {
    let objectsFlag: string[] = [];
    if (dataObjects?.length) {
      dataObjects.forEach((item) => {
        if (item?.tables?.length) {
          objectsFlag = objectsFlag.concat(item.tables);
        } else if (item?.database) {
          objectsFlag.push(item.database);
        }
      });
    }
    if (!objectsFlag.length && service) {
      objectsFlag.push(service);
    }
    return objectsFlag;
  }, [dataObjects, service]);

  const { data: operationOptions, refresh: refreshOperationOptions } =
    useRequest(
      () =>
        auth
          .AuthListDataOperationSets(
            {
              data_object_uids: objects,
              ...defaultParams
            },
            {
              paramsSerializer: (params) => qs.stringify(params)
            }
          )
          .then((res) => {
            return res.data.data?.map((item) => ({
              value: item.uid ?? '',
              label: item.name ?? ''
            }));
          }),
      {
        refreshDeps: [objects],
        ready: !!objects.length
      }
    );

  const SyncService = useRequest(
    () =>
      auth.AuthSyncService({
        service_uids: [service ?? '']
      }),
    {
      manual: true,
      ready: !!service,
      onSuccess: () => {
        refreshDatabaseOptions();
        refreshOperationOptions();
      }
    }
  );
  return {
    businessOptions,
    serviceOptions,
    databaseOptions,
    getTableOptions,
    operationOptions,
    SyncService
  };
};
