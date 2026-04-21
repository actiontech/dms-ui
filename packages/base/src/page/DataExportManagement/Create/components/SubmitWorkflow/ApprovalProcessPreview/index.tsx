import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { Spin, Space, Typography } from 'antd';
import { Result } from 'antd';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ApprovalProcessPreviewStyleWrapper } from './style';

interface ApprovalProcessPreviewProps {
  projectName: string;
}

const stepTypeNameMap: Record<string, string> = {
  export_review: 'dmsDataExport.create.approvalProcess.stepType.export_review',
  export_execute: 'dmsDataExport.create.approvalProcess.stepType.export_execute'
};

const ApprovalProcessPreview: React.FC<ApprovalProcessPreviewProps> = ({
  projectName
}) => {
  const { t } = useTranslation();

  const {
    data: templateData,
    loading,
    error
  } = useRequest(
    () =>
      workflow
        .getWorkflowTemplateV1({
          project_name: projectName,
          workflow_type: 'data_export'
        })
        .then((res) => res.data.data),
    {
      ready: !!projectName
    }
  );

  const renderAssigneeInfo = (step: IWorkFlowStepTemplateResV1) => {
    if (step.approved_by_authorized || step.execute_by_authorized) {
      return t('dmsDataExport.create.approvalProcess.matchByPermission');
    }
    if (step.assignee_user_id_list && step.assignee_user_id_list.length > 0) {
      return step.assignee_user_id_list.join(', ');
    }
    return '-';
  };

  const renderStepTypeName = (type?: string) => {
    if (type && stepTypeNameMap[type]) {
      return t(stepTypeNameMap[type]);
    }
    return type ?? '-';
  };

  if (error) {
    return (
      <ApprovalProcessPreviewStyleWrapper>
        <Result
          status="warning"
          subTitle={t('dmsDataExport.create.approvalProcess.loadFailed')}
        />
      </ApprovalProcessPreviewStyleWrapper>
    );
  }

  return (
    <ApprovalProcessPreviewStyleWrapper>
      <Spin spinning={loading}>
        <div className="approval-process-title">
          {t('dmsDataExport.create.approvalProcess.title')}
        </div>

        {templateData?.workflow_step_template_list?.map(
          (step: IWorkFlowStepTemplateResV1, index: number) => (
            <div className="approval-process-step" key={index}>
              <div className="approval-process-step-header">
                <Space>
                  <span className="step-number">
                    {t('dmsDataExport.create.approvalProcess.stepLabel', {
                      number: step.number ?? index + 1
                    })}
                  </span>
                  <Typography.Text type="secondary">
                    {renderStepTypeName(step.type)}
                  </Typography.Text>
                </Space>
              </div>
              <div className="approval-process-step-assignee">
                {renderAssigneeInfo(step)}
              </div>
            </div>
          )
        )}

        <div className="approval-process-hint">
          {t('dmsDataExport.create.approvalProcess.hint')}
        </div>
      </Spin>
    </ApprovalProcessPreviewStyleWrapper>
  );
};

export default ApprovalProcessPreview;
