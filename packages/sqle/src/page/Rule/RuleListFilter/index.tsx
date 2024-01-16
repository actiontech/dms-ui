import { Form, Space, FormInstance } from 'antd';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import CustomSearchInput from '../../../components/RuleDetail/components/CustomSearchInput';
import { useTranslation } from 'react-i18next';
import {
  RuleListFilterStyleWrapper,
  RuleListProjectFilterStyleWrapper
} from '../style';
import { useMemo, useEffect } from 'react';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import { RuleListFilterForm } from '../index.type';
import { useLocation } from 'react-router-dom';
import { IBindProject } from '../../../../../base/src/store/user';
import CustomSelectField from './CustomSelectFiled';
import { RuleUrlParamKey } from '@actiontech/shared/lib/types/common.type';

const RuleListFilter: React.FC<{
  form: FormInstance<RuleListFilterForm>;
  getTemplateRules: (
    projectName?: string | undefined,
    ruleTemplateName?: string | undefined,
    fuzzyKeyword?: string | undefined
  ) => void;
  setShowNorRuleTemplatePage: (v: boolean) => void;
  bindProjects: IBindProject[];
  getAllRules: () => void;
}> = ({
  setShowNorRuleTemplatePage,
  form,
  getTemplateRules,
  bindProjects,
  getAllRules
}) => {
  const { t } = useTranslation();

  const location = useLocation();

  const fuzzyKeyword = Form.useWatch('fuzzy_keyword', form);
  const projectName = Form.useWatch('project_name', form);
  const filterRuleTemplate = Form.useWatch('filter_rule_template', form);
  const filterDbType = Form.useWatch('filter_db_type', form);

  const projectOptions = useMemo(() => {
    return bindProjects.map((v) => ({
      label: (
        <RuleListProjectFilterStyleWrapper>
          <TableColumnWithIconStyleWrapper>
            <IconProjectFlag />
            <span> {v.project_name} </span>
          </TableColumnWithIconStyleWrapper>
        </RuleListProjectFilterStyleWrapper>
      ),
      value: v.project_name
    }));
  }, [bindProjects]);

  const {
    updateDriverListSync,
    dbDriverOptions,
    loading: getDbTypeLoading
  } = useDbServiceDriver();

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

  const onProjectAfterChange = (v?: string) => {
    if (!v) {
      form.setFieldValue('filter_rule_template', undefined);
      setShowNorRuleTemplatePage(false);
    } else {
      updateRuleTemplateListSync(v).then((res) => {
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
          getTemplateRules(
            v,
            ruleTemplateListByProjectName[0]?.rule_template_name,
            fuzzyKeyword
          );
        } else {
          form.setFieldValue('filter_rule_template', undefined);
          setShowNorRuleTemplatePage(true);
        }
      });
    }
  };

  const onTemplateAfterChange = (v: string) => {
    if (!v) {
      form.setFieldValue('project_name', undefined);
    } else {
      getTemplateRules(projectName, v, fuzzyKeyword);
    }
  };

  useEffect(() => {
    updateGlobalRuleTemplateList();

    updateDriverListSync().then((res) => {
      form.setFieldValue('filter_db_type', res.data.data?.[0]?.db_type);
    });

    const searchParams = new URLSearchParams(location.search);
    const projectNameInUrl = bindProjects.find(
      (v) => v.project_id === searchParams.get(RuleUrlParamKey.projectID)
    )?.project_name;
    form.setFieldValue('project_name', projectNameInUrl);
    onProjectAfterChange(projectNameInUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchInputPressEnter = (v: string) => {
    getAllRules();
    if (!filterRuleTemplate) {
      return;
    }
    getTemplateRules(projectName, filterRuleTemplate, v);
  };

  return (
    <RuleListFilterStyleWrapper className="full-width-element">
      <Form form={form}>
        <Space size={12}>
          <Form.Item noStyle name="fuzzy_keyword">
            <CustomSearchInput
              onCustomPressEnter={onSearchInputPressEnter}
              placeholder={t('rule.form.fuzzy_text_placeholder')}
              allowClear
            />
          </Form.Item>
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
            />
          </Form.Item>
        </Space>
      </Form>
    </RuleListFilterStyleWrapper>
  );
};

export default RuleListFilter;
