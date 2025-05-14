import { useState, useMemo, useCallback } from 'react';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import { FormInstance, Form } from 'antd';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { useRuleFilterForm } from '../../../components/RuleList';
import { RuleListFilterForm } from '../index.type';

const useRuleListFilter = (form: FormInstance<RuleListFilterForm>) => {
  const [showNotRuleTemplatePage, setShowNorRuleTemplatePage] =
    useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);

  const { bindProjects } = useCurrentUser();

  const [fuzzyKeyword, setFuzzyKeyword] = useState<string>();
  const projectName = Form.useWatch('project_name', form);
  const filterRuleTemplate = Form.useWatch('filter_rule_template', form);
  const filterDbType = Form.useWatch('filter_db_type', form);
  const filterRuleVersion = Form.useWatch('filter_rule_version', form);

  const { tags } = useRuleFilterForm(form);

  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () => {
      return rule_template
        .getRuleListV1({
          filter_db_type: filterDbType,
          fuzzy_keyword_rule: fuzzyKeyword,
          filter_rule_version: filterRuleVersion,
          tags
        })
        .then((res) => res.data?.data ?? []);
    },
    {
      ready: !!filterDbType,
      refreshDeps: [filterDbType, fuzzyKeyword, filterRuleVersion, tags]
    }
  );

  const { data: templateRules, loading: getTemplateRulesLoading } = useRequest(
    () =>
      (projectName
        ? rule_template.getProjectRuleTemplateV1({
            rule_template_name: filterRuleTemplate ?? '',
            project_name: projectName,
            fuzzy_keyword_rule: fuzzyKeyword,
            tags
          })
        : rule_template.getRuleTemplateV1({
            rule_template_name: filterRuleTemplate ?? '',
            fuzzy_keyword_rule: fuzzyKeyword,
            tags
          })
      ).then((res) => {
        if (ResponseCode.SUCCESS === res.data.code) {
          form.setFieldValue('filter_db_type', res.data.data?.db_type);
          form.setFieldValue(
            'filter_rule_version',
            res.data.data?.rule_version
          );
          return res.data?.data?.rule_list ?? [];
        }
      }),
    {
      ready: !!filterRuleTemplate,
      refreshDeps: [filterRuleTemplate, fuzzyKeyword, tags]
    }
  );

  const projectID = useMemo(() => {
    return bindProjects.find((v) => v.project_name === projectName)?.project_id;
  }, [bindProjects, projectName]);

  const onFuzzyKeywordChange = (value: string | undefined) => {
    setFuzzyKeyword(value);
  };

  const toggleFilterVisible = useCallback(() => {
    setVisible(!visible);
    if (visible) {
      form.resetFields([
        'project_name',
        'filter_rule_template',
        'operand',
        'audit_purpose',
        'audit_accuracy',
        'sql',
        'performance_cost'
      ]);
    }
  }, [form, visible]);

  return {
    loading: getAllRulesLoading || getTemplateRulesLoading,
    showNotRuleTemplatePage,
    setShowNorRuleTemplatePage,
    allRules,
    filterRuleTemplate,
    templateRules,
    bindProjects,
    projectID,
    visible,
    toggleFilterVisible,
    onFuzzyKeywordChange
  };
};

export default useRuleListFilter;
