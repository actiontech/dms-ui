import { useCallback, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import useRules from './useRules';
import useFormStep from './useFormStep';
import { useBoolean } from 'ahooks';

const useCreateRuleTemplateForm = () => {
  const {
    form,
    step,
    setStep,
    submitSuccessStatus,
    prevStep,
    nextStep,
    baseInfoFormSubmitLoading,
    setBaseInfoFormSubmitLoading,
    dbType,
    ruleVersion
  } = useFormStep();

  const {
    allRules,
    getAllRulesLoading,
    activeRule,
    setActiveRule,
    clearSearchValue,
    filteredRule,
    setFilteredRule,
    ruleFilterForm,
    filterCategoryTags
  } = useRules(dbType, ruleVersion);

  const [createLoading, { setFalse: finishSubmit, setTrue: startSubmit }] =
    useBoolean(false);

  const baseInfoFormSubmit = useCallback(async () => {
    setBaseInfoFormSubmitLoading(true);
    try {
      await form.validateFields();
      if (!activeRule.length) {
        const updateActiveData = cloneDeep(
          allRules?.filter((item) => !item.is_custom_rule) ?? []
        );
        setActiveRule(updateActiveData);
        setFilteredRule(updateActiveData);
      }
      nextStep();
      setBaseInfoFormSubmitLoading(false);
    } catch {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [
    form,
    allRules,
    nextStep,
    setActiveRule,
    setBaseInfoFormSubmitLoading,
    setFilteredRule,
    activeRule
  ]);

  const resetAll = useCallback(() => {
    setStep(0);
    form.resetFields();
    clearSearchValue();
  }, [form, setStep, clearSearchValue]);

  useEffect(() => {
    setActiveRule([]);
  }, [dbType, setActiveRule]);

  return {
    form,
    getAllRulesLoading,
    activeRule,
    allRules,
    step,
    submitSuccessStatus,
    baseInfoFormSubmitLoading,
    dbType,
    setActiveRule,
    prevStep,
    nextStep,
    baseInfoFormSubmit,
    resetAll,
    createLoading,
    finishSubmit,
    startSubmit,
    filteredRule,
    setFilteredRule,
    ruleFilterForm,
    filterCategoryTags
  };
};

export default useCreateRuleTemplateForm;
