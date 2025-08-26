import { Form, Space } from 'antd';
import { CustomSelect } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { useMemo, useEffect, useCallback } from 'react';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import CustomSelectField from './CustomSelectField';
import useRuleVersionTips from '../../../hooks/useRuleVersionTips';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { RuleListFilterProps } from '../index.type';
import { RuleListFilterStyleWrapper } from './style';
import { RuleFilterCommonFields } from '../../../components/RuleList';

const RuleListFilter: React.FC<RuleListFilterProps> = ({
  form,
  visible,
  bindProjects,
  setShowNorRuleTemplatePage
}) => {
  const { t } = useTranslation();
  const extractQueries = useTypedQuery();

  const projectName = Form.useWatch('project_name', form);
  const filterRuleTemplate = Form.useWatch('filter_rule_template', form);
  const filterDbType = Form.useWatch('filter_db_type', form);

  const {
    updateDriverListAsync,
    dbDriverOptions,
    loading: getDbTypeLoading
  } = useDbServiceDriver();

  const {
    generateRuleVersionOptions,
    updateRuleVersionTipsAsync,
    loading: getRuleVersionLoading,
    ruleVersionTips
  } = useRuleVersionTips();

  const {
    loading: getRuleTemplateLoading,
    updateRuleTemplateListSync,
    ruleTemplateTipsOptions
  } = useRuleTemplate();

  const {
    loading: getGlobalRuleTemplateLoading,
    updateGlobalRuleTemplateList,
    globalRuleTemplateTipsOptions
  } = useGlobalRuleTemplate();

  const projectOptions = useMemo(() => {
    return bindProjects.map((v) => ({
      label: v.project_name,
      value: v.project_name
    }));
  }, [bindProjects]);

  const ruleTemplateOptions = useMemo(() => {
    const options = projectName
      ? ruleTemplateTipsOptions(filterDbType)
      : globalRuleTemplateTipsOptions(filterDbType);
    const groupLabel = projectName
      ? t('rule.projectRuleTemplate')
      : t('rule.globalRuleTemplate');
    return options.length > 0
      ? [
          {
            label: groupLabel,
            options: options
          }
        ]
      : [];
  }, [
    projectName,
    ruleTemplateTipsOptions,
    filterDbType,
    globalRuleTemplateTipsOptions,
    t
  ]);

  const onProjectAfterChange = useCallback(
    (name?: string) => {
      if (!name) {
        form.setFieldValue('filter_rule_template', undefined);
        setShowNorRuleTemplatePage(false);
      } else {
        updateRuleTemplateListSync(name).then((res) => {
          const ruleTemplateListByProjectName = res ?? [];
          if (ruleTemplateListByProjectName.length > 0) {
            form.setFieldValue(
              'filter_rule_template',
              ruleTemplateListByProjectName[0]?.rule_template_name
            );
            form.setFieldValue(
              'filter_db_type',
              ruleTemplateListByProjectName[0]?.db_type
            );
            setShowNorRuleTemplatePage(false);
          } else {
            form.setFieldValue('filter_rule_template', undefined);
            setShowNorRuleTemplatePage(true);
          }
        });
      }
    },
    [form, setShowNorRuleTemplatePage, updateRuleTemplateListSync]
  );

  const onTemplateAfterChange = (templateName: string) => {
    if (!templateName) {
      form.setFieldValue('project_name', undefined);
      form.setFieldValue(
        'filter_rule_version',
        ruleVersionTips?.find((v) => v.db_type === filterDbType)
          ?.rule_versions?.[0]
      );
    }
  };

  const onDbTypeChange = (dbType: string) => {
    form.setFieldValue(
      'filter_rule_version',
      ruleVersionTips?.find((v) => v.db_type === dbType)?.rule_versions?.[0]
    );
  };

  useEffect(() => {
    Promise.all([updateRuleVersionTipsAsync(), updateDriverListAsync()]).then(
      ([ruleVersionRes, dbTypeRes]) => {
        const defaultDbType = dbTypeRes.data.data?.[0]?.db_type;
        if (defaultDbType) {
          form.setFieldValue('filter_db_type', defaultDbType);
          form.setFieldValue(
            'filter_rule_version',
            ruleVersionRes.data.data?.find((v) => v.db_type === defaultDbType)
              ?.rule_versions?.[0]
          );
        }
      }
    );
    updateGlobalRuleTemplateList();

    const searchParams = extractQueries(ROUTE_PATHS.SQLE.RULE.index);

    const projectNameInUrl = bindProjects.find(
      (v) => v.project_id === searchParams?.projectID
    )?.project_name;
    form.setFieldValue('project_name', projectNameInUrl);
    onProjectAfterChange(projectNameInUrl);
  }, [
    bindProjects,
    extractQueries,
    form,
    onProjectAfterChange,
    updateDriverListAsync,
    updateGlobalRuleTemplateList,
    updateRuleVersionTipsAsync
  ]);

  return (
    <RuleListFilterStyleWrapper
      hidden={!visible}
      className="full-width-element rule-list-filter-wrapper"
    >
      <Form form={form}>
        <Space size={[12, 8]} wrap>
          <Form.Item noStyle name="filter_db_type">
            <CustomSelect
              prefix={t('rule.form.dbType')}
              suffixIcon={null}
              bordered={false}
              allowClear={false}
              disabled={!!filterRuleTemplate}
              loading={getDbTypeLoading}
              options={dbDriverOptions}
              onChange={onDbTypeChange}
              placeholder={t('rule.filter.pleaseSelect')}
            />
          </Form.Item>
          <Form.Item noStyle name="filter_rule_version">
            <CustomSelect
              prefix={t('rule.form.ruleVersion')}
              suffixIcon={null}
              bordered={false}
              allowClear={false}
              disabled={!!filterRuleTemplate}
              loading={getRuleVersionLoading}
              options={generateRuleVersionOptions(filterDbType)}
              placeholder={t('rule.filter.pleaseSelect')}
            />
          </Form.Item>
          <Form.Item noStyle name="project_name">
            <CustomSelectField
              prefix={t('rule.form.project')}
              suffixIcon={null}
              bordered={false}
              allowClear
              options={projectOptions}
              onAfterChange={onProjectAfterChange}
              placeholder={t('rule.filter.pleaseSelect')}
            />
          </Form.Item>
          <Form.Item noStyle name="filter_rule_template">
            <CustomSelectField
              prefix={t('rule.form.ruleTemplate')}
              suffixIcon={null}
              bordered={false}
              allowClear
              options={ruleTemplateOptions}
              loading={getRuleTemplateLoading || getGlobalRuleTemplateLoading}
              onAfterChange={onTemplateAfterChange}
              placeholder={t('rule.filter.pleaseSelect')}
            />
          </Form.Item>
          <RuleFilterCommonFields withoutFuzzyKeywordFilterItem />
        </Space>
      </Form>
    </RuleListFilterStyleWrapper>
  );
};

export default RuleListFilter;
