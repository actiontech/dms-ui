import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { useBack } from '@actiontech/shared/lib/hooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { Spin } from 'antd';
import {
  PageHeader,
  BasicButton,
  BasicResult,
  EmptyBox,
  useTypedParams
} from '@actiontech/shared';
import { RuleStatus, RuleTypes, RuleList } from '../RuleList';
import useRuleList from '../RuleList/useRuleList';
import {
  DetailComStyleWrapper,
  HeaderSpaceTagStyleWrapper,
  RuleTemplateDetailStyleWrapper
} from './style';
// import { FilterContainerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';
// import CustomSearchInput from './components/CustomSearchInput';
import {
  FlagFilled,
  DoubleDatabaseOutlined,
  LeftArrowOutlined
} from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { RuleFilter, useRuleFilterForm } from '../RuleList';

const RuleDetail = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const { goBack } = useBack();

  const { form, fuzzyKeyword, tags } = useRuleFilterForm();
  // const [fuzzyKeyword, setFuzzyKeyword] = useState<string>();

  const { templateName, dbType } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.RULE_TEMPLATE.detail>();
  const { projectName } = useCurrentProject();
  const {
    ruleStatus,
    // ruleType,
    setRuleStatus,
    // setRuleType,
    // getCurrentStatusRules,
    getCurrentTypeRules
  } = useRuleList();

  const {
    data: projectRuleData,
    loading: projectRuleLoading,
    // run: getProjectTemplateRules,
    error: projectRuleError
  } = useRequest(
    () =>
      rule_template
        .getProjectRuleTemplateV1({
          rule_template_name: templateName ?? '',
          project_name: projectName ?? '',
          fuzzy_keyword_rule: fuzzyKeyword,
          tags
        })
        .then((res) => {
          return res.data?.data?.rule_list ?? [];
        }),
    {
      // manual: true
      ready: !!templateName && !!projectName,
      refreshDeps: [projectName, templateName, fuzzyKeyword, tags]
    }
  );

  const {
    data: globalTemplateRules,
    loading: getGlobalTemplateRulesLoading,
    // run: getGlobalTemplateRules,
    error: globalError
  } = useRequest(
    () =>
      rule_template
        .getRuleTemplateV1({
          rule_template_name: templateName ?? '',
          fuzzy_keyword_rule: fuzzyKeyword,
          tags
        })
        .then((res) => {
          return res.data?.data?.rule_list ?? [];
        }),
    {
      // manual: true,
      ready: !!templateName && !projectName,
      refreshDeps: [templateName, fuzzyKeyword, tags]
    }
  );

  const {
    data: allRules,
    loading: getAllRulesLoading,
    error: allRulesError
  } = useRequest(
    () =>
      rule_template
        .getRuleListV1({
          filter_db_type: dbType,
          fuzzy_keyword_rule: fuzzyKeyword,
          tags
        })
        .then((res) => res.data?.data ?? []),
    {
      ready: !!dbType,
      refreshDeps: [dbType, fuzzyKeyword, tags]
    }
  );

  const errorStatus = useMemo(() => {
    if (projectName) {
      return !(allRulesError || projectRuleError);
    }
    return !(allRulesError || globalError);
  }, [allRulesError, projectRuleError, globalError, projectName]);

  const apiLoading = useMemo(() => {
    if (projectName) {
      return projectRuleLoading || getAllRulesLoading;
    }
    return getGlobalTemplateRulesLoading || getAllRulesLoading;
  }, [
    projectRuleLoading,
    getGlobalTemplateRulesLoading,
    getAllRulesLoading,
    projectName
  ]);

  const ruleData = useMemo(() => {
    if (projectName) {
      return projectRuleData;
    }
    return globalTemplateRules;
  }, [projectRuleData, globalTemplateRules, projectName]);

  // useEffect(() => {
  //   projectName
  //     ? getProjectTemplateRules(projectName, templateName)
  //     : getGlobalTemplateRules(templateName);
  // }, [
  //   getProjectTemplateRules,
  //   getGlobalTemplateRules,
  //   projectName,
  //   templateName,
  //   fuzzyKeyword
  // ]);

  return (
    <RuleTemplateDetailStyleWrapper>
      <PageHeader
        title={
          <BasicButton icon={<LeftArrowOutlined />} onClick={() => goBack()}>
            {t('ruleTemplate.backToList')}
          </BasicButton>
        }
      />
      <Spin spinning={apiLoading}>
        <EmptyBox
          if={errorStatus}
          defaultNode={
            <BasicResult
              status="error"
              title={t('ruleTemplate.detail.error')}
            />
          }
        >
          <DetailComStyleWrapper>
            <section className="header-wrapper">
              <section className="header">
                <h3 className="header-cont-text">{templateName}</h3>
              </section>
              <section className="flex-space-between">
                <section className="tag-wrapper">
                  <div className="custom-tag-item" hidden={!projectName}>
                    <HeaderSpaceTagStyleWrapper
                      size={6}
                      className="project-name-space"
                    >
                      <FlagFilled className="tag-icon" />
                      <div>
                        {t('ruleTemplate.detail.project')}：{projectName || '-'}
                      </div>
                    </HeaderSpaceTagStyleWrapper>
                  </div>
                  <div className="custom-tag-item">
                    <HeaderSpaceTagStyleWrapper
                      size={6}
                      className="database-type-space"
                    >
                      <DoubleDatabaseOutlined
                        className="tag-icon"
                        fill={sqleTheme.icon.execWorkFlow.schemaFilled}
                      />
                      <div>
                        {t('ruleTemplate.detail.dbType')}：{dbType || '-'}
                      </div>
                    </HeaderSpaceTagStyleWrapper>
                  </div>
                </section>
                <RuleStatus
                  currentRuleStatus={ruleStatus}
                  ruleStatusChange={setRuleStatus}
                />
              </section>
            </section>
          </DetailComStyleWrapper>
          {/* <FilterContainerStyleWrapper className="full-width-element">
            <CustomSearchInput
              onCustomPressEnter={setFuzzyKeyword}
              placeholder={t('rule.form.fuzzy_text_placeholder')}
              allowClear
            />
          </FilterContainerStyleWrapper> */}
          <RuleFilter form={form} />
          {/* {dbType && (
            <RuleTypes
              ruleTypeChange={setRuleType}
              currentRuleType={ruleType}
              rules={getCurrentStatusRules(allRules, ruleData, templateName)}
              allRulesData={allRules ?? []}
            />
          )} */}
          <RuleList
            pageHeaderHeight={122}
            rules={getCurrentTypeRules(allRules, ruleData, templateName)}
            enableCheckDetail
          />
        </EmptyBox>
      </Spin>
    </RuleTemplateDetailStyleWrapper>
  );
};

export default RuleDetail;
