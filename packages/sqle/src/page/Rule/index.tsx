import { useTranslation } from 'react-i18next';
import { Spin, Form } from 'antd';
import { EmptyBox, PageHeader, TypedLink } from '@actiontech/shared';
import { RuleStatus, RuleList, RuleTypes } from '../../components/RuleList';
import useRuleList from '../../components/RuleList/useRuleList';
import { RuleStatusWrapperStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import { RuleListStyleWrapper } from './style';

import RuleListFilter from './RuleListFilter';
import useRuleListFilter from './hooks/useRuleListFilter';
import { RuleListFilterForm } from './index.type';
import { PermissionControl, PERMISSIONS } from '@actiontech/shared/lib/global';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

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
    filterRuleTemplate,
    filterDbType,
    allRules,
    templateRules,
    getAllRules
  } = useRuleListFilter(form);

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

                  <PermissionControl
                    permission={
                      PERMISSIONS.ACTIONS.SQLE.RULE.CREATE_RULE_TEMPLATE
                    }
                    projectID={projectID}
                  >
                    {t('rule.createRuleTemplateTips1')}
                    <TypedLink
                      className="link-create-project-rule-template-btn"
                      to={ROUTE_PATHS.SQLE.RULE_TEMPLATE.create}
                      params={{ projectID: projectID ?? '' }}
                    >
                      {t('rule.createRuleTemplate')}
                    </TypedLink>
                    {t('rule.createRuleTemplateTips2')}
                  </PermissionControl>
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
            pageHeaderHeight={50}
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
