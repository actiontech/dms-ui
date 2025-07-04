import { Col, Row } from 'antd';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IStepInfoDataProps } from '../StepCard/index.type';
import StepCard from '../StepCard';

export interface DraggableCardProps extends IStepInfoDataProps {
  rowKey: string;
  indexNumber: number;
}

const DraggableCard = (step: DraggableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: step.rowKey
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
    ...(isDragging
      ? { position: 'relative', zIndex: 9999, pointerEvents: 'none' }
      : {})
  };
  return (
    <Row
      className={`workflow-step-container workflow-card-space`}
      wrap={false}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={step.rowKey}
    >
      <Col key={`${step.rowKey}-icon`} className="icon-wrapper">
        {step.icon}
      </Col>
      <Col key={`${step.rowKey}-box`} className="step-box">
        <Row key={`${step.rowKey}-box-wrapper`} wrap={false}>
          <StepCard
            {...step}
            key={`${step.rowKey}-step-card`}
            close={step?.removeReviewNode}
            click={step.clickReviewNode}
          />
        </Row>
      </Col>
    </Row>
  );
};

export default DraggableCard;
