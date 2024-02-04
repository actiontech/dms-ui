import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import {
  IRuleResV1,
  IParseProjectRuleTemplateFileResDataV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SelectFileFormFields } from '../../page/RuleTemplate/ImportRuleTemplate/index.type';
import { RuleTemplateFormProps } from '../../page/RuleTemplate/RuleTemplateForm/index.type';
import { message, Form } from 'antd';

import useFormStep from './useFormStep';
import useAllRules from './useRules';

const useImportRuleTemplate = () => {
  const { t } = useTranslation();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [selectFileForm] = Form.useForm<SelectFileFormFields>();

  const {
    form: ruleTemplateForm,
    step,
    setStep,
    submitSuccessStatus,
    prevStep,
    nextStep,
    baseInfoFormSubmitLoading,
    setBaseInfoFormSubmitLoading
  } = useFormStep();

  const [ruleTemplateFormVisibility, { setTrue: showRuleTemplateForm }] =
    useBoolean();

  const [
    getAllRulesLoading,
    { setTrue: startGetAllRules, setFalse: finishGetAllRules }
  ] = useBoolean();

  const [allRules, setAllRules] = useState<RuleTemplateFormProps['allRules']>(
    []
  );

  const importFileData = useRef<IParseProjectRuleTemplateFileResDataV1>();

  const [createLoading, { setTrue: startCreate, setFalse: finishCreate }] =
    useBoolean();

  const {
    getAllRulesAsync,
    activeRule,
    setActiveRule,
    dbType,
    setDbType,
    subscribe,
    clearSearchValue
  } = useAllRules(true);

  const getAllRulesByDbTypeAndFilterActiveRuleList = (
    importRuleList: IRuleResV1[],
    dbType?: string,
    keyword?: string
  ) => {
    startGetAllRules();
    getAllRulesAsync({
      filter_db_type: dbType,
      fuzzy_keyword_rule: keyword
    })
      .then((res) => {
        setAllRules(res ?? []);
        const activeRules = importRuleList.filter((rule) => {
          return res?.some((allRule) => allRule.rule_name === rule.rule_name);
        });
        setActiveRule(activeRules);
      })
      .finally(() => {
        finishGetAllRules();
      });
  };

  const importFile = async () => {
    await selectFileForm.validateFields();
    const importValues = selectFileForm.getFieldsValue();
    const hideLoading = messageApi.loading(
      t('ruleTemplate.importRuleTemplate.importingFile'),
      0
    );
    rule_template
      .importProjectRuleTemplateV1({
        rule_template_file: importValues.ruleTemplateFile[0]
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const parseFileData = res.data.data;
          if (parseFileData) {
            showRuleTemplateForm();
            getAllRulesByDbTypeAndFilterActiveRuleList(
              parseFileData.rule_list ?? [],
              parseFileData.db_type
            );
            importFileData.current = parseFileData;
            ruleTemplateForm.setFieldsValue({
              templateDesc: parseFileData.desc,
              templateName: parseFileData.name,
              db_type: parseFileData.db_type
            });
          }
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const baseInfoFormSubmit = useCallback(async () => {
    setBaseInfoFormSubmitLoading(true);
    try {
      const values = await ruleTemplateForm.validateFields();
      setDbType(values.db_type);
      nextStep();
      setBaseInfoFormSubmitLoading(false);
    } catch (error) {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [ruleTemplateForm, nextStep, setDbType, setBaseInfoFormSubmitLoading]);

  const resetAll = () => {
    selectFileForm.resetFields();

    setStep(0);
    ruleTemplateForm.resetFields();
    setDbType('');
    clearSearchValue();
  };

  useEffect(() => {
    const unsubscribe = subscribe((value: string) => {
      getAllRulesByDbTypeAndFilterActiveRuleList(
        importFileData.current?.rule_list ?? [],
        importFileData.current?.db_type,
        value
      );
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ruleTemplateFormVisibility,
    selectFileForm,
    ruleTemplateForm,
    allRules,
    getAllRulesLoading,
    importFile,
    activeRule,
    setActiveRule,
    messageContextHolder,
    resetAll,
    step,
    setStep,
    nextStep,
    prevStep,
    submitSuccessStatus,
    baseInfoFormSubmit,
    baseInfoFormSubmitLoading,
    dbType,
    setDbType,
    createLoading,
    startCreate,
    finishCreate
  };
};

export default useImportRuleTemplate;
