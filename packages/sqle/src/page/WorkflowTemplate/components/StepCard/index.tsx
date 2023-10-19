import React, { MouseEvent } from 'react';
import { ReviewNodeCloseButton, StepCardStyleWrapper } from './style';
import { IStepCardProps } from './index.type';
import { CloseOutlined } from '@ant-design/icons';

const StepCard: React.FC<IStepCardProps> = (props) => {
  const handleClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    props?.close?.();
  };
  return (
    <StepCardStyleWrapper
      hoverable={!props.disabled}
      className={`step-card-style ${props.disabled ? 'disable-step-card' : ''}`}
      onClick={() => props?.click?.(props?.indexNumber ?? 0)}
    >
      <span className="step-card-title">{props.title}</span>
      <div className="step-card-desc">{props.desc || '-'}</div>
      {props?.operator ? (
        <div className="step-card-operator">
          <div className="operator-title">{props?.operatorTitle}</div>
          <div className="operator-content">{props?.operator}</div>
        </div>
      ) : null}
      {props?.active ? (
        <ReviewNodeCloseButton
          shape="circle"
          size="small"
          icon={<CloseOutlined />}
          onClick={(e) => handleClose(e)}
        />
      ) : null}
    </StepCardStyleWrapper>
  );
};

export default StepCard;
