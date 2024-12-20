import { useCallback, useState } from 'react';
import { IRuleTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import useRules from './useRules';
import useFormStep from './useFormStep';
import { useBoolean } from 'ahooks';

const useUpdateRuleTemplateForm = () => {
  const {
    form,
    step,
    setStep,
    submitSuccessStatus,
    prevStep,
    nextStep,
    baseInfoFormSubmitLoading,
    setBaseInfoFormSubmitLoading,
    dbType
  } = useFormStep();

  const {
    allRules,
    getAllRules,
    getAllRulesLoading,
    activeRule,
    setActiveRule,
    clearSearchValue,
    filteredRule,
    setFilteredRule,
    ruleFilterForm,
    filterCategoryTags
  } = useRules(dbType);

  const [
    updateTemplateLoading,
    { setTrue: startSubmit, setFalse: finishSubmit }
  ] = useBoolean();

  const [ruleTemplate, setRuleTemplate] = useState<
    IRuleTemplateDetailResV1 | undefined
  >();

  const baseInfoFormSubmit = useCallback(async () => {
    setBaseInfoFormSubmitLoading(true);
    try {
      await form.validateFields();
      nextStep();
      setBaseInfoFormSubmitLoading(false);
    } catch (error) {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [form, nextStep, setBaseInfoFormSubmitLoading]);

  const resetAll = useCallback(() => {
    if (!ruleTemplate) return;
    setStep(0);
    form.setFieldsValue({
      templateDesc: ruleTemplate?.desc
    });
    setActiveRule([...(ruleTemplate?.rule_list ?? [])]);
    setFilteredRule([...(ruleTemplate?.rule_list ?? [])]);
    clearSearchValue();
  }, [
    form,
    ruleTemplate,
    setStep,
    setActiveRule,
    clearSearchValue,
    setFilteredRule
  ]);

  return {
    form,
    allRules,
    getAllRulesLoading,
    activeRule,
    step,
    submitSuccessStatus,
    baseInfoFormSubmitLoading,
    dbType,
    getAllRules,
    setActiveRule,
    prevStep,
    nextStep,
    baseInfoFormSubmit,
    resetAll,
    ruleTemplate,
    setRuleTemplate,
    updateTemplateLoading,
    startSubmit,
    finishSubmit,
    filteredRule,
    setFilteredRule,
    ruleFilterForm,
    filterCategoryTags
  };
};

export default useUpdateRuleTemplateForm;
