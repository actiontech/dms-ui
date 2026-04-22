import { useMemo, useCallback, useState } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Col, Row, Spin } from 'antd';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  useCurrentProject,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ActionButton, useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { PageHeader, SegmentedTabs } from '@actiontech/dms-kit';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import WorkflowTemplateStepInfo from './components/WorkflowTemplateStepInfo';
import WorkflowTemplateAuthInfo from './components/WorkflowTemplateAuthInfo';
import { WorkflowTemplateStyleWrapper } from './style';
import useUsername from '../../../hooks/useUsername';
import { EditOutlined } from '@ant-design/icons';

const WorkflowTemplateDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const extractQueries = useTypedQuery();
  const searchParams = extractQueries(ROUTE_PATHS.SQLE.PROGRESS.index);
  const initialTab = searchParams?.activeTab === 'data_export' ? 'data_export' : 'workflow';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const {
    updateUsernameList,
    usernameList,
    loading: getUsernameListLoading
  } = useUsername();

  useMemo(() => {
    updateUsernameList({
      filter_project: projectName
    });
  }, [projectName, updateUsernameList]);

  // Fetch SQL Exec Workflow template
  const [workflowReviewSteps, setWorkflowReviewSteps] = useState<
    IWorkFlowStepTemplateResV1[]
  >([]);
  const [workflowExecStep, setWorkflowExecStep] =
    useState<IWorkFlowStepTemplateResV1>({
      assignee_user_id_list: [],
      desc: ''
    });

  const { data: workflowTemplate, loading: getWorkflowTemplateLoading } =
    useRequest(
      () =>
        workflow
          .getWorkflowTemplateV1({
            project_name: projectName,
            workflow_type: 'workflow'
          })
          .then((res) => {
            const stepList =
              res.data.data?.workflow_step_template_list ?? [];
            if (stepList.length <= 1) {
              setWorkflowExecStep(stepList[0] ?? { assignee_user_id_list: [], desc: '' });
              setWorkflowReviewSteps([]);
            } else {
              const execStep = stepList.pop();
              setWorkflowReviewSteps(stepList);
              if (execStep) setWorkflowExecStep(execStep);
            }
            return res.data.data;
          }),
      {
        ready: !!projectName
      }
    );

  // Fetch Data Export workflow template
  const [exportReviewSteps, setExportReviewSteps] = useState<
    IWorkFlowStepTemplateResV1[]
  >([]);
  const [exportExecStep, setExportExecStep] =
    useState<IWorkFlowStepTemplateResV1>({
      assignee_user_id_list: [],
      desc: ''
    });

  const { data: exportTemplate, loading: getExportTemplateLoading } =
    useRequest(
      () =>
        workflow
          .getWorkflowTemplateV1({
            project_name: projectName,
            workflow_type: 'data_export'
          })
          .then((res) => {
            const stepList =
              res.data.data?.workflow_step_template_list ?? [];
            if (stepList.length <= 1) {
              setExportExecStep(stepList[0] ?? { assignee_user_id_list: [], desc: '' });
              setExportReviewSteps([]);
            } else {
              const execStep = stepList.pop();
              setExportReviewSteps(stepList);
              if (execStep) setExportExecStep(execStep);
            }
            return res.data.data;
          }),
      {
        ready: !!projectName
      }
    );

  const renderEditButton = useCallback(
    (workflowType: string, templateName?: string) => {
      // #if [ee]
      return (
        <PermissionControl
          permission={PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.UPDATE}
        >
          <ActionButton
            type="primary"
            icon={<EditOutlined />}
            text={t('workflowTemplate.detail.updateTemplate')}
            actionType="navigate-link"
            link={{
              to: ROUTE_PATHS.SQLE.PROGRESS.update,
              params: {
                projectID,
                workflowName: templateName ?? ''
              },
              queries: {
                workflowType
              }
            }}
          />
        </PermissionControl>
      );
      // #endif
      return null;
    },
    [t, projectID]
  );

  const tabItems = useMemo(
    () => [
      {
        value: 'workflow',
        label: t('workflowTemplate.list.type.workflow'),
        children: (
          <Spin
            spinning={getUsernameListLoading || getWorkflowTemplateLoading}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 40px 16px' }}>
              {renderEditButton(
                'workflow',
                workflowTemplate?.workflow_template_name
              )}
            </div>
            <Row className="workflow-template-wrapper">
              <Col flex="auto">
                <WorkflowTemplateStepInfo
                  reviewStepData={workflowReviewSteps}
                  execStepData={workflowExecStep}
                  usernameList={usernameList}
                />
              </Col>
              <Col flex="360px" className="workflow-template-right-module">
                <WorkflowTemplateAuthInfo
                  level={
                    workflowTemplate?.allow_submit_when_less_audit_level
                  }
                  time={workflowTemplate?.update_time}
                />
              </Col>
            </Row>
          </Spin>
        )
      },
      {
        value: 'data_export',
        label: t('workflowTemplate.list.type.dataExport'),
        children: (
          <Spin
            spinning={getUsernameListLoading || getExportTemplateLoading}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 40px 16px' }}>
              {renderEditButton(
                'data_export',
                exportTemplate?.workflow_template_name
              )}
            </div>
            <Row className="workflow-template-wrapper">
              <Col flex="auto">
                <WorkflowTemplateStepInfo
                  reviewStepData={exportReviewSteps}
                  execStepData={exportExecStep}
                  usernameList={usernameList}
                  isDataExport={true}
                />
              </Col>
              <Col flex="360px" className="workflow-template-right-module">
                <WorkflowTemplateAuthInfo
                  time={exportTemplate?.update_time}
                  hideLevel={true}
                />
              </Col>
            </Row>
          </Spin>
        )
      }
    ],
    [
      t,
      getUsernameListLoading,
      getWorkflowTemplateLoading,
      getExportTemplateLoading,
      workflowReviewSteps,
      workflowExecStep,
      exportReviewSteps,
      exportExecStep,
      usernameList,
      workflowTemplate,
      exportTemplate,
      renderEditButton
    ]
  );

  return (
    <WorkflowTemplateStyleWrapper>
      <PageHeader title={t('workflowTemplate.pageTitle')} />
      <SegmentedTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </WorkflowTemplateStyleWrapper>
  );
};

export default WorkflowTemplateDetail;
