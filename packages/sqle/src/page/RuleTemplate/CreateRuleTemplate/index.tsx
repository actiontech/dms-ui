import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, PageHeader, BasicResult } from '@actiontech/shared';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd';
import { RuleTemplateContStyleWrapper } from './style';
import RuleTemplateForm from '../RuleTemplateForm';

import { cloneDeep } from 'lodash';
import { useBoolean, useRequest } from 'ahooks';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'antd/es/form/Form';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import {
  IRuleReqV1,
  IRuleResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';
import { ResponseCode } from '../../../data/common';
import classNames from 'classnames';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

const CreateRuleTemplate = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const { projectName, projectID } = useCurrentProject();
  const [activeRule, setActiveRule] = useState<IRuleResV1[]>([]);
  const [databaseRule, setDatabaseRule] = useState<IRuleResV1[]>([]);
  const [dbType, setDbType] = useState<string>('');
  const {
    data: allRules,
    loading: getAllRulesLoading,
    run: getAllRules
  } = useRequest((keyword?: string) =>
    rule_template
      .getRuleListV1({
        fuzzy_keyword_rule: keyword
      })
      .then((res) => res.data.data ?? [])
  );

  const [form] = useForm<RuleTemplateBaseInfoFields>();
  const [baseInfoFormSubmitLoading, setBaseInfoFormSubmitLoading] =
    useState(false);
  const [createLoading, { setFalse: finishSubmit, setTrue: startSubmit }] =
    useBoolean(false);
  const disabledForm = useMemo(() => createLoading, [createLoading]);
  const submitSuccessStatus = useMemo(() => step === 2, [step]);

  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const resetAll = useCallback(() => {
    setStep(0);
    form.resetFields();
    setDbType('');
    EventEmitter.emit(EmitterKey.Search_Rule_Template_Rule_Clear_Value);
  }, [form]);

  const onReCreateRuleTem = () => {
    resetAll();
  };

  const onGoRuleList = () => {
    navigate(`/sqle/project/${projectID}/rule/template`);
  };

  const baseInfoFormSubmit = useCallback(async () => {
    setBaseInfoFormSubmitLoading(true);
    try {
      const values = await form.validateFields();
      setDbType(values.db_type);
      const tempAllRules =
        allRules?.filter((e) => e.db_type === values.db_type) ?? [];
      setDatabaseRule(tempAllRules);
      setActiveRule(
        cloneDeep(tempAllRules.filter((item) => !item.is_custom_rule))
      );
      setStep(step + 1);
      setBaseInfoFormSubmitLoading(false);
    } catch (error) {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [form, step, allRules]);

  const submit = useCallback(() => {
    startSubmit();
    const baseInfo = form.getFieldsValue();
    const activeRuleWithNewField: IRuleReqV1[] = activeRule.map((rule) => {
      return {
        name: rule.rule_name,
        level: rule.level,
        params: !!rule.params
          ? rule.params.map((v) => ({ key: v.key, value: v.value }))
          : [],
        is_custom_rule: !!rule.is_custom_rule
      };
    });
    rule_template
      .createProjectRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        db_type: baseInfo.db_type,
        rule_list: activeRuleWithNewField,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setStep(step + 1);
        }
      })
      .finally(() => {
        finishSubmit();
      });
  }, [activeRule, finishSubmit, form, projectName, startSubmit, step]);

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

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Search_Rule_Template_Rule_Select_List,
      getAllRules
    );

    return unsubscribe;
  }, [getAllRules]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton onClick={onGoRuleList} icon={<IconLeftArrow />}>
            {t('ruleTemplate.backToList')}
          </BasicButton>
        }
        extra={
          <Space size={12}>
            {step === 0 && (
              <BasicButton onClick={resetAll} disabled={disabledForm}>
                {t('common.reset')}
              </BasicButton>
            )}
            {step === 1 && (
              <>
                <BasicButton onClick={prevStep} disabled={disabledForm}>
                  {t('common.prevStep')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  loading={createLoading}
                  onClick={submit}
                >
                  {t('common.submit')}
                </BasicButton>
              </>
            )}
          </Space>
        }
      />
      <RuleTemplateContStyleWrapper
        className={classNames({
          'fix-header-padding': step !== 1
        })}
        hidden={submitSuccessStatus}
      >
        <RuleTemplateForm
          title={t('ruleTemplate.createRuleTemplate.title')}
          form={form}
          activeRule={activeRule}
          allRules={databaseRule ?? []}
          ruleListLoading={getAllRulesLoading}
          submitLoading={createLoading}
          baseInfoFormSubmitLoading={baseInfoFormSubmitLoading}
          step={step}
          dbType={dbType}
          updateActiveRule={setActiveRule}
          baseInfoSubmit={baseInfoFormSubmit}
          submit={submit}
          projectName={projectName}
          mode="create"
        />
      </RuleTemplateContStyleWrapper>
      <div hidden={!submitSuccessStatus}>
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('ruleTemplate.createRuleTemplate.successTitle')}
          extra={[
            <BasicButton
              key="re-create-new-rule-template"
              onClick={onReCreateRuleTem}
            >
              {t('ruleTemplate.createRuleTemplate.reCreateNew')}
            </BasicButton>,
            <BasicButton
              type="primary"
              key="view-rule-template-list"
              onClick={onGoRuleList}
            >
              {t('ruleTemplate.backToList')}
            </BasicButton>
          ]}
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default CreateRuleTemplate;
