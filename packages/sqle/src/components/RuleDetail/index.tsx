import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { useBack } from '@actiontech/shared/lib/hooks';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';

import { Spin } from 'antd5';
import {
  PageHeader,
  BasicButton,
  BasicResult,
  EmptyBox
} from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import Icon from '@ant-design/icons/lib/components/Icon';
import { IconError } from '@actiontech/shared/lib/Icon';
import { DetailComStyleWrapper } from '../../page/AuditPlan/PlanDetail/DetailCom/style';
import { IconProjectFlag, IconDatabaseType } from '../../icon/Rule';
import { RuleStatus, RuleTypes, RuleList } from '../RuleList';
import useRuleList from '../RuleList/useRuleList';
import {
  HeaderSpaceTagStyleWrapper,
  RuleTemplateDetailStyleWrapper
} from './style';

export type IRuleTemplateDetail = {
  //
};

const RuleDetail = (props: IRuleTemplateDetail) => {
  const { t } = useTranslation();
  const { goBack } = useBack();

  const { templateName, dbType } = useParams<{
    templateName: string;
    dbType: string;
  }>();
  const { projectName } = useCurrentProject();
  const {
    ruleStatus,
    ruleType,
    setRuleStatus,
    setRuleType,
    getCurrentStatusRules,
    getCurrentTypeRules
  } = useRuleList();

  const {
    data: projectRuleData,
    loading: projectRuleLoading,
    run: getProjectTemplateRules,
    error: projectRuleError
  } = useRequest(
    (project?: string, ruleTemplate?: string) =>
      rule_template
        .getProjectRuleTemplateV1({
          rule_template_name: ruleTemplate ?? '',
          project_name: project ?? ''
        })
        .then((res) => {
          return res.data?.data?.rule_list ?? [];
        }),
    {
      manual: true
    }
  );

  const {
    data: globalTemplateRules,
    loading: getGlobalTemplateRulesLoading,
    run: getGlobalTemplateRules,
    error: globalError
  } = useRequest(
    (ruleTemplate?: string) =>
      rule_template
        .getRuleTemplateV1({
          rule_template_name: ruleTemplate ?? ''
        })
        .then((res) => {
          return res.data?.data?.rule_list ?? [];
        }),
    {
      manual: true
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
          filter_db_type: dbType
        })
        .then((res) => res.data?.data ?? []),
    {
      ready: !!dbType,
      refreshDeps: [dbType]
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

  useEffect(() => {
    projectName
      ? getProjectTemplateRules(projectName, templateName)
      : getGlobalTemplateRules(templateName);
  }, [
    getProjectTemplateRules,
    getGlobalTemplateRules,
    projectName,
    templateName
  ]);

  return (
    <RuleTemplateDetailStyleWrapper>
      <PageHeader
        title={
          <BasicButton icon={<IconLeftArrow />} onClick={() => goBack()}>
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
              icon={<Icon component={IconError} />}
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
                      <IconProjectFlag className="tag-icon" />
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
                      <IconDatabaseType className="tag-icon" />
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
          {dbType && (
            <RuleTypes
              ruleTypeChange={setRuleType}
              currentRuleType={ruleType}
              rules={getCurrentStatusRules(allRules, ruleData, templateName)}
              allRulesData={allRules ?? []}
            />
          )}
          <RuleList
            pageHeaderHeight={130}
            rules={getCurrentTypeRules(allRules, ruleData, templateName)}
          />
        </EmptyBox>
      </Spin>
    </RuleTemplateDetailStyleWrapper>
  );
};

export default RuleDetail;
