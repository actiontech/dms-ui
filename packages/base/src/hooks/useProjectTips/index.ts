import { useState, useMemo, useCallback } from 'react';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { IListProjectV2 } from '@actiontech/shared/lib/api/base/service/common';
import { IListProjectsV2Params } from '@actiontech/shared/lib/api/base/service/Project/index.d';

const useProjectTips = () => {
  const [projectList, setProjectList] = useState<IListProjectV2[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateProjects = useCallback(
    (params?: Omit<IListProjectsV2Params, 'page_size'>) => {
      setTrue();
      DmsApi.ProjectService.ListProjectsV2({
        ...(params ?? {}),
        page_size: 9999
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setProjectList(res.data.data ?? []);
          }
        })
        .catch(() => {
          setProjectList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const projectIDOptions = useMemo(() => {
    return projectList.map((project) => {
      return {
        value: project.uid,
        label: project.name
      };
    });
  }, [projectList]);

  return {
    projectIDOptions,
    loading,
    updateProjects,
    projectList
  };
};

export default useProjectTips;
