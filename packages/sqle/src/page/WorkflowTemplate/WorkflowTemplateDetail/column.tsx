import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowTemplateTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BasicTag } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { t, I18nKey } from '../../../locale';

const stepTypeNameMap: Record<string, I18nKey> = {
  sql_review: 'workflowTemplate.progressConfig.review.title',
  sql_execute: 'workflowTemplate.progressConfig.exec.title',
  export_review: 'workflowTemplate.progressConfig.exportReview.title',
  export_execute: 'workflowTemplate.progressConfig.exportExecute.title'
};

const getStepTypeName = (stepType?: string): string => {
  if (!stepType) return '-';
  const i18nKey = stepTypeNameMap[stepType];
  return i18nKey ? t(i18nKey) : stepType;
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
          if (workflowType === WorkflowTemplateTypeEnum.data_export) {
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
