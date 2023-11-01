import React from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd5';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const useDbService = () => {
  const [dbServiceList, setDbServiceList] = React.useState<IListDBService[]>(
    []
  );

  const [loading, { setTrue, setFalse }] = useBoolean();

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

  const generateDbServiceSelectOption = React.useCallback(() => {
    const dbTypeList: string[] = Array.from(
      new Set(dbServiceList.map((v) => v.db_type ?? ''))
    );
    return dbTypeList.map((type) => {
      return (
        <Select.OptGroup
          label={<DatabaseTypeLogo dbType={type ?? ''} />}
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
