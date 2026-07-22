import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { BasicTag } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { t } from '../../../locale';

export const WorkflowTemplateListColumn: () => ActiontechTableColumn<IWorkflowTemplateDetailResV1> =
  () => {
    return [
      {
        dataIndex: 'workflow_template_name',
        title: () => t('workflowTemplate.list.table.workflowTemplateName'),
        render: (name, record) => {
          if (!name) {
            return '-';
          }
          return (
            <Space>
              <span>{name}</span>
              {record.is_default ? (
                <BasicTag color="green">
                  {t('workflowTemplate.list.table.defaultTag')}
                </BasicTag>
              ) : null}
            </Space>
          );
        }
      },
      {
        dataIndex: 'desc',
        title: () => t('workflowTemplate.list.table.desc'),
        className: 'ellipsis-column-width',
        render: (desc) => {
          if (!desc) {
            return '-';
          }
          return <BasicTypographyEllipsis textCont={desc} />;
        }
      },
      {
        dataIndex: 'update_time',
        title: () => t('workflowTemplate.list.table.updateTime'),
        render: (time) => formatTime(time, '-')
      }
    ];
  };
