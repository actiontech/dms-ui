import { useCallback, useState, useEffect } from 'react';
import { IRuleTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { cloneDeep } from 'lodash';
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
      const values = await form.validateFields();
      setDbType(values.db_type);
      const tempAllRules =
        allRules?.filter((e) => e.db_type === values.db_type) ?? [];
      setDatabaseRule(tempAllRules);
      nextStep();
      setBaseInfoFormSubmitLoading(false);
    } catch (error) {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [
    form,
    nextStep,
    allRules,
    setDatabaseRule,
    setDbType,
    setBaseInfoFormSubmitLoading
  ]);

  const resetAll = useCallback(() => {
    if (!ruleTemplate) return;
    setStep(0);
    form.setFieldsValue({
      templateDesc: ruleTemplate?.desc
    });
    setDbType('');
    setActiveRule([...(ruleTemplate?.rule_list ?? [])]);
    setFilteredRule([...(ruleTemplate?.rule_list ?? [])]);
    clearSearchValue();
  }, [
    form,
    ruleTemplate,
    setStep,
    setActiveRule,
    setDbType,
    clearSearchValue,
    setFilteredRule
  ]);

  useEffect(() => {
    if (dbType) {
      const tempAllRules = allRules?.filter((e) => e.db_type === dbType) ?? [];
      setDatabaseRule(tempAllRules);

      setFilteredRule(
        cloneDeep(
          activeRule.filter((item) => {
            return tempAllRules.some(
              (allRule) => allRule.rule_name === item.rule_name
            );
          })
        )
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
    ruleTemplate,
    setRuleTemplate,
    updateTemplateLoading,
    startSubmit,
    finishSubmit,
    filteredRule,
    setFilteredRule
  };
};

export default useUpdateRuleTemplateForm;
