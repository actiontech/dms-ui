import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import classNames from 'classnames';
import { BasicButton, BasicResult, PageHeader } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IRuleReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';
import RuleTemplateForm from '../../RuleTemplate/RuleTemplateForm';
import {
  useCreateRuleTemplateForm,
  useBackToListPage
} from '../../../hooks/useRuleTemplateForm';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';

const CreateRuleTemplate = () => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

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
    createLoading,
    startSubmit,
    finishSubmit
  } = useCreateRuleTemplateForm();

  const { onGoToGlobalRuleTemplateList } = useBackToListPage();

  const { updateActiveSegmentedKey } = useRuleManagerSegmented();

  const gotoListPage = () => {
    updateActiveSegmentedKey(RuleManagerSegmentedKey.GlobalRuleTemplate);
    onGoToGlobalRuleTemplateList();
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
      .createRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        db_type: baseInfo.db_type,
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

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton onClick={gotoListPage} icon={<IconLeftArrow />}>
            {t('ruleManager.backToGlobalRuleTemplateList')}
          </BasicButton>
        }
        extra={
          <Space size={12}>
            {step === 0 && (
              <BasicButton onClick={resetAll} disabled={createLoading}>
                {t('common.reset')}
              </BasicButton>
            )}
            {step === 1 && (
              <>
                <BasicButton onClick={prevStep} disabled={createLoading}>
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
            <BasicButton key="re-create-new-rule-template" onClick={resetAll}>
              {t('ruleTemplate.createRuleTemplate.reCreateNew')}
            </BasicButton>,
            <BasicButton
              type="primary"
              key="view-rule-template-list"
              onClick={gotoListPage}
            >
              {t('ruleManager.backToGlobalRuleTemplateList')}
            </BasicButton>
          ]}
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default CreateRuleTemplate;
