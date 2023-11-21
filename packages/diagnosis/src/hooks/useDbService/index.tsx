import React from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd5';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';

// todo: 需要后端提供接口替换
const useDbService = () => {
  const [dbServiceList, setDbServiceList] = React.useState<IListDBService[]>(
    []
  );

  const [loading, { setTrue, setFalse }] = useBoolean();
  const { getLogoUrlByDbType } = useDbServiceDriver();

  const updateDbServiceList = React.useCallback(() => {
    setTrue();
    dms
      .ListDBServices({
        page_size: 9999,
        project_uid: ''
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
  }, [setFalse, setTrue]);

  const generateDbServiceSelectOption = React.useCallback(() => {
    const dbTypeList: string[] = Array.from(
      new Set(dbServiceList.map((v) => v.db_type ?? ''))
    );
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
  }, [dbServiceList, getLogoUrlByDbType]);

  return {
    dbServiceList,
    loading,
    updateDbServiceList,
    generateDbServiceSelectOption
  };
};

export default useDbService;
