import { BasicButton, BasicResult, PageHeader } from '@actiontech/shared';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Row, Space, Spin } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BasicInfo from './components/BasicInfo';
import StepInfo from './components/StepInfo';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  IWorkFlowStepTemplateReqV1,
  IWorkFlowStepTemplateResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Link, useParams } from 'react-router-dom';
import { BaseFormFields } from './components/BasicInfo/index.type';
import { AxiosResponse } from 'axios';
import {
  UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkFlowStepTemplateReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IUpdateWorkflowTemplateV1Return } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import ReviewAndExecNodeInfo from './components/ReviewNodeInfo';
import {
  NodeTypeEnum,
  ReviewNodeField
} from './components/ReviewNodeInfo/index.type';
import { cloneDeep } from 'lodash';
import { useBoolean, useRequest } from 'ahooks';
import { IconSuccessResult } from '@actiontech/shared/lib/Icon/common';
import { useForm } from 'antd/es/form/Form';
import { WorkflowTemplateStyleWrapper } from '../WorkflowTemplateDetail/style';
import useUsername from '../../../hooks/useUsername';

const UpdateWorkflowTemplate: React.FC = () => {
  const { t } = useTranslation();

  const [form] = useForm<ReviewNodeField>();
  const [basicForm] = useForm<BaseFormFields>();

  const [selectLevel, setSelectLevel] =
    useState<BaseFormFields['allowSubmitWhenLessAuditLevel']>(undefined);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean(false);

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const urlParams = useParams<{ workflowName: string }>();
  const { projectName, projectID } = useCurrentProject();

  const {
    loading: getUsernameListLoading,
    updateUsernameList,
    generateUsernameSelectOption,
    usernameList
  } = useUsername();

  React.useEffect(() => {
    updateUsernameList({ filter_project: projectName });
  }, [projectName, updateUsernameList]);

  const updateBaseInfo = (
    info: BaseFormFields['allowSubmitWhenLessAuditLevel']
  ) => {
    setSelectLevel(info);
  };

  const submitProgress = async (): Promise<
    AxiosResponse<IUpdateWorkflowTemplateV1Return>
  > => {
    await form?.validateFields();
    const reviewTempData = reviewSteps.map((item) => ({
      ...item,
      type: WorkFlowStepTemplateReqV1TypeEnum.sql_review
    }));
    const templateList: IWorkFlowStepTemplateReqV1[] = [
      ...reviewTempData,
      { ...execSteps, type: WorkFlowStepTemplateReqV1TypeEnum.sql_execute }
    ];
    startSubmit();
    return workflow
      .updateWorkflowTemplateV1({
        project_name: projectName,
        workflow_step_template_list: templateList,
        allow_submit_when_less_audit_level: selectLevel as
          | UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
          | undefined
      })
      .then((res) => {
        setUpdateSuccess(true);
        return res;
      })
      .finally(() => submitFinish());
  };

  const { data: workflowTemplate, loading: getWorkflowTemplateLoading } =
    useRequest(
      () =>
        workflow
          .getWorkflowTemplateV1({
            project_name: projectName
          })
          .then((res) => {
            const temp = res.data.data;
            if (temp?.workflow_step_template_list) {
              const stepList = temp?.workflow_step_template_list ?? [];
              setSelectLevel(temp?.allow_submit_when_less_audit_level);
              if (stepList.length <= 1) {
                setExecSteps(stepList[0]);
              } else {
                const execStep = stepList.pop();
                setReviewSteps(stepList);
                if (execStep) setExecSteps(execStep);
              }
            }
            return res.data.data;
          }),
      {
        ready: !!projectName && !!urlParams.workflowName
      }
    );

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [reviewSteps, setReviewSteps] = useState<IWorkFlowStepTemplateResV1[]>(
    []
  );

  const [execSteps, setExecSteps] = useState<IWorkFlowStepTemplateResV1>({
    assignee_user_id_list: [],
    desc: ''
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const updateReviewAndExecNodeInfo = (
    nodeData: IWorkFlowStepTemplateResV1
  ) => {
    if (currentStep === reviewSteps.length + 1) {
      setExecSteps(nodeData);
    } else {
      const temp = cloneDeep(reviewSteps);
      temp.splice(currentStep - 1, 1, nodeData);
      setReviewSteps(temp);
    }
  };

  const renderLeftStepInfo = (step: number) => {
    if (step === 0) {
      return (
        <BasicInfo
          form={basicForm}
          defaultData={{
            ...workflowTemplate,
            allow_submit_when_less_audit_level: selectLevel
          }}
          nextStep={nextStep}
          updateBaseInfo={updateBaseInfo}
          totalStep={reviewSteps.length + 2}
        />
      );
    }
    return (
      <ReviewAndExecNodeInfo
        form={form}
        type={
          currentStep === reviewSteps.length + 1
            ? NodeTypeEnum.exec
            : NodeTypeEnum.review
        }
        defaultData={
          currentStep === reviewSteps.length + 1
            ? execSteps
            : reviewSteps[currentStep - 1]
        }
        prevStep={prevStep}
        nextStep={nextStep}
        currentStep={currentStep}
        generateUsernameSelectOption={generateUsernameSelectOption}
        getUsernameListLoading={getUsernameListLoading}
        totalStep={reviewSteps.length + 1}
        updateReviewAndExecNodeInfo={updateReviewAndExecNodeInfo}
      />
    );
  };

  const handleAddReviewNode = () => {
    (currentStep === 0 ? basicForm : form).validateFields().then(() => {
      setReviewSteps([
        ...reviewSteps,
        {
          assignee_user_id_list: [],
          desc: '',
          approved_by_authorized: true,
          type: WorkFlowStepTemplateReqV1TypeEnum.sql_review
        }
      ]);
      setCurrentStep(reviewSteps.length + 1);
    });
  };

  const handleRemoveReviewNode = () => {
    const temp = cloneDeep(reviewSteps);
    temp.splice(currentStep - 1, 1);
    setReviewSteps(temp);
    prevStep();
  };

  const handleReset = () => {
    setCurrentStep(0);
    updateBaseInfo(undefined);
    setReviewSteps([]);
    setExecSteps({
      assignee_user_id_list: [],
      desc: '',
      execute_by_authorized: true,
      type: WorkFlowStepTemplateReqV1TypeEnum.sql_execute
    });
  };

  const handleExchangeReviewNode = (from: number, to: number) => {
    const temp = cloneDeep(reviewSteps);
    temp.splice(from < to ? to + 1 : to, 0, temp[from]);
    temp.splice(from < to ? from : from + 1, 1);
    setReviewSteps(temp);
    // 拖动的是选中的节点
    if (from + 1 === currentStep) {
      setCurrentStep(to + 1);
      // 拖动的不是选中的节点，但选中节点为审核节点，受拖动影响
    } else if (currentStep >= 1 && currentStep < reviewSteps.length) {
      setCurrentStep(from < to ? currentStep - 1 : currentStep + 1);
    }
  };

  const handleClickReviewNode = (index: number) => {
    const step = index < 1 ? index : index - 1;
    form.validateFields().then(() => setCurrentStep(step));
  };

  return (
    <WorkflowTemplateStyleWrapper>
      <Spin spinning={getWorkflowTemplateLoading}>
        <PageHeader
          title={
            <Link to={`/sqle/project/${projectID}/progress`} key="go-back">
              <BasicButton icon={<ArrowLeftOutlined />}>
                {t('workflowTemplate.create.title.returnButton')}
              </BasicButton>
            </Link>
          }
          extra={
            !updateSuccess ? (
              <Space>
                <BasicButton onClick={handleReset}>
                  {t('common.reset')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  loading={submitLoading}
                  onClick={submitProgress}
                >
                  {t('common.save')}
                </BasicButton>
              </Space>
            ) : null
          }
        />
        {!updateSuccess ? (
          <Row
            key="update-workflow-template-wrapper"
            className="workflow-template-wrapper"
          >
            <Col key="update-workflow-template-left-wrapper" flex="auto">
              <StepInfo
                currentStep={currentStep}
                authLevel={selectLevel}
                reviewStepData={reviewSteps}
                execStepData={execSteps}
                addReviewNode={handleAddReviewNode}
                removeReviewNode={handleRemoveReviewNode}
                exchangeReviewNode={handleExchangeReviewNode}
                clickReviewNode={handleClickReviewNode}
                usernameList={usernameList}
              />
            </Col>
            <Col
              key="update-workflow-template-right-wrapper"
              flex="360px"
              className="workflow-template-right-module"
            >
              {renderLeftStepInfo(currentStep)}
            </Col>
          </Row>
        ) : (
          <BasicResult
            icon={<IconSuccessResult />}
            title={t('workflowTemplate.update.result.title')}
            extra={[
              <Link
                key="back-to-workflow-template"
                to={`/sqle/project/${projectID}/progress`}
              >
                <BasicButton type="primary">
                  {t('workflowTemplate.update.result.showNow')}
                </BasicButton>
              </Link>
            ]}
          />
        )}
      </Spin>
    </WorkflowTemplateStyleWrapper>
  );
};

export default UpdateWorkflowTemplate;
