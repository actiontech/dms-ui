import { Space } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, SegmentedTabs } from '@actiontech/dms-kit';
import { TableRefreshButton } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { getWorkflowTemplateListV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { WorkflowTemplatePageHeaderActions } from './actions';
import { WorkflowTemplateStyleWrapper } from './style';
import WorkflowTemplateListTable from './components/WorkflowTemplateListTable';
import WorkflowTemplateSingleDetail from './components/WorkflowTemplateSingleDetail';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

const WorkflowTemplateDetail: React.FC = () => {
  const { t } = useTranslation();

  // #if [ee]
  const { projectID } = useCurrentProject();
  const [activeKey, setActiveKey] =
    useState<getWorkflowTemplateListV1WorkflowTypeEnum>(
      getWorkflowTemplateListV1WorkflowTypeEnum.workflow
    );
  const pageHeaderActions = WorkflowTemplatePageHeaderActions(
    projectID,
    activeKey
  );
  const onRefresh = () => {
    EventEmitter.emit(EmitterKey.Refresh_Workflow_Template_List);
  };
  return (
    <WorkflowTemplateStyleWrapper>
      <PageHeader
        title={
          <Space>
            {t('workflowTemplate.pageTitle')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
        extra={pageHeaderActions['create-workflow-template']}
      />
      <SegmentedTabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            label: t('workflowTemplate.list.type.workflow'),
            value: getWorkflowTemplateListV1WorkflowTypeEnum.workflow,
            children: (
              <WorkflowTemplateListTable
                workflowType={
                  getWorkflowTemplateListV1WorkflowTypeEnum.workflow
                }
              />
            )
          },
          {
            label: t('workflowTemplate.list.type.dataExport'),
            value: getWorkflowTemplateListV1WorkflowTypeEnum.data_export,
            children: (
              <WorkflowTemplateListTable
                workflowType={
                  getWorkflowTemplateListV1WorkflowTypeEnum.data_export
                }
              />
            )
          }
        ]}
      />
    </WorkflowTemplateStyleWrapper>
  );
  // #else
  return (
    <WorkflowTemplateStyleWrapper>
      <PageHeader title={t('workflowTemplate.pageTitle')} />
      <WorkflowTemplateSingleDetail />
    </WorkflowTemplateStyleWrapper>
  );
  // #endif
};

export default WorkflowTemplateDetail;
