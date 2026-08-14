import { useRequest } from 'ahooks';
import { useMemo } from 'react';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { getWorkflowTemplateListV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const useWorkflowTemplateTips = (
  workflowType: getWorkflowTemplateListV1WorkflowTypeEnum,
  ready = true
) => {
  const { projectName } = useCurrentProject();

  const { data, loading, refresh } = useRequest(
    () =>
      workflow
        .getWorkflowTemplateListV1({
          project_name: projectName,
          workflow_type: workflowType
        })
        .then((res) => res.data.data ?? []),
    {
      ready: !!projectName && ready,
      refreshDeps: [projectName, workflowType]
    }
  );

  const templateOptions = useMemo(
    () =>
      (data ?? []).map((item: IWorkflowTemplateDetailResV1) => ({
        label: item.workflow_template_name ?? '',
        value: item.workflow_template_id,
        text: item.workflow_template_name
      })),
    [data]
  );

  const defaultTemplateId = useMemo(() => {
    const list = data ?? [];
    if (list.length === 0) {
      return undefined;
    }
    const defaultItem = list.find((item) => item.is_default);
    return defaultItem?.workflow_template_id ?? list[0]?.workflow_template_id;
  }, [data]);

  return {
    templateList: data ?? [],
    templateOptions,
    defaultTemplateId,
    loading,
    refresh
  };
};

export default useWorkflowTemplateTips;
