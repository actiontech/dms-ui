import React from 'react';
import { IWorkflowTemplateStepInfoProps } from './index.type';
import { stepInfo } from '../../../components/StepCard/stepInfo';
import { Col, Row } from 'antd';
import StepCard from '../../../components/StepCard';
import { IconNextStep } from '../../../../../icon/WorkflowTemplate';
import {
  StepInfoArrowEnum,
  StepInfoEnum
} from '../../../components/StepCard/index.type';
import { WorkflowTemplateStepInfoStyleWrapper } from '../../../components/StepCard/style';

const WorkflowTemplateStepInfo: React.FC<IWorkflowTemplateStepInfoProps> = (
  props
) => {
  return (
    <WorkflowTemplateStepInfoStyleWrapper>
      {stepInfo({
        mode: StepInfoEnum.detail,
        reviewStepData: props.reviewStepData,
        execStepData: props.execStepData,
        usernameList: props.usernameList
      }).map((step) =>
        step.show ? (
          <>
            <Row
              key={step.key}
              className={`workflow-step-container ${
                step.arrow === StepInfoArrowEnum.none
                  ? 'workflow-card-space'
                  : ''
              }`}
              wrap={false}
            >
              <Col key={`${step.key}-icon`} className="icon-wrapper">
                {step.icon}
              </Col>
              <Col key={`${step.key}-box`} className="step-box">
                <Row key={`${step.key}-card`} wrap={false}>
                  <StepCard {...step} />
                </Row>
              </Col>
            </Row>
            {step.arrow !== StepInfoArrowEnum.none ? (
              <Row key={`${step.key}-next-icon`} className="next-step-icon">
                <IconNextStep />
                {step.arrow === StepInfoArrowEnum.double ? (
                  <IconNextStep />
                ) : null}
              </Row>
            ) : null}
          </>
        ) : null
      )}
    </WorkflowTemplateStepInfoStyleWrapper>
  );
};

export default WorkflowTemplateStepInfo;
