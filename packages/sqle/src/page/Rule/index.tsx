import { useTranslation } from 'react-i18next';
import { Spin, Form, Space, Typography } from 'antd';
import {
  BasicEmpty,
  BasicTag,
  EmptyBox,
  PageHeader,
  TypedLink
} from '@actiontech/shared';
import { RuleList, RuleStatus } from '../../components/RuleList';
import {
  RuleStatusWrapperStyleWrapper,
  ToggleButtonStyleWrapper
} from '@actiontech/shared/lib/styleWrapper/element';
import { RuleBaseInfoStyleWrapper, RuleListStyleWrapper } from './style';
import { FilterOutlined } from '@actiontech/icons';
import useRuleListFilter from './RuleListFilter/hooks';
import RuleListFilter from './RuleListFilter';
import {
  PermissionControl,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import CustomSearchInput from '../../components/RuleList/RuleFilter/RuleFilterCommonFields/CustomInput';
import useRuleList from '../../components/RuleList/useRuleList';
import { useMemo } from 'react';
import { RuleListFilterForm } from './index.type';

const Rule = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<RuleListFilterForm>();
  const { ruleStatus, setRuleStatus, getCurrentStatusRules } = useRuleList();

  const {
    showNotRuleTemplatePage,
    setShowNorRuleTemplatePage,
    bindProjects,
    loading,
    projectID,
    filterRuleTemplate,
    allRules,
    templateRules,
    visible,
    toggleFilterVisible,
    onFuzzyKeywordChange
  } = useRuleListFilter(form);

  const filterDbType = Form.useWatch('filter_db_type', form);
  const filterRuleVersion = Form.useWatch('filter_rule_version', form);

  const templateRulesWithStatus = useMemo(() => {
    return getCurrentStatusRules(allRules, templateRules, filterRuleTemplate);
  }, [getCurrentStatusRules, allRules, templateRules, filterRuleTemplate]);

  return (
    <RuleListStyleWrapper>
      <PageHeader title={t('rule.pageTitle')} />
      <Spin spinning={loading} delay={400}>
        <RuleStatusWrapperStyleWrapper className="flex-space-between flex-align-center">
          <RuleBaseInfoStyleWrapper>
            <Typography.Title level={4} className="base-info-item">
              {filterDbType}
            </Typography.Title>
            <BasicTag size="large" color="blue" className="base-info-item">
              {t('rule.ruleCount', {
                count: filterRuleTemplate
                  ? templateRulesWithStatus.length
                  : (allRules ?? []).length
              })}
            </BasicTag>
            <EmptyBox if={filterRuleVersion !== undefined}>
              <BasicTag size="large" color="gray" className="base-info-item">
                {`v${filterRuleVersion}`}
              </BasicTag>
            </EmptyBox>
          </RuleBaseInfoStyleWrapper>
          <Space size={12}>
            <ToggleButtonStyleWrapper
              active={visible}
              onClick={toggleFilterVisible}
            >
              <FilterOutlined fill="currentColor" />
              <span>{t('rule.filter.filterCondition')}</span>
            </ToggleButtonStyleWrapper>
            {filterRuleTemplate && (
              <RuleStatus
                currentRuleStatus={ruleStatus}
                ruleStatusChange={setRuleStatus}
              />
            )}
            <CustomSearchInput
              id="fuzzy_keyword"
              placeholder={t('rule.form.fuzzy_text_placeholder')}
              allowClear
              onChange={onFuzzyKeywordChange}
            />
          </Space>
        </RuleStatusWrapperStyleWrapper>
        <RuleListFilter
          form={form}
          visible={visible}
          bindProjects={bindProjects}
          setShowNorRuleTemplatePage={setShowNorRuleTemplatePage}
        />

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
          <RuleList
            enableCheckDetail
            pageHeaderHeight={visible ? 170 : 0}
            rules={templateRulesWithStatus}
          />
        </EmptyBox>
      </Spin>
    </RuleListStyleWrapper>
  );
};

export default Rule;
