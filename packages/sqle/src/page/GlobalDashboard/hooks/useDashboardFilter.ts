import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useMemo, useEffect, useCallback } from 'react';
import useInstance from '../../../hooks/useInstance';
import { Form } from 'antd';
import { GlobalDashboardFilterType } from '../index.type';

const useDashboardFilter = () => {
  const { bindProjects } = useCurrentUser();

  const [form] = Form.useForm<GlobalDashboardFilterType>();

  const projectId = Form.useWatch('projectId', form);

  const instanceId = Form.useWatch('instanceId', form);

  const projectPriority = Form.useWatch('projectPriority', form);

  const {
    updateInstanceList,
    instanceIDOptions,
    loading: getInstanceListLoading
  } = useInstance();

  const projectOptions = useMemo(() => {
    return bindProjects.map((project) => {
      return {
        label: project.project_name,
        value: project.project_id
      };
    });
  }, [bindProjects]);

  useEffect(() => {
    if (projectId) {
      updateInstanceList({
        project_name:
          projectOptions.find((i) => i.value === projectId)?.label ?? ''
      });
    }
  }, [projectId, updateInstanceList, projectOptions]);

  const filterValues = useMemo(() => {
    return {
      projectId: projectId,
      instanceId: instanceId,
      projectPriority: projectPriority
    };
  }, [projectId, instanceId, projectPriority]);

  const updateFilterValue = useCallback(
    (key: keyof GlobalDashboardFilterType, value?: string) => {
      form.setFieldValue(key, value);
    },
    [form]
  );

  return {
    projectOptions,
    updateInstanceList,
    instanceIDOptions,
    getInstanceListLoading,
    form,
    projectId,
    projectPriority,
    instanceId,
    updateFilterValue,
    filterValues
  };
};

export default useDashboardFilter;
