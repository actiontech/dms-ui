import { useBoolean } from 'ahooks';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BasicButton,
  BasicResult,
  PageHeader,
  useTypedParams
} from '@actiontech/shared';
import { IRuleReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { Space, Spin } from 'antd';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';
import classNames from 'classnames';
import RuleTemplateForm from '../../RuleTemplate/RuleTemplateForm';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import {
  useUpdateRuleTemplateForm,
  useBackToListPage
} from '../../../hooks/useRuleTemplateForm';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const UpdateRuleTemplate = () => {
  const { t } = useTranslation();

  const {
    form,
    getAllRulesLoading,
    activeRule,
    allRules,
    step,
    submitSuccessStatus,
    baseInfoFormSubmitLoading,
    dbType,
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
    setFilteredRule,
    ruleFilterForm,
    filterCategoryTags
  } = useUpdateRuleTemplateForm();

  const { onGoToGlobalRuleTemplateList } = useBackToListPage();

  const [
    updateTemplateFormLoading,
    { setTrue: startLoad, setFalse: finishLoad }
  ] = useBoolean();

  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.RULE_TEMPLATE.update>();
  const { projectName } = useCurrentProject();

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
          setFilteredRule(template?.rule_list ?? []);
        }
      })
      .finally(() => {
        finishLoad();
      });
  }, [
    finishLoad,
    setActiveRule,
    startLoad,
    urlParams.templateName,
    setRuleTemplate,
    setFilteredRule
  ]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton onClick={gotoListPage} icon={<LeftArrowOutlined />}>
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
            filteredRule={filteredRule}
            updateFilteredRule={setFilteredRule}
            allRules={allRules ?? []}
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
            ruleFilterForm={ruleFilterForm}
            filterCategoryTags={filterCategoryTags}
          />
        </Spin>
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

export default UpdateRuleTemplate;
