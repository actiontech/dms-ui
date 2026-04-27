import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BasicTag } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { t } from '../../../locale';
import { WorkflowTemplateDetailResV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const stepTypeNameMap: Record<string, string> = {
  sql_review: t('workflowTemplate.progressConfig.review.title'),
  sql_execute: t('workflowTemplate.progressConfig.exec.title'),
  export_review: t('workflowTemplate.progressConfig.exportReview.title'),
  export_execute: t('workflowTemplate.progressConfig.exportExecute.title')
};

const getStepTypeName = (stepType?: string): string => {
  if (!stepType) return '-';
  const name = stepTypeNameMap[stepType];
  return name ? name : stepType;
};

export const WorkflowTemplateListColumn =
  (): ActiontechTableColumn<IWorkflowTemplateDetailResV1> => {
    return [
      {
        dataIndex: 'workflow_template_name',
        title: () => t('workflowTemplate.list.table.workflowTemplateName')
      },
      {
        dataIndex: 'workflow_type',
        title: () => t('workflowTemplate.list.table.applicableType'),
        render: (workflowType) => {
          if (
            workflowType ===
            WorkflowTemplateDetailResV1WorkflowTypeEnum.data_export
          ) {
            return (
              <BasicTag color="green">
                {t('workflowTemplate.list.type.dataExport')}
              </BasicTag>
            );
          }
          return (
            <BasicTag color="blue">
              {t('workflowTemplate.list.type.workflow')}
            </BasicTag>
          );
        }
      },
      {
        dataIndex: 'workflow_step_template_list',
        title: () => t('workflowTemplate.list.table.approvalNodeDesc'),
        render: (stepList) => {
          if (!stepList || stepList.length === 0) return '-';
          return stepList
            .map((step: { type?: string }) => getStepTypeName(step.type))
            .join(' -> ');
        }
      },
      {
        dataIndex: 'update_time',
        title: () => t('workflowTemplate.list.table.updateTime'),
        render: (value) => {
          return formatTime(value, '-');
        }
      }
    ];
  };
