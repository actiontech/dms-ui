import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import StepCard from '../../../components/StepCard';
import { stepInfo } from '../../../components/StepCard/stepInfo';
import {
  IStepInfoDataProps,
  IUpdateWorkflowStepInfoProps,
  StepInfoEnum
} from '../../../components/StepCard/index.type';
import { WorkflowTemplateStepInfoStyleWrapper } from '../../../components/StepCard/style';
import { StepInfoStyleWrapper } from '../../style';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useGetLevelData } from '../../../hooks/useGetLevelData';
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
import DraggableCard from '../../../components/DraggableCard';

const StepInfo: React.FC<IUpdateWorkflowStepInfoProps> = (props) => {
  const { t } = useTranslation();

  const { currentLevelData, levelText } = useGetLevelData(props?.authLevel);

  const templateLevel = useMemo(() => {
    return <span style={{ color: currentLevelData.color }}>{levelText}</span>;
  }, [currentLevelData, levelText]);

  const stepInfoData = useMemo(
    () =>
      stepInfo({
        level: templateLevel,
        currentStep: props.currentStep,
        mode: StepInfoEnum.update,
        reviewStepData: props.reviewStepData,
        execStepData: props.execStepData,
        usernameList: props.usernameList
      }),
    [
      templateLevel,
      props.currentStep,
      props.execStepData,
      props.reviewStepData,
      props.usernameList
    ]
  );

  const [stepData, setStepData] = useState<IStepInfoDataProps[]>(() => []);

  useEffect(() => {
    setStepData([...stepInfoData]);
  }, [stepInfoData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1
      }
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    console.log('drag end');
    if (active.id !== over?.id) {
      setStepData((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        if (overIndex === -1) {
          return arrayMove(prev, activeIndex, activeIndex);
        }
        props.exchangeReviewNode(activeIndex - 2, overIndex - 2);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const onDragMove = ({ activatorEvent }: DragMoveEvent) => {
    console.log('move');
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
        // rowKey array
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
                      {t('workflowTemplate.progressConfig.operator.addReview')}
                    </StepInfoStyleWrapper>
                  </Row>
                ) : null}
                {step.key.includes('review-step') ? (
                  <DraggableCard
                    {...step}
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
                          indexNumber={index}
                          close={props?.removeReviewNode}
                          click={props.clickReviewNode}
                        />
                      </Row>
                    </Col>
                  </Row>
                )}
              </React.Fragment>
            ) : null
          )}
        </WorkflowTemplateStepInfoStyleWrapper>
      </SortableContext>
    </DndContext>
  );
};

export default StepInfo;
