import { useState, useMemo, useCallback } from 'react';
import { RuleTemplateBaseInfoFields } from '../../page/RuleTemplate/RuleTemplateForm/BaseInfoForm/index.type';
import { Form } from 'antd';

const SUCCESS_STEP_NUM = 2;

const useFormStep = () => {
  const [form] = Form.useForm<RuleTemplateBaseInfoFields>();

  const dbType = Form.useWatch('db_type', form);

  const ruleVersion = Form.useWatch('ruleVersion', form);

  const [step, setStep] = useState(0);

  const [baseInfoFormSubmitLoading, setBaseInfoFormSubmitLoading] =
    useState(false);

  const submitSuccessStatus = useMemo(() => step === SUCCESS_STEP_NUM, [step]);

  const prevStep = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
    }
  }, [step]);

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  return {
    form,
    step,
    setStep,
    prevStep,
    nextStep,
    submitSuccessStatus,
    baseInfoFormSubmitLoading,
    setBaseInfoFormSubmitLoading,
    dbType,
    ruleVersion
  };
};

export default useFormStep;
