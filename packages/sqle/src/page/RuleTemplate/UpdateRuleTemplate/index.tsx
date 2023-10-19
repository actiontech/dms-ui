import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { Space } from 'antd5';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, PageHeader, BasicResult } from '@actiontech/shared';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import RuleTemplateForm from '../RuleTemplateForm';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import { RuleTemplateContStyleWrapper } from '../CreateRuleTemplate/style';
import { useForm } from 'antd5/es/form/Form';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';

import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  IRuleProjectTemplateDetailResV1,
  IRuleReqV1,
  IRuleResV1
} from '@actiontech/shared/lib/api/sqle/service/common';

const UpdateRuleTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const { projectName, projectID } = useCurrentProject();
  const urlParams = useParams<{ templateName: string }>();
  const { data: allRules, loading: getAllRulesLoading } = useRequest(() =>
    rule_template.getRuleListV1({}).then((res) => res.data.data ?? [])
  );

  const [form] = useForm<RuleTemplateBaseInfoFields>();
  const [dbType, setDbType] = useState<string>('');
  const [ruleTemplate, setRuleTemplate] = useState<
    IRuleProjectTemplateDetailResV1 | undefined
  >();
  const [activeRule, setActiveRule] = useState<IRuleResV1[]>([]);
  const [databaseRule, setDatabaseRule] = useState<IRuleResV1[]>([]);
  const [
    updateTemplateLoading,
    { setFalse: finishSubmit, setTrue: startSubmit }
  ] = useBoolean(false);
  const [baseInfoFormSubmitLoading, setBaseInfoFormSubmitLoading] =
    useState(false);
  const disabledForm = useMemo(
    () => updateTemplateLoading,
    [updateTemplateLoading]
  );
  const submitSuccessStatus = useMemo(() => step === 2, [step]);

  const baseInfoFormSubmit = useCallback(async () => {
    setBaseInfoFormSubmitLoading(true);
    try {
      const values = await form.validateFields();
      setDbType(values.db_type);
      setDatabaseRule(
        allRules?.filter((e) => e.db_type === values.db_type) ?? []
      );
      setStep(step + 1);
      setBaseInfoFormSubmitLoading(false);
    } catch (error) {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [form, step, allRules]);

  const onGoRuleList = () => {
    navigate(`/sqle/project/${projectID}/rule/template`);
  };

  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  useEffect(() => {
    rule_template
      .getProjectRuleTemplateV1({
        rule_template_name: urlParams.templateName ?? '',
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const template = res.data.data ?? {};
          setRuleTemplate(template);
          setActiveRule(template?.rule_list ?? []);
        }
      });
  }, [projectName, urlParams.templateName]);

  const resetAll = () => {
    if (!ruleTemplate) return;
    form.setFieldsValue({
      templateName: ruleTemplate.rule_template_name,
      templateDesc: ruleTemplate.desc,
      db_type: ruleTemplate.db_type
    });
    setStep(0);
    setActiveRule([...(ruleTemplate?.rule_list ?? [])]);
  };

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
      .updateProjectRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
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

  return (
    <>
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
                    loading={updateTemplateLoading}
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
            title={t('ruleTemplate.updateRuleTemplate.title')}
            form={form}
            activeRule={activeRule}
            allRules={databaseRule ?? []}
            ruleListLoading={getAllRulesLoading}
            submitLoading={updateTemplateLoading}
            baseInfoFormSubmitLoading={baseInfoFormSubmitLoading}
            step={step}
            dbType={dbType}
            updateActiveRule={setActiveRule}
            baseInfoSubmit={baseInfoFormSubmit}
            submit={submit}
            projectName={projectName}
            defaultData={ruleTemplate}
            mode="update"
          />
        </RuleTemplateContStyleWrapper>
        <div hidden={!submitSuccessStatus}>
          <BasicResult
            icon={<IconSuccessResult />}
            title={t('ruleTemplate.updateRuleTemplate.successTitle', {
              name: urlParams.templateName
            })}
            extra={[
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
    </>
  );
};

export default UpdateRuleTemplate;
