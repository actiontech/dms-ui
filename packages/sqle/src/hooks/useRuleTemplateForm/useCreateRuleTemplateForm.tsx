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
    setBaseInfoFormSubmitLoading
  } = useFormStep();

  const {
    allRules,
    getAllRules,
    getAllRulesLoading,
    activeRule,
    setActiveRule,
    databaseRule,
    setDatabaseRule,
    dbType,
    setDbType,
    clearSearchValue,
    filteredRule,
    setFilteredRule
  } = useRules();

  const [createLoading, { setFalse: finishSubmit, setTrue: startSubmit }] =
    useBoolean(false);

  const baseInfoFormSubmit = useCallback(async () => {
    setBaseInfoFormSubmitLoading(true);
    try {
      const values = await form.validateFields();
      setDbType(values.db_type);
      const tempAllRules =
        allRules?.filter((e) => e.db_type === values.db_type) ?? [];
      setDatabaseRule(tempAllRules);
      if (!activeRule.length) {
        const updateActiveData = cloneDeep(
          tempAllRules.filter((item) => !item.is_custom_rule)
        );
        setActiveRule(updateActiveData);
        setFilteredRule(updateActiveData);
      }
      nextStep();
      setBaseInfoFormSubmitLoading(false);
    } catch (error) {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [
    form,
    allRules,
    nextStep,
    setActiveRule,
    setDatabaseRule,
    setDbType,
    setBaseInfoFormSubmitLoading,
    setFilteredRule,
    activeRule
  ]);

  const resetAll = useCallback(() => {
    setStep(0);
    form.resetFields();
    setDbType('');
    clearSearchValue();
    setActiveRule([]);
    setFilteredRule([]);
  }, [
    form,
    setStep,
    setDbType,
    clearSearchValue,
    setActiveRule,
    setFilteredRule
  ]);

  useEffect(() => {
    if (dbType) {
      const tempAllRules = allRules?.filter((e) => e.db_type === dbType) ?? [];
      setDatabaseRule(tempAllRules);
      const showRuleList = activeRule.filter((item) =>
        tempAllRules.some((i) => i.rule_name === item.rule_name)
      );
      setFilteredRule(cloneDeep(showRuleList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRules]);

  return {
    form,
    getAllRulesLoading,
    activeRule,
    databaseRule,
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
    createLoading,
    finishSubmit,
    startSubmit,
    filteredRule,
    setFilteredRule
  };
};

export default useCreateRuleTemplateForm;
