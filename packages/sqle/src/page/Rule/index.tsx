import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@actiontech/shared';
import { RuleStatus, RuleList, RuleTypes } from '../../components/RuleList';
import useRuleFilterForm from './useRuleFilterForm';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import {
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { GetRuleListV1Params, RuleFilterContainerMeta } from './index.data';
import { Spin } from 'antd5';
import useRuleList from '../../components/RuleList/useRuleList';
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
    (project?: string, ruleTemplate?: string) =>
      rule_template
        .getProjectRuleTemplateV1({
          rule_template_name: ruleTemplate ?? '',
          project_name: project ?? ''
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
    (ruleTemplate?: string) =>
      rule_template
        .getRuleTemplateV1({
          rule_template_name: ruleTemplate ?? ''
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
    ruleFilterContainerCustomProps,
    dbType,
    setDbType,
    projectName,
    ruleTemplateName
  } = useRuleFilterForm(getProjectTemplateRules, getGlobalTemplateRules);

  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () =>
      rule_template
        .getRuleListV1({
          filter_db_type: dbType
        })
        .then((res) => res.data?.data ?? []),
    {
      ready: !!dbType,
      refreshDeps: [dbType]
    }
  );

  return (
    <>
      <PageHeader title={t('rule.pageTitle')} />
      <Spin
        spinning={
          getAllRulesLoading ||
          getGlobalTemplateRulesLoading ||
          getProjectTemplateRulesLoading
        }
      >
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
