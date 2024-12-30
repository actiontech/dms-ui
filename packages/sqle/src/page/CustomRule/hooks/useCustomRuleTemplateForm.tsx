import { useCallback, useMemo, useState } from 'react';
import { Form } from 'antd';
import {
  CustomRuleFormBaseInfoFields,
  EditRuleScriptFields
} from '../CustomRuleForm';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const useCustomRuleTemplateForm = (isUpdate = false) => {
  const navigate = useTypedNavigate();
  const [form] = Form.useForm<CustomRuleFormBaseInfoFields>();
  const [editScriptForm] = Form.useForm<EditRuleScriptFields>();
  const [step, setStep] = useState(0);
  const submitSuccessStatus = useMemo(() => step === 2, [step]);
  const { updateActiveSegmentedKey } = useRuleManagerSegmented();

  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);
  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const baseInfoFormSubmit = useCallback(async () => {
    await form.validateFields();
    nextStep();
  }, [form, nextStep]);

  const resetAll = () => {
    setStep(0);
    if (isUpdate) {
      form.resetFields(['annotation', 'ruleType', 'level']);
      return;
    }
    form.resetFields();
  };

  const onGoCustomRuleList = () => {
    updateActiveSegmentedKey(RuleManagerSegmentedKey.CustomRule);
    navigate(ROUTE_PATHS.SQLE.RULE_MANAGEMENT.index);
  };

  return {
    form,
    editScriptForm,
    submitSuccessStatus,
    step,
    prevStep,
    nextStep,
    baseInfoFormSubmit,
    resetAll,
    onGoCustomRuleList
  };
};
export default useCustomRuleTemplateForm;
