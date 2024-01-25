import React, { useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListDBServiceTipItem } from '@actiontech/shared/lib/api/base/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IListDBServiceTipsParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';

const useDbService = () => {
  const [dbServiceList, setDbServiceList] = React.useState<
    IListDBServiceTipItem[]
  >([]);

  const [loading, { setTrue, setFalse }] = useBoolean();
  const { getLogoUrlByDbType } = useDbServiceDriver();

  const updateDbServiceList = React.useCallback(
    (params: IListDBServiceTipsParams) => {
      setTrue();
      dms
        .ListDBServiceTips(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setDbServiceList(res.data?.data ?? []);
          } else {
            setDbServiceList([]);
          }
        })
        .catch(() => {
          setDbServiceList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const dbTypeList: string[] = useMemo(
    () => Array.from(new Set(dbServiceList.map((v) => v.db_type ?? ''))),
    [dbServiceList]
  );

  const generateCommonOptions = React.useCallback(
    (valueType: 'id' | 'name') => {
      return dbTypeList.map((type) => {
        return (
          <Select.OptGroup
            label={
              <DatabaseTypeLogo
                dbType={type ?? ''}
                logoUrl={getLogoUrlByDbType(type ?? '')}
              />
            }
            key={type}
          >
            {dbServiceList
              .filter((db) => db.db_type === type)
              .map((db) => {
                const id = db.id ?? '';
                const name = db.name ?? '';
                const label =
                  !!db.host && !!db.port
                    ? `${db.name} (${db.host}:${db.port})`
                    : db.name;
                return (
                  <Select.Option
                    key={db.id}
                    value={valueType === 'id' ? id : name}
                    label={label}
                  >
                    {label}
                  </Select.Option>
                );
              })}
          </Select.OptGroup>
        );
      });
    },
    [dbServiceList, dbTypeList, getLogoUrlByDbType]
  );

  /**
   * 提供 value 为 id 的 数据源options
   */
  const generateDbServiceIDSelectOptions = React.useCallback(() => {
    return generateCommonOptions('id');
  }, [generateCommonOptions]);

  const generateDbServiceSelectOptions = React.useCallback(() => {
    return generateCommonOptions('name');
  }, [generateCommonOptions]);

  const dbServiceOptions = useMemo(() => {
    return dbTypeList.map((type) => ({
      label: (
        <DatabaseTypeLogo
          dbType={type ?? ''}
          logoUrl={getLogoUrlByDbType(type ?? '')}
        />
      ),
      options: dbServiceList
        .filter((db) => db.db_type === type)
        .map((db) => ({
          value: db?.name ?? '',
          label:
            !!db.host && !!db.port
              ? `${db.name} (${db.host}:${db.port})`
              : db.name
        }))
    }));
  }, [dbServiceList, dbTypeList, getLogoUrlByDbType]);

  return {
    dbServiceList,
    dbServiceOptions,
    loading,
    updateDbServiceList,
    generateDbServiceSelectOptions,
    generateDbServiceIDSelectOptions
  };
};

export default useDbService;
