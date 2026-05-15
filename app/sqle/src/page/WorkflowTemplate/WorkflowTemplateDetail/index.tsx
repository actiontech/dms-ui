import { useMemo, useCallback, useState } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Col, Row, Spin } from 'antd';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { PageHeader, SegmentedTabs } from '@actiontech/dms-kit';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import WorkflowTemplateStepInfo from './components/WorkflowTemplateStepInfo';
import WorkflowTemplateAuthInfo from './components/WorkflowTemplateAuthInfo';
import { WorkflowTemplateStyleWrapper } from './style';
import useUsername from '../../../hooks/useUsername';
import { getWorkflowTemplateV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { workflowTemplateDetailAction } from './actions';
import { WorkflowStepTypeEnum } from './enum';

const WorkflowTemplateDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const extractQueries = useTypedQuery();
  const searchParams = extractQueries(ROUTE_PATHS.SQLE.PROGRESS.index);

  const [activeTab, setActiveTab] =
    useState<getWorkflowTemplateV1WorkflowTypeEnum>(() => {
      if (
        searchParams?.activeTab ===
        getWorkflowTemplateV1WorkflowTypeEnum.data_export
      ) {
        return getWorkflowTemplateV1WorkflowTypeEnum.data_export;
      }
      return getWorkflowTemplateV1WorkflowTypeEnum.workflow;
    });

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
            workflow_type: getWorkflowTemplateV1WorkflowTypeEnum.workflow
          })
          .then((res) => {
            const stepList = res.data.data?.workflow_step_template_list ?? [];
            if (stepList.length <= 1) {
              setWorkflowExecStep(
                stepList[0] ?? { assignee_user_id_list: [], desc: '' }
              );
              setWorkflowReviewSteps([]);
            } else {
              const execSteps = stepList.filter(
                (v) => v.type === WorkflowStepTypeEnum.sql_execute
              );
              const reviewSteps = stepList
                .filter((v) => v.type === WorkflowStepTypeEnum.sql_review)
                .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
              setWorkflowReviewSteps(reviewSteps);
              if (execSteps.length === 1) {
                setWorkflowExecStep(execSteps[0]);
              } else {
                setWorkflowExecStep({ assignee_user_id_list: [], desc: '' });
              }
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
            workflow_type: getWorkflowTemplateV1WorkflowTypeEnum.data_export
          })
          .then((res) => {
            const stepList = res.data.data?.workflow_step_template_list ?? [];
            if (stepList.length <= 1) {
              setExportExecStep(
                stepList[0] ?? { assignee_user_id_list: [], desc: '' }
              );
              setExportReviewSteps([]);
            } else {
              const execSteps = stepList.filter(
                (v) => v.type === WorkflowStepTypeEnum.export_execute
              );
              const reviewSteps = stepList
                .filter((v) => v.type === WorkflowStepTypeEnum.export_review)
                .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
              setExportReviewSteps(reviewSteps);
              if (execSteps.length === 1) {
                setExportExecStep(execSteps[0]);
              } else {
                setExportExecStep(
                  stepList[0] ?? { assignee_user_id_list: [], desc: '' }
                );
              }
            }
            return res.data.data;
          }),
      {
        ready: !!projectName
      }
    );

  const renderEditButton = useCallback(
    (
      workflowType: getWorkflowTemplateV1WorkflowTypeEnum,
      templateName?: string
    ) => {
      return workflowTemplateDetailAction({
        projectID,
        templateName: templateName,
        workflowType
      });
    },
    [projectID]
  );

  const tabItems = useMemo(
    () => [
      {
        value: 'workflow',
        label: t('workflowTemplate.list.type.workflow'),
        children: (
          <Spin spinning={getUsernameListLoading || getWorkflowTemplateLoading}>
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
                  level={workflowTemplate?.allow_submit_when_less_audit_level}
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
          <Spin spinning={getUsernameListLoading || getExportTemplateLoading}>
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
      exportTemplate
    ]
  );

  return (
    <WorkflowTemplateStyleWrapper>
      <PageHeader title={t('workflowTemplate.pageTitle')} />
      <SegmentedTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        // #if [ee]
        segmentedRowClassName="flex-space-between"
        segmentedRowExtraContent={renderEditButton(
          activeTab,
          activeTab === getWorkflowTemplateV1WorkflowTypeEnum.workflow
            ? workflowTemplate?.workflow_template_name
            : exportTemplate?.workflow_template_name
        )}
        // #endif
      />
    </WorkflowTemplateStyleWrapper>
  );
};

export default WorkflowTemplateDetail;
