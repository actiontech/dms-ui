import { Col, Row, Spin } from 'antd';
import React, { useMemo, useState } from 'react';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useRequest } from 'ahooks';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import WorkflowTemplateAuthInfo from './components/WorkflowTemplateAuthInfo';
import WorkflowTemplateStepInfo from './components/WorkflowTemplateStepInfo';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { WorkflowTemplateStyleWrapper } from './style';
import useUsername from '../../../hooks/useUsername';

const WorkflowTemplateDetail: React.FC = () => {
  const { t } = useTranslation();

  const { projectName, projectID, projectArchive } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const {
    updateUsernameList,
    usernameList,
    loading: getUsernameListLoading
  } = useUsername();

  React.useEffect(() => {
    updateUsernameList({ filter_project: projectName });
  }, [projectName, updateUsernameList]);

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

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
    <WorkflowTemplateStyleWrapper>
      <PageHeader
        title={t('workflowTemplate.pageTitle')}
        extra={[
          <EmptyBox
            if={actionPermission && !projectArchive}
            key="update-workflow-template"
          >
            <Link
              to={`/sqle/project/${projectID}/progress/update/${workflowTemplate?.workflow_template_name}`}
            >
              <BasicButton type="primary" icon={<EditOutlined />}>
                {t('workflowTemplate.detail.updateTemplate')}
              </BasicButton>
            </Link>
          </EmptyBox>
        ]}
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
