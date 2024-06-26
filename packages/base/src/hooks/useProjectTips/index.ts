import { useState, useCallback } from 'react';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const useProjectTips = () => {
  const [projectBusiness, setProjectBusiness] = useState<string[]>([]);
  const [isFixedBusiness, setIsFixedBusiness] = useState<boolean>(false);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const { projectID } = useCurrentProject();

  const updateProjectTips = useCallback(() => {
    setTrue();
    dms
      .GetProjectTips({
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const currentProject = res.data?.data?.[0] ?? {};
          setProjectBusiness(currentProject?.business ?? []);
          setIsFixedBusiness(currentProject?.is_fixed_business ?? false);
        } else {
          setProjectBusiness([]);
          setIsFixedBusiness(false);
        }
      })
      .catch(() => {
        setProjectBusiness([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue, projectID]);

  const projectBusinessOption = useCallback(() => {
    return projectBusiness.map((business) => {
      return {
        value: business,
        label: business
      };
    });
  }, [projectBusiness]);

  return {
    projectBusiness,
    loading,
    updateProjectTips,
    projectBusinessOption,
    isFixedBusiness
  };
};

export default useProjectTips;
