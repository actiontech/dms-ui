import React, { useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const useDbService = () => {
  const [dbServiceList, setDbServiceList] = React.useState<IListDBService[]>(
    []
  );

  const [loading, { setTrue, setFalse }] = useBoolean();
  const { getLogoUrlByDbType } = useDbServiceDriver();

  const updateDbServiceList = React.useCallback(
    (project_uid: string) => {
      setTrue();
      dms
        .ListDBServices({
          page_size: 9999,
          project_uid
        })
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

  /**
   * 提供 value 为 id 的 数据源options
   */
  const generateDbServiceIDSelectOptions = React.useCallback(() => {
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
              return (
                <Select.Option
                  key={db.uid}
                  value={db.uid ?? ''}
                  label={
                    !!db.host && !!db.port
                      ? `${db.name} (${db.host}:${db.port})`
                      : db.name
                  }
                >
                  {!!db.host && !!db.port
                    ? `${db.name} (${db.host}:${db.port})`
                    : db.name}
                </Select.Option>
              );
            })}
        </Select.OptGroup>
      );
    });
  }, [dbServiceList, dbTypeList, getLogoUrlByDbType]);
  const generateDbServiceSelectOptions = React.useCallback(() => {
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
              return (
                <Select.Option
                  key={db.uid}
                  value={db.name ?? ''}
                  label={
                    !!db.host && !!db.port
                      ? `${db.name} (${db.host}:${db.port})`
                      : db.name
                  }
                >
                  {!!db.host && !!db.port
                    ? `${db.name} (${db.host}:${db.port})`
                    : db.name}
                </Select.Option>
              );
            })}
        </Select.OptGroup>
      );
    });
  }, [dbServiceList, dbTypeList, getLogoUrlByDbType]);

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
