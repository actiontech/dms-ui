import { useState, useCallback } from 'react';
import { useBoolean } from 'ahooks';
import useCurrentProject from '../useCurrentProject';
import Project from '../../api/base/service/Project';
import { ResponseCode } from '../../enum';

/**
 * @deprecated GetProjectTips接口已废弃，后续此hooks将删除
 */
const useProjectBusinessTips = () => {
  const [projectBusiness, setProjectBusiness] = useState<string[]>([]);
  const [isFixedBusiness, setIsFixedBusiness] = useState<boolean>(false);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const { projectID } = useCurrentProject();

  const updateProjectBusinessTips = useCallback(
    (queryByProjectID?: string) => {
      setTrue();
      Project.GetProjectTips({
        project_uid: queryByProjectID ?? projectID
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
    },
    [setFalse, setTrue, projectID]
  );

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
    updateProjectBusinessTips,
    projectBusinessOption,
    isFixedBusiness
  };
};

export default useProjectBusinessTips;
