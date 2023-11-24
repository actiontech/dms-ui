import { useCallback, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Select, message as messageApi } from 'antd';
import qs from 'query-string';
import { DatabaseTypeLogo } from '@actiontech/shared';
import {
  useCurrentProject,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { t } from '../../../../../../locale';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IDataObjects } from '../index.d';

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
  const [message, messageContextHolder] = messageApi.useMessage();
  const { getLogoUrlByDbType } = useDbServiceDriver();

  const { data: businessOptions, loading: businessOptionsLoading } = useRequest(
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

  const { data: serviceOptions, loading: serviceOptionsLoading } = useRequest(
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
            label: `${item.name}(${item.db_type})`,
            type: item.db_type
          }));
        }),
    {
      refreshDeps: [business, projectID],
      debounceWait: 200,
      ready: !!business
    }
  );

  const generateServiceSelectOptions = useCallback(() => {
    if (!serviceOptions) return [];
    return serviceOptions.map((v) => {
      return (
        <Select.Option key={v.value} value={v.value}>
          <DatabaseTypeLogo
            dbType={v.label ?? ''}
            logoUrl={getLogoUrlByDbType(v.type ?? '')}
          />
        </Select.Option>
      );
    });
  }, [getLogoUrlByDbType, serviceOptions]);

  const {
    data: databaseOptions,
    loading: databaseOptionsLoading,
    refresh: refreshDatabaseOptions
  } = useRequest(
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

  const { runAsync: getTableOptions, loading: tableOptionLoading } = useRequest(
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

  const {
    data: operationOptions,
    loading: operationOptionsLoading,
    refresh: refreshOperationOptions
  } = useRequest(
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
      onSuccess: (res) => {
        if (res?.data.code === ResponseCode.SUCCESS) {
          message.success(t('auth.editTemplate.syncSuccessTips'));
        }
        refreshDatabaseOptions();
        refreshOperationOptions();
      }
    }
  );
  return {
    businessOptionsLoading,
    serviceOptionsLoading,
    databaseOptionsLoading,
    operationOptionsLoading,
    tableOptionLoading,
    businessOptions,
    serviceOptions,
    generateServiceSelectOptions,
    databaseOptions,
    getTableOptions,
    operationOptions,
    SyncService,
    messageContextHolder
  };
};
