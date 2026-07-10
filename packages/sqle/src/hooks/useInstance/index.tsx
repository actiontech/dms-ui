import React, { useMemo, useCallback } from 'react';
import { Select } from 'antd';
import { ResponseCode } from '../../data/common';
import { instanceListDefaultKey } from '../../data/common';
import { IGetInstanceTipListV1Params } from '@actiontech/shared/lib/api/sqle/service/instance/index.d';
import { IInstanceTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import useDatabaseType from '../useDatabaseType';

type InstanceTipsStore = {
  data: Map<string, IInstanceTipResV1[]>;
  inflight: Map<string, Promise<IInstanceTipResV1[]>>;
  listeners: Set<() => void>;
};

const instanceTipsStore: InstanceTipsStore = {
  data: new Map(),
  inflight: new Map(),
  listeners: new Set()
};

export const getInstanceTipsCacheKey = (
  params: IGetInstanceTipListV1Params
): string => {
  return JSON.stringify({
    project_name: params.project_name,
    filter_db_type: params.filter_db_type ?? '',
    filter_by_business: params.filter_by_business ?? '',
    filter_workflow_template_id: params.filter_workflow_template_id ?? '',
    functional_module: params.functional_module ?? ''
  });
};

export const resetInstanceTipsCacheForTests = () => {
  instanceTipsStore.data.clear();
  instanceTipsStore.inflight.clear();
};

const notifyInstanceTipsListeners = () => {
  instanceTipsStore.listeners.forEach((listener) => listener());
};

const fetchInstanceTips = (
  params: IGetInstanceTipListV1Params
): Promise<IInstanceTipResV1[]> => {
  const cacheKey = getInstanceTipsCacheKey(params);

  if (instanceTipsStore.data.has(cacheKey)) {
    return Promise.resolve(instanceTipsStore.data.get(cacheKey)!);
  }

  const inflightRequest = instanceTipsStore.inflight.get(cacheKey);
  if (inflightRequest) {
    return inflightRequest;
  }

  const request = instance
    .getInstanceTipListV1(params)
    .then((res) => {
      const data =
        res.data.code === ResponseCode.SUCCESS ? res.data?.data ?? [] : [];
      instanceTipsStore.data.set(cacheKey, data);
      return data;
    })
    .catch(() => {
      instanceTipsStore.data.set(cacheKey, []);
      return [] as IInstanceTipResV1[];
    })
    .finally(() => {
      instanceTipsStore.inflight.delete(cacheKey);
      notifyInstanceTipsListeners();
    });

  instanceTipsStore.inflight.set(cacheKey, request);
  notifyInstanceTipsListeners();
  return request;
};

const useInstance = () => {
  const [subscribedCacheKey, setSubscribedCacheKey] = React.useState<
    string | undefined
  >();
  const [, forceUpdate] = React.useReducer((value: number) => value + 1, 0);
  const { getLogoUrlByDbType } = useDatabaseType();

  React.useEffect(() => {
    const listener = () => forceUpdate();
    instanceTipsStore.listeners.add(listener);
    return () => {
      instanceTipsStore.listeners.delete(listener);
    };
  }, []);

  const updateInstanceList = useCallback(
    (
      params: IGetInstanceTipListV1Params,
      options?: { onSuccess?: (data: IInstanceTipResV1[]) => void }
    ) => {
      const cacheKey = getInstanceTipsCacheKey(params);
      setSubscribedCacheKey(cacheKey);
      void fetchInstanceTips(params).then((data) => {
        options?.onSuccess?.(data);
      });
    },
    []
  );

  const instanceList = subscribedCacheKey
    ? instanceTipsStore.data.get(subscribedCacheKey) ?? []
    : [];
  const loading = subscribedCacheKey
    ? instanceTipsStore.inflight.has(subscribedCacheKey)
    : false;

  const generateInstanceSelectOption = useCallback(
    (instance_type: string = instanceListDefaultKey) => {
      let filterInstanceList: IInstanceTipResV1[] = [];
      if (instance_type !== instanceListDefaultKey) {
        filterInstanceList = instanceList.filter(
          (i) => i.instance_type === instance_type
        );
      } else {
        filterInstanceList = instanceList;
      }

      const instanceTypeList: string[] = Array.from(
        new Set(filterInstanceList.map((v) => v.instance_type ?? ''))
      );
      return instanceTypeList.map((type) => {
        return (
          <Select.OptGroup
            label={
              <DatabaseTypeLogo
                dbType={type}
                logoUrl={getLogoUrlByDbType(type)}
              />
            }
            key={type}
          >
            {filterInstanceList
              .filter((item) => item.instance_type === type)
              .map((item) => {
                return (
                  <Select.Option
                    key={item.instance_name}
                    value={item.instance_name ?? ''}
                  >
                    {!!item.host && !!item.port
                      ? `${item.instance_name} (${item.host}:${item.port})`
                      : item.instance_name}
                  </Select.Option>
                );
              })}
          </Select.OptGroup>
        );
      });
    },
    [getLogoUrlByDbType, instanceList]
  );

  const instanceOptions = useMemo(() => {
    const instanceTypeList: string[] = Array.from(
      new Set(instanceList.map((v) => v.instance_type ?? ''))
    );
    return instanceTypeList.map((type) => {
      return {
        label: (
          <DatabaseTypeLogo dbType={type} logoUrl={getLogoUrlByDbType(type)} />
        ),
        options: instanceList
          .filter((v) => v.instance_type === type)
          .map((v) => ({
            value: v.instance_name,
            label: `${v.instance_name}(${v.host}:${v.port})`
          }))
      };
    });
  }, [getLogoUrlByDbType, instanceList]);

  //todo: 筛选项 val 为 id
  const instanceIDOptions = useMemo(() => {
    const instanceTypeList: string[] = Array.from(
      new Set(instanceList.map((v) => v.instance_type ?? ''))
    );
    return instanceTypeList.map((type) => {
      return {
        label: (
          <DatabaseTypeLogo dbType={type} logoUrl={getLogoUrlByDbType(type)} />
        ),
        options: instanceList
          .filter((v) => v.instance_type === type)
          .map((v) => ({
            value: v.instance_id,
            label: `${v.instance_name}(${v.host}:${v.port})`
          }))
      };
    });
  }, [getLogoUrlByDbType, instanceList]);

  return {
    instanceList,
    loading,
    updateInstanceList,
    generateInstanceSelectOption,
    instanceOptions,
    instanceIDOptions
  };
};

export default useInstance;
