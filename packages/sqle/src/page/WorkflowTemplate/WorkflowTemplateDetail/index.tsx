import { Col, Row, Spin } from 'antd';
import React, { useState } from 'react';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import WorkflowTemplateAuthInfo from './components/WorkflowTemplateAuthInfo';
import WorkflowTemplateStepInfo from './components/WorkflowTemplateStepInfo';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { PageHeader } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { WorkflowTemplateStyleWrapper } from './style';
import useUsername from '../../../hooks/useUsername';
import { WorkflowTemplatePageHeaderActions } from './actions';
const WorkflowTemplateDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const {
    updateUsernameList,
    usernameList,
    loading: getUsernameListLoading
  } = useUsername();
  React.useEffect(() => {
    updateUsernameList({
      filter_project: projectName
    });
  }, [projectName, updateUsernameList]);
  const [reviewSteps, setReviewSteps] = useState<IWorkFlowStepTemplateResV1[]>(
    []
  );
  const [execSteps, setExecSteps] = useState<IWorkFlowStepTemplateResV1>({
    assignee_user_id_list: [],
    desc: ''
  });
  const { data: workflowTemplate, loading: getWorkflowTemplateLoading } =
    useRequest(
      () =>
        workflow
          .getWorkflowTemplateV1({
            project_name: projectName
          })
          .then((res) => {
            const stepList = res.data.data?.workflow_step_template_list ?? [];
            if (stepList.length <= 1) {
              setExecSteps(stepList[0]);
            } else {
              const execStep = stepList.pop();
              setReviewSteps(stepList);
              if (execStep) setExecSteps(execStep);
            }
            return res.data.data;
          }),
      {
        ready: !!projectName
      }
    );
  const pageHeaderActions = WorkflowTemplatePageHeaderActions(
    projectID,
    workflowTemplate?.workflow_template_name
  );
  return (
    <WorkflowTemplateStyleWrapper>
      <PageHeader
        title={t('workflowTemplate.pageTitle')}
        // #if [ee]
        extra={pageHeaderActions['update-workflow-template']}
        // #endif
      />
      <Spin spinning={getUsernameListLoading || getWorkflowTemplateLoading}>
        <Row className="workflow-template-wrapper">
          <Col flex="auto">
            <WorkflowTemplateStepInfo
              reviewStepData={reviewSteps}
              execStepData={execSteps}
              usernameList={usernameList}
            />
          </Col>
          <Col flex="360px" className="workflow-template-right-module">
            <WorkflowTemplateAuthInfo
              level={workflowTemplate?.allow_submit_when_less_audit_level}
              time={workflowTemplate?.update_time}
            />
          </Col>
        </Row>
      </Spin>
    </WorkflowTemplateStyleWrapper>
  );
};
export default WorkflowTemplateDetail;
