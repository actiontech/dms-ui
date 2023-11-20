import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { GetRuleListV1Params } from '../index.data';
import {
  FilterCustomProps,
  TableFilterContainerProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import useRuleFilterFormItem from './useRuleFilterFormItem';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';

const useRuleFilterForm = () => {
  const { t } = useTranslation();
  const {
    updateDriverListSync,
    dbDriverOptions,
    loading: getDbTypeLoading
  } = useDbServiceDriver();
  const {
    data: templateRules,
    loading: getTemplateRulesLoading,
    run: getTemplateRules
  } = useRequest(
    (
      projectName?: string,
      ruleTemplateName?: string,
      filterFuzzyCont?: string
    ) =>
      (projectName
        ? rule_template.getProjectRuleTemplateV1({
            rule_template_name: ruleTemplateName ?? '',
            project_name: projectName,
            fuzzy_keyword: filterFuzzyCont
          })
        : rule_template.getRuleTemplateV1({
            rule_template_name: ruleTemplateName ?? '',
            fuzzy_keyword: filterFuzzyCont
          })
      ).then((res) => {
        if (ResponseCode.SUCCESS === res.data.code) {
          setFilterDbType(res.data.data?.db_type);
          return res.data?.data?.rule_list ?? [];
        }
      }),
    {
      manual: true
    }
  );

  const {
    showNotRuleTemplatePage,
    filterRuleTemplate,
    changeRuleTemplateNameHandle,
    getRuleTemplateLoading,
    getGlobalRuleTemplateLoading,
    ruleTemplateOptions,
    filterFuzzyCont,
    pressEnterFuzzyContHandle,
    projectID,
    projectOptions,
    filterProjectName,
    changeProjectNameHandle,
    filterDbType,
    setFilterDbType
  } = useRuleFilterFormItem(getTemplateRules);

  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () => {
      return rule_template
        .getRuleListV1({
          filter_db_type: filterDbType,
          fuzzy_keyword: filterFuzzyCont
        })
        .then((res) => res.data?.data ?? []);
    },
    {
      ready: !!filterDbType,
      refreshDeps: [filterDbType, filterFuzzyCont]
    }
  );

  useEffect(() => {
    updateDriverListSync().then((res) => {
      setFilterDbType(res.data.data?.[0]?.db_type);
    });
  }, [setFilterDbType, updateDriverListSync]);

  const loading = useMemo(
    () => getDbTypeLoading || getTemplateRulesLoading || getAllRulesLoading,
    [getAllRulesLoading, getDbTypeLoading, getTemplateRulesLoading]
  );

  const ruleFilterContainerCustomProps: TableFilterContainerProps<
    GetRuleListV1Params,
    GetRuleListV1Params
  >['filterCustomProps'] = useMemo(() => {
    const filterItemWidth = 280;
    return new Map<keyof GetRuleListV1Params, FilterCustomProps>([
      [
        'filter_fuzzy_text',
        {
          value: filterFuzzyCont,
          onCustomPressEnter: pressEnterFuzzyContHandle,
          style: { width: 300 },
          allowClear: true,
          placeholder: t('rule.form.fuzzy_text_placeholder')
        }
      ],
      [
        'project_name',
        {
          value: filterProjectName,
          onChange: changeProjectNameHandle,
          options: projectOptions,
          style: { width: filterItemWidth }
        }
      ],
      [
        'filter_rule_template',
        {
          value: filterRuleTemplate,
          onChange: changeRuleTemplateNameHandle,
          options: ruleTemplateOptions,
          loading: getRuleTemplateLoading || getGlobalRuleTemplateLoading,
          style: { width: filterItemWidth }
        }
      ],
      [
        'filter_db_type',
        {
          value: filterDbType,
          onChange: setFilterDbType,
          options: dbDriverOptions,
          loading: getDbTypeLoading,
          allowClear: false,
          disabled: !!filterRuleTemplate,
          style: { width: filterItemWidth }
        }
      ]
    ]);
  }, [
    filterFuzzyCont,
    pressEnterFuzzyContHandle,
    t,
    filterProjectName,
    changeProjectNameHandle,
    projectOptions,
    filterRuleTemplate,
    changeRuleTemplateNameHandle,
    ruleTemplateOptions,
    getRuleTemplateLoading,
    getGlobalRuleTemplateLoading,
    filterDbType,
    setFilterDbType,
    dbDriverOptions,
    getDbTypeLoading
  ]);

  return {
    filterDbType,
    filterRuleTemplate,
    templateRules,
    getTemplateRules,
    loading,
    showNotRuleTemplatePage,
    ruleFilterContainerCustomProps,
    projectID,
    allRules,
    filterProjectName
  };
};

export default useRuleFilterForm;
