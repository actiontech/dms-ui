import { useBoolean } from 'ahooks';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BasicButton, BasicResult, PageHeader } from '@actiontech/shared';
import {
  IRuleTemplateDetailResV1,
  IRuleReqV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import useRuleTemplateForm from '../../RuleTemplate/hooks/useRuleTemplateForm';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { Space, Spin } from 'antd5';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';
import classNames from 'classnames';
import RuleTemplateForm from '../../RuleTemplate/RuleTemplateForm';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const UpdateRuleTemplate = () => {
  const { t } = useTranslation();

  const {
    form,
    getAllRulesLoading,
    activeRule,
    databaseRule,
    step,
    submitSuccessStatus,
    baseInfoFormSubmitLoading,
    dbType,
    setActiveRule,
    prevStep,
    nextStep,
    baseInfoFormSubmit,
    resetAll,
    onGoToGlobalRuleTemplateList
  } = useRuleTemplateForm();
  const [
    updateTemplateFormLoading,
    { setTrue: startLoad, setFalse: finishLoad }
  ] = useBoolean();
  const [
    updateTemplateLoading,
    { setTrue: startSubmit, setFalse: finishSubmit }
  ] = useBoolean();
  const [ruleTemplate, setRuleTemplate] = useState<
    IRuleTemplateDetailResV1 | undefined
  >();
  const urlParams = useParams<{ templateName: string }>();
  const { projectName } = useCurrentProject();

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
      .updateRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        rule_list: activeRuleWithNewField
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          nextStep();
        }
      })
      .finally(() => {
        finishSubmit();
      });
  }, [activeRule, finishSubmit, form, nextStep, startSubmit]);

  useEffect(() => {
    startLoad();
    rule_template
      .getRuleTemplateV1({
        rule_template_name: urlParams.templateName ?? ''
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const template = res.data.data;
          setRuleTemplate(template);
          setActiveRule(template?.rule_list ?? []);
        }
      })
      .finally(() => {
        finishLoad();
      });
  }, [finishLoad, setActiveRule, startLoad, urlParams.templateName]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton
            onClick={onGoToGlobalRuleTemplateList}
            icon={<IconLeftArrow />}
          >
            {t('ruleManager.backToGlobalRuleTemplateList')}
          </BasicButton>
        }
        extra={
          <Space size={12}>
            {step === 0 && (
              <BasicButton onClick={resetAll} disabled={updateTemplateLoading}>
                {t('common.reset')}
              </BasicButton>
            )}
            {step === 1 && (
              <>
                <BasicButton
                  onClick={prevStep}
                  disabled={updateTemplateLoading}
                >
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
        <Spin spinning={getAllRulesLoading || updateTemplateFormLoading}>
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
            baseInfoSubmit={() =>
              baseInfoFormSubmit('global-update', ruleTemplate?.rule_list ?? [])
            }
            submit={submit}
            projectName={projectName}
            defaultData={ruleTemplate}
            mode="update"
          />
        </Spin>
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
              onClick={onGoToGlobalRuleTemplateList}
            >
              {t('ruleManager.backToGlobalRuleTemplateList')}
            </BasicButton>
          ]}
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default UpdateRuleTemplate;
