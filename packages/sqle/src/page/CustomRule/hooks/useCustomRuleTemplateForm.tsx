import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';
import {
  CustomRuleFormBaseInfoFields,
  EditRuleScriptFields
} from '../CustomRuleForm';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';

const useCustomRuleTemplateForm = (isUpdate = false) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CustomRuleFormBaseInfoFields>();
  const [editScriptForm] = Form.useForm<EditRuleScriptFields>();
  const [step, setStep] = useState(0);
  const submitSuccessStatus = useMemo(() => step === 2, [step]);
  const [extraRuleTypeList, setExtraRuleTypeList] = useState<string[]>([]);
  const [extraRuleName, setExtraRuleName] = useState('');
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
      form.resetFields(['desc', 'annotation', 'ruleType', 'level']);
      return;
    }
    form.resetFields();
    setExtraRuleName('');
    setExtraRuleTypeList([]);
  };

  const resetExtraInfo = () => {
    if (!extraRuleName) {
      return;
    }
    setExtraRuleTypeList((v) => [...v, extraRuleName]);
    setExtraRuleName('');
  };

  const onExtraRuleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setExtraRuleName(e.target.value);

  const onGoCustomRuleList = () => {
    updateActiveSegmentedKey(RuleManagerSegmentedKey.CustomRule);
    navigate('/sqle/ruleManager');
  };

  return {
    form,
    editScriptForm,
    submitSuccessStatus,
    step,
    extraRuleTypeList,
    extraRuleName,
    prevStep,
    nextStep,
    baseInfoFormSubmit,
    resetExtraInfo,
    onExtraRuleNameChange,
    resetAll,
    onGoCustomRuleList
  };
};
export default useCustomRuleTemplateForm;
