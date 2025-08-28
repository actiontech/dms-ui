import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import { useMemo, useState, useCallback } from 'react';
import { ResponseCode } from '../../data/common';
import { instanceListDefaultKey } from '../../data/common';
import { IGetInstanceTipListV2Params } from '@actiontech/shared/lib/api/sqle/service/instance/index.d';
import { IInstanceTipResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import useDatabaseType from '../useDatabaseType';
import { SqleApi } from '@actiontech/shared/lib/api';

const useInstance = () => {
  const [instanceList, setInstanceList] = useState<IInstanceTipResV2[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const { getLogoUrlByDbType } = useDatabaseType();

  const updateInstanceList = useCallback(
    (
      params: IGetInstanceTipListV2Params,
      options?: { onSuccess?: (data: IInstanceTipResV2[]) => void }
    ) => {
      setTrue();
      SqleApi.InstanceService.getInstanceTipListV2(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            options?.onSuccess?.(res.data.data ?? []);
            setInstanceList(res.data?.data ?? []);
          } else {
            setInstanceList([]);
          }
        })
        .catch(() => {
          setInstanceList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateInstanceSelectOption = useCallback(
    (instance_type: string = instanceListDefaultKey) => {
      let filterInstanceList: IInstanceTipResV2[] = [];
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

  const getInstanceDbType = useCallback(
    (instanceName: string) => {
      return (
        instanceList.find((v) => v.instance_name === instanceName)
          ?.instance_type ?? ''
      );
    },
    [instanceList]
  );

  return {
    instanceList,
    loading,
    updateInstanceList,
    generateInstanceSelectOption,
    instanceOptions,
    instanceIDOptions,
    getInstanceDbType
  };
};

export default useInstance;
