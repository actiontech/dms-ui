import { useTranslation } from 'react-i18next';
import { Spin } from 'antd5';
import { EmptyBox, PageHeader } from '@actiontech/shared';
import { RuleStatus, RuleList, RuleTypes } from '../../components/RuleList';
import {
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import useRuleList from '../../components/RuleList/useRuleList';
import useRuleFilterForm from './hooks/useRuleFilterForm';
import { GetRuleListV1Params, RuleFilterContainerMeta } from './index.data';
import { RuleStatusWrapperStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import { Link } from 'react-router-dom';
import { RuleListStyleWrapper } from './style';
import useCreateRuleTemplatePermission from './hooks/useCreateRuleTemplatePermission';

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

  const {
    filterDbType,
    filterRuleTemplate,
    templateRules,
    loading,
    showNotRuleTemplatePage,
    ruleFilterContainerCustomProps,
    projectID,
    allRules,
    filterProjectName
  } = useRuleFilterForm();

  const { updateTableFilterInfo } = useTableRequestParams<
    GetRuleListV1Params,
    GetRuleListV1Params
  >();

  const { filterContainerMeta } = useTableFilterContainer(
    [],
    updateTableFilterInfo,
    RuleFilterContainerMeta()
  );

  const { allowCreateRuleTemplate } = useCreateRuleTemplatePermission({
    projectID,
    projectName: filterProjectName,
    showNotRuleTemplatePage
  });

  return (
    <RuleListStyleWrapper>
      <PageHeader title={t('rule.pageTitle')} />
      <Spin spinning={loading} delay={400}>
        <RuleStatusWrapperStyleWrapper className="flex-space-between flex-align-center">
          <TableFilterContainer
            updateTableFilterInfo={updateTableFilterInfo}
            filterContainerMeta={filterContainerMeta}
            filterCustomProps={ruleFilterContainerCustomProps}
            style={{ borderBottom: 0 }}
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
