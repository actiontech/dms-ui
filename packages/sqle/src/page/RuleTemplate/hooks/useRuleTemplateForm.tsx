import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { useForm } from 'antd/es/form/Form';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';
import {
  IRuleResV1,
  IRuleTemplateDetailResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { cloneDeep } from 'lodash';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { useEffect } from 'react';

const successStepNum = 2;

// todo: hooks 需要重构。。。
const useRuleTemplateForm = (isImport = false, filterTemplateRule = false) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const submitSuccessStatus = useMemo(() => step === successStepNum, [step]);
  const {
    data: allRules,
    loading: getAllRulesLoading,
    run: getAllRules
  } = useRequest(
    (params) =>
      rule_template
        .getRuleListV1(params ?? {})
        .then((res) => res.data.data ?? []),
    {
      manual: isImport
    }
  );
  const [activeRule, setActiveRule] = useState<IRuleResV1[]>([]);
  const [databaseRule, setDatabaseRule] = useState<IRuleResV1[]>([]);
  const [dbType, setDbType] = useState<string>('');
  const [baseInfoFormSubmitLoading, setBaseInfoFormSubmitLoading] =
    useState(false);
  const [ruleTemplate, setRuleTemplate] = useState<
    IRuleTemplateDetailResV1 | undefined
  >();

  const [form] = useForm<RuleTemplateBaseInfoFields>();
  const { updateActiveSegmentedKey } = useRuleManagerSegmented();

  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);
  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  // todo: 不同 mode 的 all rule & active rule
  const baseInfoFormSubmit = useCallback(
    async (mode = '', importData = [] as IRuleResV1[]) => {
      setBaseInfoFormSubmitLoading(true);
      try {
        const values = await form.validateFields();
        setDbType(values.db_type);
        const tempAllRules =
          allRules?.filter((e) => e.db_type === values.db_type) ?? [];
        setDatabaseRule(tempAllRules);

        if (!isImport) {
          let updateActiveData: IRuleResV1[] = tempAllRules;
          if (mode === 'create') {
            updateActiveData = cloneDeep(
              tempAllRules.filter((item) => !item.is_custom_rule)
            );
          } else if (mode === 'global-update') {
            updateActiveData = importData;
          }
          setActiveRule(updateActiveData);
        } else {
          setActiveRule(cloneDeep(importData));
        }
        nextStep();
        setBaseInfoFormSubmitLoading(false);
      } catch (error) {
        setBaseInfoFormSubmitLoading(false);
      }
    },
    [form, allRules, nextStep, isImport]
  );

  const resetAll = useCallback(() => {
    setStep(0);
    if (ruleTemplate) {
      form.setFieldsValue({
        templateDesc: ruleTemplate?.desc
      });
    } else {
      form.resetFields();
    }

    setDbType('');
    EventEmitter.emit(EmitterKey.Search_Rule_Template_Rule_Clear_Value);
  }, [form, ruleTemplate]);

  const onGoToGlobalRuleTemplateList = () => {
    updateActiveSegmentedKey(RuleManagerSegmentedKey.GlobalRuleTemplate);

    navigate('/sqle/ruleManager');
  };

  useEffect(() => {
    if (dbType && !isImport) {
      const tempAllRules = allRules?.filter((e) => e.db_type === dbType) ?? [];
      setDatabaseRule(tempAllRules);
      if (filterTemplateRule) {
        const templateRule = ruleTemplate?.rule_list ?? [];
        setActiveRule(
          cloneDeep(
            templateRule.filter((item) => {
              return tempAllRules.some(
                (allRule) => allRule.rule_name === item.rule_name
              );
            })
          )
        );
      } else {
        setActiveRule(
          cloneDeep(tempAllRules.filter((item) => !item.is_custom_rule))
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRules]);

  useEffect(() => {
    if (!isImport) {
      const { unsubscribe } = EventEmitter.subscribe(
        EmitterKey.Search_Rule_Template_Rule_Select_List,
        (value) => {
          getAllRules({
            fuzzy_keyword_rule: value
          });
        }
      );
      return unsubscribe;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    onGoToGlobalRuleTemplateList,
    ruleTemplate,
    setRuleTemplate
  };
};

export default useRuleTemplateForm;
