import React from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IDBServiceSyncTaskTip } from '@actiontech/shared/lib/api/base/service/common';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import { DatabaseTypeLogo } from '@actiontech/shared';
import DBServiceSyncTaskService from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask';

const useTaskSource = () => {
  const [taskSourceList, setTaskSourceList] = React.useState<
    IDBServiceSyncTaskTip[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const { getLogoUrlByDbType } = useDbServiceDriver();

  const updateTaskSourceList = React.useCallback(() => {
    setTrue();
    DBServiceSyncTaskService.ListDBServiceSyncTaskTips()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setTaskSourceList(res.data?.data ?? []);
        } else {
          setTaskSourceList([]);
        }
      })
      .catch(() => {
        setTaskSourceList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateTaskSourceSelectOption = React.useCallback(() => {
    return taskSourceList.map((item) => {
      return (
        <Select.Option
          key={item.service_source_name}
          value={item.service_source_name ?? ''}
        >
          {item.service_source_name}
        </Select.Option>
      );
    });
  }, [taskSourceList]);

  const generateTaskSourceDbTypesSelectOption = React.useCallback(
    (source: string) => {
      const dbTypes =
        taskSourceList.find((v) => v.service_source_name === source)?.db_type ??
        [];
      return dbTypes.map((type) => {
        return (
          <Select.Option key={type} value={type ?? ''}>
            <DatabaseTypeLogo
              dbType={type}
              logoUrl={getLogoUrlByDbType(type ?? '')}
            />
          </Select.Option>
        );
      });
    },
    [getLogoUrlByDbType, taskSourceList]
  );

  const generateTaskSourceAdditionalParams = React.useCallback(
    (source: string) => {
      return taskSourceList.find((v) => v.service_source_name === source)
        ?.params;
    },
    [taskSourceList]
  );

  return {
    taskSourceList,
    loading,
    updateTaskSourceList,
    generateTaskSourceSelectOption,
    generateTaskSourceDbTypesSelectOption,
    generateTaskSourceAdditionalParams
  };
};

export default useTaskSource;
