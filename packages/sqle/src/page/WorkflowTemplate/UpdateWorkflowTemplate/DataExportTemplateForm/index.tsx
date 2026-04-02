import { BasicButton, BasicResult, PageHeader } from '@actiontech/dms-kit';
import { ActionButton, useTypedParams } from '@actiontech/shared';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Row, Space, Spin } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReviewAndExecNodeInfo from '../components/ReviewNodeInfo';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  IWorkFlowStepTemplateReqV1,
  IWorkFlowStepTemplateResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { AxiosResponse } from 'axios';
import {
  WorkFlowStepTemplateReqV1TypeEnum,
  WorkflowTemplateTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IUpdateWorkflowTemplateV1Return } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import {
  NodeTypeEnum,
  ReviewNodeField
} from '../components/ReviewNodeInfo/index.type';
import { cloneDeep } from 'lodash';
import { useBoolean, useRequest } from 'ahooks';
import { useForm } from 'antd/es/form/Form';
import { WorkflowTemplateStyleWrapper } from '../../WorkflowTemplateDetail/style';
import useUsername from '../../../../hooks/useUsername';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import DataExportStepInfo from './DataExportStepInfo';

const DataExportTemplateForm: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<ReviewNodeField>();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const urlParams = useTypedParams<typeof ROUTE_PATHS.SQLE.PROGRESS.update>();
  const { projectName, projectID } = useCurrentProject();
  const {
    loading: getUsernameListLoading,
    updateUsernameList,
    generateUsernameSelectOption,
    usernameList
  } = useUsername();

  React.useEffect(() => {
    updateUsernameList({
      filter_project: projectName
    });
  }, [projectName, updateUsernameList]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [reviewSteps, setReviewSteps] = useState<IWorkFlowStepTemplateResV1[]>(
    []
  );
  const [execSteps, setExecSteps] = useState<
    IWorkFlowStepTemplateResV1 | undefined
  >(undefined);
  const [hasExecStep, setHasExecStep] = useState(false);

  const submitProgress = async (): Promise<
    AxiosResponse<IUpdateWorkflowTemplateV1Return>
  > => {
    await form?.validateFields();
    const reviewTempData = reviewSteps.map((item) => ({
      ...item,
      type: WorkFlowStepTemplateReqV1TypeEnum.export_review
    }));
    const templateList: IWorkFlowStepTemplateReqV1[] = [...reviewTempData];

    if (hasExecStep && execSteps) {
      templateList.push({
        ...execSteps,
        type: WorkFlowStepTemplateReqV1TypeEnum.export_execute
      });
    }

    startSubmit();
    return workflow
      .updateWorkflowTemplateV1({
        project_name: projectName,
        workflow_step_template_list: templateList,
        workflow_type: WorkflowTemplateTypeEnum.data_export
      })
      .then((res) => {
        setUpdateSuccess(true);
        return res;
      })
      .finally(() => submitFinish());
  };

  const { loading: getWorkflowTemplateLoading } = useRequest(
    () =>
      workflow
        .getWorkflowTemplateV1({
          project_name: projectName,
          workflow_type: WorkflowTemplateTypeEnum.data_export
        })
        .then((res) => {
          const temp = res.data.data;
          if (temp?.workflow_step_template_list) {
            const stepList = [
              ...(temp?.workflow_step_template_list ?? [])
            ];
            const lastStep = stepList[stepList.length - 1];
            if (
              lastStep &&
              lastStep.type ===
                WorkFlowStepTemplateReqV1TypeEnum.export_execute
            ) {
              const execStep = stepList.pop();
              setReviewSteps(stepList);
              if (execStep) {
                setExecSteps(execStep);
                setHasExecStep(true);
              }
            } else {
              setReviewSteps(stepList);
              setHasExecStep(false);
            }
          }
          return res.data.data;
        }),
    {
      ready: !!projectName && !!urlParams.workflowName
    }
  );

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const updateReviewAndExecNodeInfo = (
    nodeData: IWorkFlowStepTemplateResV1
  ) => {
    if (hasExecStep && currentStep === reviewSteps.length) {
      setExecSteps(nodeData);
    } else {
      const temp = cloneDeep(reviewSteps);
      temp.splice(currentStep, 1, nodeData);
      setReviewSteps(temp);
    }
  };

  const totalStep = hasExecStep
    ? reviewSteps.length
    : reviewSteps.length - 1;

  const renderRightStepInfo = (step: number) => {
    const isExecStep = hasExecStep && step === reviewSteps.length;
    return (
      <ReviewAndExecNodeInfo
        form={form}
        type={isExecStep ? NodeTypeEnum.exec : NodeTypeEnum.review}
        defaultData={
          isExecStep ? execSteps : reviewSteps[step]
        }
        prevStep={step > 0 ? prevStep : undefined}
        nextStep={step < totalStep ? nextStep : undefined}
        currentStep={step}
        generateUsernameSelectOption={generateUsernameSelectOption}
        getUsernameListLoading={getUsernameListLoading}
        totalStep={totalStep}
        updateReviewAndExecNodeInfo={updateReviewAndExecNodeInfo}
        titleOverrides={{
          reviewTitle: t('workflowTemplate.dataExport.reviewTitle'),
          reviewDesc: t('workflowTemplate.dataExport.reviewDesc'),
          execTitle: t('workflowTemplate.dataExport.execTitle'),
          execDesc: t('workflowTemplate.dataExport.execDesc'),
          matchAuthLabel: isExecStep
            ? t('workflowTemplate.dataExport.execUserType.matchExportExecute')
            : t('workflowTemplate.dataExport.reviewUserType.matchExportApproval')
        }}
      />
    );
  };

  const handleAddReviewNode = () => {
    form.validateFields().then(() => {
      setReviewSteps([
        ...reviewSteps,
        {
          assignee_user_id_list: [],
          desc: '',
          approved_by_authorized: true,
          type: WorkFlowStepTemplateReqV1TypeEnum.export_review
        }
      ]);
      setCurrentStep(reviewSteps.length);
    });
  };

  const handleRemoveReviewNode = () => {
    const temp = cloneDeep(reviewSteps);
    temp.splice(currentStep, 1);
    setReviewSteps(temp);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddExecNode = () => {
    form.validateFields().then(() => {
      setExecSteps({
        assignee_user_id_list: [],
        desc: '',
        execute_by_authorized: true,
        type: WorkFlowStepTemplateReqV1TypeEnum.export_execute
      });
      setHasExecStep(true);
      setCurrentStep(reviewSteps.length);
    });
  };

  const handleRemoveExecNode = () => {
    setExecSteps(undefined);
    setHasExecStep(false);
    if (currentStep === reviewSteps.length) {
      setCurrentStep(Math.max(0, reviewSteps.length - 1));
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setReviewSteps([]);
    setExecSteps(undefined);
    setHasExecStep(false);
  };

  const handleExchangeReviewNode = (from: number, to: number) => {
    const temp = cloneDeep(reviewSteps);
    temp.splice(from < to ? to + 1 : to, 0, temp[from]);
    temp.splice(from < to ? from : from + 1, 1);
    setReviewSteps(temp);
    if (from === currentStep) {
      setCurrentStep(to);
    } else if (currentStep >= 0 && currentStep < reviewSteps.length) {
      setCurrentStep(from < to ? currentStep - 1 : currentStep + 1);
    }
  };

  const handleClickReviewNode = (index: number) => {
    const step = index < 1 ? 0 : index - 1;
    form.validateFields().then(() => setCurrentStep(step));
  };

  return (
    <WorkflowTemplateStyleWrapper>
      <Spin spinning={getWorkflowTemplateLoading}>
        <PageHeader
          title={
            <ActionButton
              key="go-back"
              icon={<ArrowLeftOutlined />}
              text={t('workflowTemplate.create.title.returnButton')}
              actionType="navigate-link"
              link={{
                to: ROUTE_PATHS.SQLE.PROGRESS.index,
                params: {
                  projectID
                }
              }}
            />
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
            key="update-data-export-template-wrapper"
            className="workflow-template-wrapper"
          >
            <Col key="update-data-export-template-left-wrapper" flex="auto">
              <DataExportStepInfo
                currentStep={currentStep}
                reviewStepData={reviewSteps}
                execStepData={execSteps}
                hasExecStep={hasExecStep}
                addReviewNode={handleAddReviewNode}
                removeReviewNode={handleRemoveReviewNode}
                addExecNode={handleAddExecNode}
                removeExecNode={handleRemoveExecNode}
                exchangeReviewNode={handleExchangeReviewNode}
                clickReviewNode={handleClickReviewNode}
                usernameList={usernameList}
              />
            </Col>
            <Col
              key="update-data-export-template-right-wrapper"
              flex="360px"
              className="workflow-template-right-module"
            >
              {reviewSteps.length > 0 || hasExecStep
                ? renderRightStepInfo(currentStep)
                : null}
            </Col>
          </Row>
        ) : (
          <BasicResult
            status="success"
            title={t('workflowTemplate.update.result.title')}
            extra={
              <ActionButton
                text={t('workflowTemplate.update.result.showNow')}
                type="primary"
                actionType="navigate-link"
                link={{
                  to: ROUTE_PATHS.SQLE.PROGRESS.index,
                  params: {
                    projectID
                  }
                }}
              />
            }
          />
        )}
      </Spin>
    </WorkflowTemplateStyleWrapper>
  );
};

export default DataExportTemplateForm;
