import { Alert, Card, Steps } from 'antd';
import React from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { WorkflowTemplateTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

interface ApprovalProcessPreviewProps {
  projectName: string;
}

const ApprovalProcessPreview: React.FC<ApprovalProcessPreviewProps> = ({
  projectName
}) => {
  const { t } = useTranslation();

  const { data: templateData, loading } = useRequest(
    () =>
      workflow
        .getWorkflowTemplateV1({
          project_name: projectName,
          workflow_type: WorkflowTemplateTypeEnum.data_export
        })
        .then((res) => res.data.data),
    {
      ready: !!projectName
    }
  );

  const getStepTitle = (type?: string): string => {
    if (type === 'export_review') {
      return t('dmsDataExport.create.approvalProcess.stepType.exportReview');
    }
    if (type === 'export_execute') {
      return t('dmsDataExport.create.approvalProcess.stepType.exportExecute');
    }
    return type ?? '';
  };

  const getStepDescription = (step: {
    approved_by_authorized?: boolean;
    execute_by_authorized?: boolean;
    assignee_user_id_list?: string[];
  }): string => {
    if (step.approved_by_authorized) {
      return t('dmsDataExport.create.approvalProcess.assigneeMode.byPermission');
    }
    if (step.execute_by_authorized) {
      return t('dmsDataExport.create.approvalProcess.assigneeMode.byPermission');
    }
    if (step.assignee_user_id_list && step.assignee_user_id_list.length > 0) {
      return t(
        'dmsDataExport.create.approvalProcess.assigneeMode.specifiedUsers',
        { users: step.assignee_user_id_list.join(', ') }
      );
    }
    return '';
  };

  const steps = templateData?.workflow_step_template_list ?? [];

  return (
    <Card
      title={t('dmsDataExport.create.approvalProcess.title')}
      loading={loading}
    >
      <Steps
        direction="vertical"
        size="small"
        items={steps.map((step, index) => ({
          title: `${index + 1}. ${getStepTitle(step.type)}`,
          description: getStepDescription(step),
          status: 'wait' as const
        }))}
      />
      <Alert
        type="info"
        showIcon
        message={t('dmsDataExport.create.approvalProcess.guidance')}
        style={{ marginTop: 16 }}
      />
    </Card>
  );
};

export default ApprovalProcessPreview;
