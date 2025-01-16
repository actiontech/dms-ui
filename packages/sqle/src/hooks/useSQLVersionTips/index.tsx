import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { useBoolean } from 'ahooks';
import { useCallback, useState, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ISqlVersionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const useSQLVersionTips = () => {
  const [loading, { setTrue, setFalse }] = useBoolean();

  const [sqlVersionList, setSqlVersionList] = useState<ISqlVersionResV1[]>([]);

  const { projectName } = useCurrentProject();

  const updateSqlVersionList = useCallback(() => {
    setTrue();
    sqlVersion
      .getSqlVersionListV1({
        project_name: projectName,
        page_index: 1,
        page_size: 9999
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSqlVersionList(res.data?.data ?? []);
        } else {
          setSqlVersionList([]);
        }
      })
      .catch(() => {
        setSqlVersionList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue, projectName]);

  const sqlVersionOptions = useMemo(() => {
    return sqlVersionList.map((item) => {
      return {
        label: item.version,
        value: item.version_id
      };
    });
  }, [sqlVersionList]);

  return {
    loading,
    sqlVersionList,
    updateSqlVersionList,
    sqlVersionOptions
  };
};

export default useSQLVersionTips;
