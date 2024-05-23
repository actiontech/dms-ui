import { useCallback, useState } from 'react';
import { IInstanceConnectionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { omit } from 'lodash';
import { SharedStepDetails, DataSourceSchemaCollection } from '../index.type';

const DEFAULT_DB_SOURCE_INFO = { '0': {} };

const useSharedStepDetail = (): SharedStepDetails => {
  const [isAuditing, setIsAuditing] = useState(false);

  const [isSupportFileModeExecuteSql, setIsSupportFileModeExecuteSql] =
    useState(false);

  const [isDisabledForDifferenceSql, setIsDisabledForDifferenceSql] =
    useState(false);

  const [instanceTestConnectResults, setInstanceTestConnectResults] = useState<
    IInstanceConnectionResV1[]
  >([]);

  const [sqlStatementTabActiveKey, setActiveSqlStatementTabKey] =
    useState<string>('');

  const [dbSourceInfoCollection, setDbSourceInfoCollection] =
    useState<DataSourceSchemaCollection>(DEFAULT_DB_SOURCE_INFO);

  const updateDbSourceInfoCollection = useCallback(
    (key: string, info?: DataSourceSchemaCollection[string]) => {
      //remove
      if (!info) {
        setDbSourceInfoCollection((v) => {
          return omit(v, key);
        });
        return;
      }

      setDbSourceInfoCollection((v) => {
        //add
        if (!v) {
          return {
            [key]: info
          };
        }

        // clear
        if (Object.keys(info).length === 0) {
          return { ...v, [key]: {} };
        }

        // merge
        return {
          ...v,
          [key]: {
            ...v[key],
            ...info
          }
        };
      });
    },
    []
  );

  const resetAllSharedData = useCallback(() => {
    setIsAuditing(false);
    setIsSupportFileModeExecuteSql(false);
    setDbSourceInfoCollection(DEFAULT_DB_SOURCE_INFO);
    setInstanceTestConnectResults([]);
    setIsDisabledForDifferenceSql(false);
    setActiveSqlStatementTabKey('');
  }, []);

  return {
    isAuditing: {
      value: isAuditing,
      set: setIsAuditing
    },
    isSupportFileModeExecuteSql: {
      value: isSupportFileModeExecuteSql,
      set: setIsSupportFileModeExecuteSql
    },
    dbSourceInfoCollection: {
      value: dbSourceInfoCollection,
      set: updateDbSourceInfoCollection
    },
    instanceTestConnectResults: {
      value: instanceTestConnectResults,
      set: setInstanceTestConnectResults
    },
    isDisabledForDifferenceSql: {
      value: isDisabledForDifferenceSql,
      set: setIsDisabledForDifferenceSql
    },
    sqlStatementTabActiveKey: {
      value: sqlStatementTabActiveKey,
      set: setActiveSqlStatementTabKey
    },

    resetAllSharedData
  };
};

export default useSharedStepDetail;
