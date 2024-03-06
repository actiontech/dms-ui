import { useTranslation } from 'react-i18next';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, PageHeader, BasicResult } from '@actiontech/shared';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd';
import { RuleTemplateContStyleWrapper } from './style';
import RuleTemplateForm from '../RuleTemplateForm';
import { useCallback } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IRuleReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '../../../data/common';
import classNames from 'classnames';
import {
  useCreateRuleTemplateForm,
  useBackToListPage
} from '../../../hooks/useRuleTemplateForm';

const CreateRuleTemplate = () => {
  const { t } = useTranslation();

  const { projectName, projectID } = useCurrentProject();

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
    finishSubmit,
    startSubmit,
    filteredRule,
    setFilteredRule
  } = useCreateRuleTemplateForm();

  const { onGotoRuleTemplateList } = useBackToListPage(projectID);

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
          nextStep();
        }
      })
      .finally(() => {
        finishSubmit();
      });
  }, [activeRule, finishSubmit, form, projectName, startSubmit, nextStep]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton
            onClick={onGotoRuleTemplateList}
            icon={<IconLeftArrow />}
          >
            {t('ruleTemplate.backToList')}
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
          filteredRule={filteredRule}
          updateFilteredRule={setFilteredRule}
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
              onClick={onGotoRuleTemplateList}
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
