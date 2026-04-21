import { useMemo, useCallback } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/features';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { PageHeader } from '@actiontech/dms-kit';
import {
  ActiontechTable,
  ActiontechTableWrapper
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowTemplateListColumn } from './column';
import { WorkflowTemplateTableActions } from './actions';

const WorkflowTemplateDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const { parse2TableActionPermissions } = usePermission();
  const navigate = useTypedNavigate();

  const columns = useMemo(() => WorkflowTemplateListColumn(), []);

  const { data: templateList, loading } = useRequest(
    () =>
      workflow
        .getWorkflowTemplateListV1({
          project_name: projectName
        })
        .then((res) => res.data.data ?? []),
    {
      ready: !!projectName
    }
  );

  const onEditTemplate = useCallback(
    (record: IWorkflowTemplateDetailResV1) => {
      navigate(ROUTE_PATHS.SQLE.PROGRESS.update, {
        params: {
          projectID,
          workflowName: record.workflow_template_name ?? ''
        },
        queries: {
          workflowType: record.workflow_type ?? ''
        }
      });
    },
    [navigate, projectID]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      WorkflowTemplateTableActions(onEditTemplate)
    );
  }, [parse2TableActionPermissions, onEditTemplate]);

  return (
    <>
      <PageHeader title={t('workflowTemplate.pageTitle')} />
      <ActiontechTableWrapper loading={loading}>
        <ActiontechTable
          dataSource={templateList}
          rowKey={(record: IWorkflowTemplateDetailResV1) =>
            record?.workflow_template_name ?? ''
          }
          loading={loading}
          columns={columns}
          // #if [ee]
          actions={actions}
          // #endif
        />
      </ActiontechTableWrapper>
    </>
  );
};

export default WorkflowTemplateDetail;
