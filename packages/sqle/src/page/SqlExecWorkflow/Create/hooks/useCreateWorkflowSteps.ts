import { useState } from 'react';

const useCreateWorkflowSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const isAtFormStep = currentStep === 0;
  const isAtAuditResultStep = currentStep === 1;
  const isAtCreateResultStep = currentStep === 2;

  const goToFormStep = () => {
    setCurrentStep(0);
  };
  const goToAuditResultStep = () => {
    setCurrentStep(1);
  };
  const goToCreateResultStep = () => {
    setCurrentStep(2);
  };

  return {
    isAtFormStep,
    isAtAuditResultStep,
    isAtCreateResultStep,
    goToFormStep,
    goToAuditResultStep,
    goToCreateResultStep
  };
};

export default useCreateWorkflowSteps;
