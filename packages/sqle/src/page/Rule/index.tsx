import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { Spin } from 'antd5';
import { PageHeader } from '@actiontech/shared';
import { RuleStatus, RuleList, RuleTypes } from '../../components/RuleList';
import {
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import useRuleList from '../../components/RuleList/useRuleList';
import useRuleFilterForm from './useRuleFilterForm';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { GetRuleListV1Params, RuleFilterContainerMeta } from './index.data';
import { RuleStatusWrapperStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

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

  const { updateTableFilterInfo } = useTableRequestParams<
    GetRuleListV1Params,
    GetRuleListV1Params
  >();

  const { filterContainerMeta } = useTableFilterContainer(
    [],
    updateTableFilterInfo,
    RuleFilterContainerMeta()
  );

  const {
    data: projectTemplateRules,
    loading: getProjectTemplateRulesLoading,
    run: getProjectTemplateRules
  } = useRequest(
    (project?: string, ruleTemplate?: string, filter_fuzzy_text?: string) =>
      rule_template
        .getProjectRuleTemplateV1({
          rule_template_name: ruleTemplate ?? '',
          project_name: project ?? '',
          fuzzy_rule_keyword: filter_fuzzy_text ?? ''
        })
        .then((res) => {
          setDbType(res.data.data?.db_type ?? '');
          return res.data?.data?.rule_list ?? [];
        }),
    {
      manual: true
    }
  );

  const {
    data: globalTemplateRules,
    loading: getGlobalTemplateRulesLoading,
    run: getGlobalTemplateRules
  } = useRequest(
    (ruleTemplate?: string, filter_fuzzy_text?: string) => {
      return rule_template
        .getRuleTemplateV1({
          rule_template_name: ruleTemplate ?? '',
          fuzzy_rule_keyword: filter_fuzzy_text ?? ''
        })
        .then((res) => {
          setDbType(res.data.data?.db_type ?? '');
          return res.data?.data?.rule_list ?? [];
        });
    },
    {
      manual: true
    }
  );

  const {
    ruleFilterContainerCustomProps,
    getDriverNameListLoading,
    dbType,
    setDbType,
    projectName,
    ruleTemplateName,
    filterFuzzyCont
  } = useRuleFilterForm(getProjectTemplateRules, getGlobalTemplateRules);

  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () => {
      return rule_template
        .getRuleListV1({
          filter_db_type: dbType,
          fuzzy_rule_keyword: filterFuzzyCont
        })
        .then((res) => res.data?.data ?? []);
    },
    {
      ready: !!dbType,
      refreshDeps: [dbType, filterFuzzyCont]
    }
  );

  const apiLoading = useMemo(() => {
    return projectName
      ? getProjectTemplateRulesLoading ||
          getAllRulesLoading ||
          getDriverNameListLoading
      : getGlobalTemplateRulesLoading ||
          getAllRulesLoading ||
          getDriverNameListLoading;
  }, [
    getAllRulesLoading,
    getDriverNameListLoading,
    getGlobalTemplateRulesLoading,
    getProjectTemplateRulesLoading,
    projectName
  ]);

  return (
    <>
      <PageHeader title={t('rule.pageTitle')} />
      <Spin spinning={apiLoading}>
        <RuleStatusWrapperStyleWrapper className="flex-space-between flex-align-center">
          <TableFilterContainer
            updateTableFilterInfo={updateTableFilterInfo}
            filterContainerMeta={filterContainerMeta}
            filterCustomProps={ruleFilterContainerCustomProps}
            style={{ borderBottom: 0 }}
          />
          {ruleTemplateName && (
            <RuleStatus
              currentRuleStatus={ruleStatus}
              ruleStatusChange={setRuleStatus}
            />
          )}
        </RuleStatusWrapperStyleWrapper>

        {dbType && (
          <RuleTypes
            ruleTypeChange={setRuleType}
            currentRuleType={ruleType}
            allRulesData={allRules ?? []}
            rules={getCurrentStatusRules(
              allRules,
              projectName ? projectTemplateRules : globalTemplateRules,
              ruleTemplateName
            )}
          />
        )}

        <RuleList
          enableCheckDetail
          pageHeaderHeight={110}
          rules={getCurrentTypeRules(
            allRules,
            projectName ? projectTemplateRules : globalTemplateRules,
            ruleTemplateName
          )}
        />
      </Spin>
    </>
  );
};

export default Rule;
