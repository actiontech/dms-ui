import { useState } from 'react';

const useCreateOrderSteps = () => {
  const [step, setStep] = useState(0);

  const showFormAction = () => {
    setStep(0);
  };
  const showTasksAction = () => {
    setStep(1);
  };
  const showResultAction = () => {
    setStep(2);
  };

  return {
    showForm: step === 0,
    showTasks: step === 1,
    showResult: step === 2,
    showFormAction,
    showTasksAction,
    showResultAction
  };
};

export default useCreateOrderSteps;
