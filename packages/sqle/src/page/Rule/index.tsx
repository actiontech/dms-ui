import { useTranslation } from 'react-i18next';
import { Spin, Form } from 'antd';
import { EmptyBox, PageHeader } from '@actiontech/shared';
import { RuleStatus, RuleList, RuleTypes } from '../../components/RuleList';
import useRuleList from '../../components/RuleList/useRuleList';
import { RuleStatusWrapperStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import { Link } from 'react-router-dom';
import { RuleListStyleWrapper } from './style';
import useCreateRuleTemplatePermission from './hooks/useCreateRuleTemplatePermission';

import RuleListFilter from './RuleListFilter';
import useRuleListFilter from './hooks/useRuleListFilter';
import { RuleListFilterForm } from './index.type';

const Rule = () => {
  const { t } = useTranslation();
  const {
    ruleStatus,
    ruleType,
    setRuleStatus,
    setRuleType,
    getCurrentStatusRules,
    getCurrentTypeRules
  } = useRuleList();

  const [form] = Form.useForm<RuleListFilterForm>();

  const {
    showNotRuleTemplatePage,
    setShowNorRuleTemplatePage,
    getTemplateRules,
    bindProjects,
    loading,
    projectID,
    projectName,
    filterRuleTemplate,
    filterDbType,
    allRules,
    templateRules,
    getAllRules
  } = useRuleListFilter(form);

  const { allowCreateRuleTemplate } = useCreateRuleTemplatePermission({
    projectID,
    projectName,
    showNotRuleTemplatePage
  });

  return (
    <RuleListStyleWrapper>
      <PageHeader title={t('rule.pageTitle')} />
      <Spin spinning={loading} delay={400}>
        <RuleStatusWrapperStyleWrapper className="flex-space-between flex-align-center">
          <RuleListFilter
            form={form}
            setShowNorRuleTemplatePage={setShowNorRuleTemplatePage}
            getTemplateRules={getTemplateRules}
            bindProjects={bindProjects}
            getAllRules={getAllRules}
          />
          {filterRuleTemplate && (
            <RuleStatus
              currentRuleStatus={ruleStatus}
              ruleStatusChange={setRuleStatus}
            />
          )}
        </RuleStatusWrapperStyleWrapper>
        <EmptyBox
          if={!showNotRuleTemplatePage}
          defaultNode={
            <BasicEmpty
              emptyCont={
                <div className="no-project-rule-template-empty-content">
                  <div>{t('rule.notProjectRuleTemplate')}</div>

                  <EmptyBox if={allowCreateRuleTemplate}>
                    {t('rule.createRuleTemplateTips1')}
                    <Link
                      className="link-create-project-rule-template-btn"
                      to={`/sqle/project/${projectID}/rule/template/create`}
                    >
                      {t('rule.createRuleTemplate')}
                    </Link>
                    {t('rule.createRuleTemplateTips2')}
                  </EmptyBox>
                </div>
              }
            />
          }
        >
          {filterDbType && (
            <RuleTypes
              ruleTypeChange={setRuleType}
              currentRuleType={ruleType}
              allRulesData={allRules ?? []}
              rules={getCurrentStatusRules(
                allRules,
                templateRules,
                filterRuleTemplate
              )}
            />
          )}

          <RuleList
            enableCheckDetail
            pageHeaderHeight={110}
            rules={getCurrentTypeRules(
              allRules,
              templateRules,
              filterRuleTemplate
            )}
          />
        </EmptyBox>
      </Spin>
    </RuleListStyleWrapper>
  );
};

export default Rule;
