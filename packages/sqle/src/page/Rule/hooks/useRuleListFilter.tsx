import { RuleListFilterForm } from '../index.type';
import { useState, useMemo, useEffect } from 'react';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import { FormInstance, Form } from 'antd';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { useRuleFilterForm } from '../../../components/RuleList';
import useRuleVersionTips from '../../../hooks/useRuleVersionTips';

const useRuleListFilter = (form: FormInstance<RuleListFilterForm>) => {
  const [showNotRuleTemplatePage, setShowNorRuleTemplatePage] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const { bindProjects } = useCurrentUser();

  const fuzzyKeyword = Form.useWatch('fuzzy_keyword', form);
  const projectName = Form.useWatch('project_name', form);
  const filterRuleTemplate = Form.useWatch('filter_rule_template', form);
  const filterDbType = Form.useWatch('filter_db_type', form);
  const filterRuleVersion = Form.useWatch('filter_rule_version', form);

  const { tags } = useRuleFilterForm<RuleListFilterForm>(form);

  const {
    transformBackendRuleVersion2FormValues,
    transformRuleVersion2BackendParams
  } = useRuleVersionTips();

  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () => {
      return rule_template
        .getRuleListV1({
          filter_db_type: filterDbType,
          fuzzy_keyword_rule: fuzzyKeyword,
          filter_rule_version:
            transformRuleVersion2BackendParams(filterRuleVersion),
          tags
        })
        .then((res) => res.data?.data ?? []);
    },
    {
      ready: !!filterDbType,
      refreshDeps: [filterDbType, fuzzyKeyword, tags, filterRuleVersion]
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
            transformBackendRuleVersion2FormValues(
              res.data.data?.db_type!,
              res.data.data?.rule_version
            )
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

  useEffect(() => {
    setLoading(getAllRulesLoading || getTemplateRulesLoading);
  }, [getAllRulesLoading, getTemplateRulesLoading]);

  return {
    showNotRuleTemplatePage,
    setShowNorRuleTemplatePage,
    allRules,
    getAllRulesLoading,
    filterRuleTemplate,
    projectName,
    templateRules,
    getTemplateRulesLoading,
    bindProjects,
    projectID,
    loading,
    setLoading,
    filterDbType,
    tags
  };
};

export default useRuleListFilter;
