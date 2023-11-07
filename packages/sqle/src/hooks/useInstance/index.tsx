import { useBoolean } from 'ahooks';
import { Select } from 'antd5';
import { useMemo, useState, useCallback } from 'react';
import { ResponseCode } from '../../data/common';
import { instanceListDefaultKey } from '../../data/common';
import { IGetInstanceTipListV1Params } from '@actiontech/shared/lib/api/sqle/service/instance/index.d';
import { IInstanceTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';

const useInstance = () => {
  const [instanceList, setInstanceList] = useState<IInstanceTipResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateInstanceList = useCallback(
    (params: IGetInstanceTipListV1Params) => {
      setTrue();
      instance
        .getInstanceTipListV1(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
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
                logoUrl={`/sqle/v1/static/instance_logo?instance_type=${type}`}
              />
            }
            key={type}
          >
            {filterInstanceList
              .filter((instance) => instance.instance_type === type)
              .map((instance) => {
                return (
                  <Select.Option
                    key={instance.instance_name}
                    value={instance.instance_name ?? ''}
                  >
                    {!!instance.host && !!instance.port
                      ? `${instance.instance_name} (${instance.host}:${instance.port})`
                      : instance.instance_name}
                  </Select.Option>
                );
              })}
          </Select.OptGroup>
        );
      });
    },
    [instanceList]
  );

  const instanceOptions = useMemo(() => {
    const instanceTypeList: string[] = Array.from(
      new Set(instanceList.map((v) => v.instance_type ?? ''))
    );
    return instanceTypeList.map((type) => {
      return {
        label: (
          <DatabaseTypeLogo
            dbType={type}
            logoUrl={`/sqle/v1/static/instance_logo?instance_type=${type}`}
          />
        ),
        options: instanceList
          .filter((v) => v.instance_type === type)
          .map((v) => ({
            value: v.instance_name,
            label: `${v.instance_name}(${v.host}:${v.port})`
          }))
      };
    });
  }, [instanceList]);

  //todo: 筛选项 val 为 id
  const instanceIDOptions = useMemo(() => {
    const instanceTypeList: string[] = Array.from(
      new Set(instanceList.map((v) => v.instance_type ?? ''))
    );
    return instanceTypeList.map((type) => {
      return {
        label: <DatabaseTypeLogo dbType={type} />,
        options: instanceList
          .filter((v) => v.instance_type === type)
          .map((v) => ({
            value: v.instance_id,
            label: `${v.instance_name}(${v.host}:${v.port})`
          }))
      };
    });
  }, [instanceList]);

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
