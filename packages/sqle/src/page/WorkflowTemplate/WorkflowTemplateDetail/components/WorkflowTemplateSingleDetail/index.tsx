import { Col, Row, Spin } from 'antd';
import React, { useState } from 'react';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import WorkflowTemplateAuthInfo from '../WorkflowTemplateAuthInfo';
import WorkflowTemplateStepInfo from '../WorkflowTemplateStepInfo';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import useUsername from '../../../../../hooks/useUsername';

const WorkflowTemplateSingleDetail: React.FC = () => {
  const { projectName } = useCurrentProject();
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
  return (
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
  );
};

export default WorkflowTemplateSingleDetail;
