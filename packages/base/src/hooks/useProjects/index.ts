import { useState, useMemo, useCallback } from 'react';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { IListProject } from '@actiontech/shared/lib/api/base/service/common';

const useProjects = () => {
  const [projectList, setProjectList] = useState<IListProject[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateProjects = useCallback(() => {
    setTrue();
    Project.ListProjects({ page_size: 9999 })
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
  }, [setFalse, setTrue]);

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

export default useProjects;
