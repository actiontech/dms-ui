import React from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IDatabaseSource } from '@actiontech/shared/lib/api/base/service/common';
import {
  useCurrentProject,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import { DatabaseTypeLogo } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const useTaskSource = () => {
  const [taskSourceList, setTaskSourceList] = React.useState<IDatabaseSource[]>(
    []
  );
  const [loading, { setTrue, setFalse }] = useBoolean();

  const { projectID } = useCurrentProject();
  const { getLogoUrlByDbType } = useDbServiceDriver();

  const updateTaskSourceList = React.useCallback(() => {
    setTrue();
    dms
      .ListDatabaseSourceServiceTips({ project_uid: projectID })
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
  }, [setFalse, setTrue, projectID]);

  const generateTaskSourceSelectOption = React.useCallback(() => {
    return taskSourceList.map((source) => {
      return (
        <Select.Option key={source.source} value={source.source ?? ''}>
          {source.source}
        </Select.Option>
      );
    });
  }, [taskSourceList]);

  const generateTaskSourceDbTypesSelectOption = React.useCallback(
    (source: string) => {
      const dbTypes =
        taskSourceList.find((v) => v.source === source)?.db_types ?? [];
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

  return {
    taskSourceList,
    loading,
    updateTaskSourceList,
    generateTaskSourceSelectOption,
    generateTaskSourceDbTypesSelectOption
  };
};

export default useTaskSource;
