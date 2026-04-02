import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import StepCard from '../../components/StepCard';
import {
  IStepInfoDataProps,
  StepInfoEnum
} from '../../components/StepCard/index.type';
import { WorkflowTemplateStepInfoStyleWrapper } from '../../components/StepCard/style';
import { StepInfoStyleWrapper } from '../style';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import DraggableCard from '../../components/DraggableCard';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { IDataExportStepInfoProps } from './index.type';
import { dataExportStepInfo } from './dataExportStepInfo';

const DataExportStepInfo: React.FC<IDataExportStepInfoProps> = (props) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();

  const stepInfoData = useMemo(
    () =>
      dataExportStepInfo({
        currentStep: props.currentStep,
        mode: StepInfoEnum.update,
        reviewStepData: props.reviewStepData,
        execStepData: props.execStepData,
        hasExecStep: props.hasExecStep,
        usernameList: props.usernameList,
        theme: sqleTheme.icon
      }),
    [
      props.currentStep,
      props.execStepData,
      props.reviewStepData,
      props.hasExecStep,
      props.usernameList,
      sqleTheme
    ]
  );

  const [stepData, setStepData] = useState<IStepInfoDataProps[]>(() => []);

  useEffect(() => {
    setStepData([...stepInfoData]);
  }, [stepInfoData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1
      }
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setStepData((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        if (overIndex === -1) {
          return arrayMove(prev, activeIndex, activeIndex);
        }
        props.exchangeReviewNode(activeIndex - 1, overIndex - 1);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const onDragMove = ({ activatorEvent }: DragMoveEvent) => {
    activatorEvent.preventDefault();
    activatorEvent.stopPropagation();
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
    >
      <SortableContext
        items={stepData
          .map((i) => i.key)
          .filter((i) => i.includes('review-step'))}
        strategy={verticalListSortingStrategy}
      >
        <WorkflowTemplateStepInfoStyleWrapper>
          {stepData.map((step, index) =>
            step.show ? (
              <React.Fragment key={`${step.key}-step-wrapper`}>
                {step.key === 'send-plane-step' ? (
                  <Row
                    className="add-review-node-icon workflow-step-container"
                    key={`${step.key}-add-button`}
                  >
                    <StepInfoStyleWrapper
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={props.addReviewNode}
                      disabled={props.reviewStepData.length === 4}
                    >
                      {t('workflowTemplate.dataExport.operator.addReview')}
                    </StepInfoStyleWrapper>
                  </Row>
                ) : null}
                {!props.hasExecStep &&
                index === stepData.length - 1 &&
                step.key !== 'send-plane-step' ? (
                  <>
                    <Row
                      className="add-review-node-icon workflow-step-container"
                      key="add-review-button"
                    >
                      <StepInfoStyleWrapper
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={props.addReviewNode}
                        disabled={props.reviewStepData.length === 4}
                      >
                        {t('workflowTemplate.dataExport.operator.addReview')}
                      </StepInfoStyleWrapper>
                    </Row>
                    <Row
                      className="add-review-node-icon workflow-step-container"
                      key="add-exec-button"
                    >
                      <StepInfoStyleWrapper
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={props.addExecNode}
                      >
                        {t('workflowTemplate.dataExport.operator.addExec')}
                      </StepInfoStyleWrapper>
                    </Row>
                  </>
                ) : null}
                {step.key.includes('review-step') ? (
                  <DraggableCard
                    {...step}
                    key={step.key}
                    indexNumber={index}
                    rowKey={step.key}
                    removeReviewNode={props.removeReviewNode}
                    clickReviewNode={props.clickReviewNode}
                  />
                ) : (
                  <Row
                    key={`${step.key}-row`}
                    className={`workflow-step-container workflow-card-space`}
                    wrap={false}
                  >
                    <Col key={`${step.key}-icon`} className="icon-wrapper">
                      {step.icon}
                    </Col>
                    <Col key={`${step.key}-box`} className="step-box">
                      <Row key={`${step.key}-box-wrapper`} wrap={false}>
                        <StepCard
                          {...step}
                          key={`${step.key}-step-card`}
                          indexNumber={index}
                          close={
                            step.key === 'send-plane-step'
                              ? props.removeExecNode
                              : undefined
                          }
                          click={props.clickReviewNode}
                        />
                      </Row>
                    </Col>
                  </Row>
                )}
              </React.Fragment>
            ) : null
          )}
          {props.hasExecStep ? (
            <Row
              className="add-review-node-icon workflow-step-container"
              key="add-exec-button-after-exec"
            />
          ) : null}
        </WorkflowTemplateStepInfoStyleWrapper>
      </SortableContext>
    </DndContext>
  );
};

export default DataExportStepInfo;
