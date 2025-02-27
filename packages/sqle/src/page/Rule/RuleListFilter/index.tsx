import { Form, Space } from 'antd';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import { useTranslation } from 'react-i18next';
import {
  RuleListFilterStyleWrapper,
  RuleListProjectFilterStyleWrapper
} from '../style';
import { useMemo, useEffect } from 'react';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import { RuleListFilterProps } from '../index.type';
import CustomSelectField from './CustomSelectFiled';
import { FlagFilled } from '@actiontech/icons';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { RuleFilterCommonFields } from '../../../components/RuleList';
import useRuleVersionTips from '../../../hooks/useRuleVersionTips';

const RuleListFilter: React.FC<RuleListFilterProps> = ({
  setShowNorRuleTemplatePage,
  form,
  bindProjects
}) => {
  const { t } = useTranslation();
  const extractQueries = useTypedQuery();

  const projectName = Form.useWatch('project_name', form);
  const filterRuleTemplate = Form.useWatch('filter_rule_template', form);
  const filterDbType = Form.useWatch('filter_db_type', form);

  const projectOptions = useMemo(() => {
    return bindProjects.map((v) => ({
      label: (
        <RuleListProjectFilterStyleWrapper>
          <TableColumnWithIconStyleWrapper>
            <FlagFilled width={18} height={18} />
            <span> {v.project_name} </span>
          </TableColumnWithIconStyleWrapper>
        </RuleListProjectFilterStyleWrapper>
      ),
      value: v.project_name
    }));
  }, [bindProjects]);

  const {
    updateDriverListAsync,
    dbDriverOptions,
    loading: getDbTypeLoading
  } = useDbServiceDriver();

  const {
    generateRuleVersionOptions,
    updateRuleVersionTips,
    loading: getRuleVersionLoading
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

  const onProjectAfterChange = (name?: string) => {
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
  };

  const onTemplateAfterChange = (templateName: string) => {
    if (!templateName) {
      form.setFieldValue('project_name', undefined);
      form.setFieldValue('filter_rule_version', undefined);
    }
  };

  const onDbTypeChange = (dbType: string) => {
    form.setFieldValue('filter_rule_version', undefined);
  };

  useEffect(() => {
    updateGlobalRuleTemplateList();
    updateRuleVersionTips();
    updateDriverListAsync().then((res) => {
      form.setFieldValue('filter_db_type', res.data.data?.[0]?.db_type);
    });

    const searchParams = extractQueries(ROUTE_PATHS.SQLE.RULE.index);

    const projectNameInUrl = bindProjects.find(
      (v) => v.project_id === searchParams?.projectID
    )?.project_name;
    form.setFieldValue('project_name', projectNameInUrl);
    onProjectAfterChange(projectNameInUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RuleListFilterStyleWrapper className="full-width-element">
      <Form form={form}>
        <Space size={12} wrap>
          <RuleFilterCommonFields />
          <Form.Item noStyle name="project_name">
            <CustomSelectField
              prefix={t('rule.form.project')}
              suffixIcon={null}
              bordered={false}
              options={projectOptions}
              onAfterChange={onProjectAfterChange}
            />
          </Form.Item>
          <Form.Item noStyle name="filter_rule_template">
            <CustomSelectField
              prefix={t('rule.form.ruleTemplate')}
              suffixIcon={null}
              bordered={false}
              options={ruleTemplateOptions}
              loading={getRuleTemplateLoading || getGlobalRuleTemplateLoading}
              onAfterChange={onTemplateAfterChange}
            />
          </Form.Item>
          <Form.Item noStyle name="filter_db_type">
            <CustomSelect
              prefix={t('rule.form.dbType')}
              suffixIcon={null}
              bordered={false}
              options={dbDriverOptions}
              allowClear={false}
              disabled={!!filterRuleTemplate}
              loading={getDbTypeLoading}
              onChange={onDbTypeChange}
            />
          </Form.Item>

          <Form.Item noStyle name="filter_rule_version">
            <CustomSelect
              prefix={t('rule.form.ruleVersion')}
              suffixIcon={null}
              bordered={false}
              options={generateRuleVersionOptions(filterDbType)}
              allowClear={false}
              disabled={!!filterRuleTemplate}
              loading={getRuleVersionLoading}
            />
          </Form.Item>
        </Space>
      </Form>
    </RuleListFilterStyleWrapper>
  );
};

export default RuleListFilter;
