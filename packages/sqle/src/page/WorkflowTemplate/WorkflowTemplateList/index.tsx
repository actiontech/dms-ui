import { Spin, Table, Tag } from 'antd';
import React, { useMemo } from 'react';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { PageHeader } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import {
  IWorkflowTemplateDetailResV1,
  IWorkFlowStepTemplateResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowTemplateTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import type { ColumnsType } from 'antd/es/table';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { Link } from 'react-router-dom';

const WorkflowTemplateList: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();

  const { data: templateList, loading } = useRequest(
    () =>
      workflow
        .getWorkflowTemplatesV1({
          project_name: projectName
        })
        .then((res) => res.data.data?.workflow_template_list ?? []),
    {
      ready: !!projectName
    }
  );

  const generateStepDescription = (
    steps?: IWorkFlowStepTemplateResV1[]
  ): string => {
    if (!steps || steps.length === 0) {
      return '-';
    }
    const stepTypeNameMap: Record<string, string> = {
      sql_review: t('workflowTemplate.progressConfig.review.title'),
      sql_execute: t('workflowTemplate.progressConfig.exec.title'),
      export_review: t('workflowTemplate.progressConfig.review.title'),
      export_execute: t('workflowTemplate.progressConfig.exec.title')
    };
    return steps
      .map((step) => stepTypeNameMap[step.type ?? ''] ?? step.type ?? '')
      .join(' -> ');
  };

  const getEditUrl = (
    templateName: string,
    workflowType?: WorkflowTemplateTypeEnum
  ): string => {
    const basePath = `/sqle/project/${projectID}/progress/update/${encodeURIComponent(templateName)}`;
    const queryType = workflowType ?? WorkflowTemplateTypeEnum.workflow;
    return `${basePath}?workflow_type=${queryType}`;
  };

  const columns: ColumnsType<IWorkflowTemplateDetailResV1> = useMemo(
    () => [
      {
        title: t('workflowTemplate.list.table.workflowTemplateName'),
        dataIndex: 'workflow_template_name',
        key: 'workflow_template_name'
      },
      {
        title: t('workflowTemplate.list.table.workflowType'),
        dataIndex: 'workflow_type',
        key: 'workflow_type',
        render: (workflowType: string) => {
          if (workflowType === WorkflowTemplateTypeEnum.data_export) {
            return (
              <Tag color="green">
                {t('workflowTemplate.list.workflowType.data_export')}
              </Tag>
            );
          }
          return (
            <Tag color="blue">
              {t('workflowTemplate.list.workflowType.workflow')}
            </Tag>
          );
        }
      },
      {
        title: t('workflowTemplate.list.table.stepCount'),
        key: 'step_count',
        render: (_, record) =>
          record.workflow_step_template_list?.length ?? 0
      },
      {
        title: t('workflowTemplate.list.table.stepDescription'),
        key: 'step_description',
        render: (_, record) =>
          generateStepDescription(record.workflow_step_template_list)
      },
      {
        title: t('workflowTemplate.list.table.updateTime'),
        dataIndex: 'update_time',
        key: 'update_time'
      },
      {
        title: t('workflowTemplate.list.table.action'),
        key: 'action',
        // #if [ee]
        render: (_, record) => (
          <PermissionControl
            permission={PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.UPDATE}
          >
            <Link
              to={getEditUrl(
                record.workflow_template_name ?? '',
                record.workflow_type
              )}
            >
              {t('workflowTemplate.list.operator.edit')}
            </Link>
          </PermissionControl>
        )
        // #endif
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, projectID]
  );

  return (
    <>
      <PageHeader title={t('workflowTemplate.pageTitle')} />
      <Spin spinning={loading}>
        <Table
          rowKey="workflow_template_name"
          columns={columns}
          dataSource={templateList}
          pagination={false}
        />
      </Spin>
    </>
  );
};

export default WorkflowTemplateList;
