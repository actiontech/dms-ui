import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { Result } from 'antd';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ApprovalProcessPreviewStyleWrapper } from './style';
import { I18nKey } from '../../../../../../locale';
import { getWorkflowTemplateV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';

interface ApprovalProcessPreviewProps {
  projectName: string;
}

const stepTypeNameMap: Record<string, I18nKey> = {
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
          workflow_type: getWorkflowTemplateV1WorkflowTypeEnum.data_export
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

        <div className="approval-process-steps">
          {templateData?.workflow_step_template_list?.map((step, index) => (
            <div className="approval-process-step" key={index}>
              <div className="step-indicator">
                <div className="step-dot">{step.number ?? index + 1}</div>
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
