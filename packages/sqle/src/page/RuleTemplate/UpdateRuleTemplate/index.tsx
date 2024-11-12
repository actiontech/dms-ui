import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { Space } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  BasicButton,
  PageHeader,
  BasicResult,
  useTypedParams
} from '@actiontech/shared';
import RuleTemplateForm from '../RuleTemplateForm';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { RuleTemplateContStyleWrapper } from '../CreateRuleTemplate/style';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IRuleReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useUpdateRuleTemplateForm,
  useBackToListPage
} from '../../../hooks/useRuleTemplateForm';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const UpdateRuleTemplate = () => {
  const { t } = useTranslation();

  const { projectName, projectID } = useCurrentProject();
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.RULE_TEMPLATE.update>();

  const {
    step,
    nextStep,
    prevStep,
    baseInfoFormSubmit,
    form,
    resetAll,
    getAllRulesLoading,
    ruleTemplate,
    setRuleTemplate,
    dbType,
    activeRule,
    setActiveRule,
    databaseRule,
    updateTemplateLoading,
    finishSubmit,
    startSubmit,
    baseInfoFormSubmitLoading,
    submitSuccessStatus,
    filteredRule,
    setFilteredRule
  } = useUpdateRuleTemplateForm();

  const { onGotoRuleTemplateList } = useBackToListPage(projectID);

  const getRuleTemplate = useCallback(
    (fuzzyKeyword?: string) => {
      rule_template
        .getProjectRuleTemplateV1({
          rule_template_name: urlParams.templateName ?? '',
          project_name: projectName,
          fuzzy_keyword_rule: fuzzyKeyword
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const template = res.data.data ?? {};
            setRuleTemplate(template);
            setActiveRule(template?.rule_list ?? []);
            setFilteredRule(template?.rule_list ?? []);
          }
        });
    },
    [
      projectName,
      urlParams.templateName,
      setActiveRule,
      setRuleTemplate,
      setFilteredRule
    ]
  );

  useEffect(() => {
    getRuleTemplate();
  }, [getRuleTemplate]);

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
          nextStep();
        }
      })
      .finally(() => {
        finishSubmit();
      });
  }, [activeRule, finishSubmit, form, projectName, startSubmit, nextStep]);

  return (
    <>
      <PageLayoutHasFixedHeaderStyleWrapper>
        <PageHeader
          fixed={step !== 1}
          title={
            <BasicButton
              onClick={onGotoRuleTemplateList}
              icon={<LeftArrowOutlined />}
            >
              {t('ruleTemplate.backToList')}
            </BasicButton>
          }
          extra={
            <Space size={12}>
              {step === 0 && (
                <BasicButton
                  onClick={resetAll}
                  disabled={updateTemplateLoading}
                >
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
          <RuleTemplateForm
            title={t('ruleTemplate.updateRuleTemplate.title')}
            form={form}
            activeRule={activeRule}
            filteredRule={filteredRule}
            updateFilteredRule={setFilteredRule}
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
            status="success"
            title={t('ruleTemplate.updateRuleTemplate.successTitle', {
              name: urlParams.templateName
            })}
            extra={[
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
    </>
  );
};

export default UpdateRuleTemplate;
