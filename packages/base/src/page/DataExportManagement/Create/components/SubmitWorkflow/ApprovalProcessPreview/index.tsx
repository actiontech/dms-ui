import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { Result } from 'antd';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ApprovalProcessPreviewStyleWrapper } from './style';
import { getWorkflowTemplateV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { stepTypeNameMap } from './index.data';
import { SqleApi } from '@actiontech/shared/lib/api';

interface ApprovalProcessPreviewProps {
  projectName: string;
}

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
      SqleApi.WorkflowService.getWorkflowTemplateV1({
        project_name: projectName,
        workflow_type: getWorkflowTemplateV1WorkflowTypeEnum.data_export
      }).then((res) => res.data.data),
    {
      ready: !!projectName,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError: () => {}
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
    if (type) {
      return stepTypeNameMap[type] ?? '-';
    }
    return '-';
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

        <div className="approval-process-steps">
          {templateData?.workflow_step_template_list?.map((step, index) => (
            <div className="approval-process-step" key={index}>
              <div className="step-indicator">
                <div className="step-dot">{step.number}</div>
                <div className="step-connector" />
              </div>
              <div className="step-content">
                <div className="step-type-name">
                  {renderStepTypeName(step.type)}
                </div>
                <div className="step-assignee">{renderAssigneeInfo(step)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="approval-process-hint">
          {t('dmsDataExport.create.approvalProcess.hint')}
        </div>
      </Spin>
    </ApprovalProcessPreviewStyleWrapper>
  );
};

export default ApprovalProcessPreview;
