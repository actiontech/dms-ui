import React from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd5';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';

const useDbService = () => {
  const [dbServiceList, setDbServiceList] = React.useState<IListDBService[]>(
    []
  );

  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateDbServiceList = React.useCallback(() => {
    // todo: 需要后端提供接口
  }, [setFalse, setTrue]);

  const generateDbServiceSelectOption = React.useCallback(() => {
    const dbTypeList: string[] = Array.from(
      new Set(dbServiceList.map((v) => v.db_type ?? ''))
    );
    return dbTypeList.map((type) => {
      return (
        <Select.OptGroup
          label={<DatabaseTypeLogo dbType={type ?? ''} logoUrl={type ?? ''} />}
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
  }, [dbServiceList]);

  return {
    dbServiceList,
    loading,
    updateDbServiceList,
    generateDbServiceSelectOption
  };
};

export default useDbService;
