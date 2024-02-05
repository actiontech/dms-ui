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
    clearSearchValue
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
      const updateActiveData = cloneDeep(
        tempAllRules.filter((item) => !item.is_custom_rule)
      );
      setActiveRule(updateActiveData);
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
    setBaseInfoFormSubmitLoading
  ]);

  const resetAll = useCallback(() => {
    setStep(0);
    form.resetFields();
    setDbType('');
    clearSearchValue();
  }, [form, setStep, setDbType, clearSearchValue]);

  useEffect(() => {
    if (dbType) {
      const tempAllRules = allRules?.filter((e) => e.db_type === dbType) ?? [];
      setDatabaseRule(tempAllRules);
      setActiveRule(
        cloneDeep(tempAllRules.filter((item) => !item.is_custom_rule))
      );
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
    startSubmit
  };
};

export default useCreateRuleTemplateForm;
