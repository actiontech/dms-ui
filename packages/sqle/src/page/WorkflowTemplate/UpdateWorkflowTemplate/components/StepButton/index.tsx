import React from 'react';
import { StepButtonStyleWrapper } from '../../style';
import { BasicButton } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
interface IStepButtonProps {
  currentStep: number;
  totalStep: number;
  prevStep?: () => void;
  nextStep?: () => void;
}
const StepButton: React.FC<IStepButtonProps> = (props) => {
  const { t } = useTranslation();
  return (
    <StepButtonStyleWrapper>
      {props.currentStep !== 0 ? (
        <BasicButton onClick={props?.prevStep}>
          {t('common.prevStep')}
        </BasicButton>
      ) : null}
      {props.currentStep !== props.totalStep ? (
        <BasicButton type="primary" onClick={props?.nextStep}>
          {t('common.nextStep')}
        </BasicButton>
      ) : null}
    </StepButtonStyleWrapper>
  );
};
export default StepButton;
