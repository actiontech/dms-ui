import { Form, Typography, Space } from 'antd';
import { RuleDetailItemStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';
import { EmptyBox, parse2ReactRouterPath } from '@actiontech/shared';
import { RuleItemTagStyleWrapper } from '../style';
import {
  RuleCategoryDictionaryGroup,
  RuleCategoryDictionary
} from '../../../hooks/useRuleCategories/index.data';
import { isEmpty } from 'lodash';
import { usePermission } from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export type typeRuleBaseInfo = {
  dataSource: IRuleResV1 | undefined;
  children?: ReactNode;
  showKnowledge?: boolean;
};

const RuleBaseInfo: React.FC<typeRuleBaseInfo> = ({
  dataSource,
  children,
  showKnowledge
}) => {
  const { t } = useTranslation();

  const { moduleFeatureSupport } = usePermission();

  const renderRuleCategory = (categories: IRuleResV1['categories']) => {
    if (!categories || isEmpty(categories)) {
      return;
    }
    return Object.keys(categories)?.map((category, index) => {
      return (
        <RuleItemTagStyleWrapper
          className={`rule-category-${category} rule-detail-category`}
          key={index}
          wrap
        >
          <span>{RuleCategoryDictionary[category]}:</span>
          <Space wrap>
            {categories[category].map((item, idx) => {
              return (
                <span key={idx}>
                  {RuleCategoryDictionaryGroup[category][item]}
                </span>
              );
            })}
          </Space>
        </RuleItemTagStyleWrapper>
      );
    });
  };

  return (
    <>
      <Form.Item label={t('ruleTemplate.editModal.rule')} name="desc">
        <RuleDetailItemStyleWrapper>
          <Space direction="vertical">
            <div>{dataSource?.desc}</div>
            <section>
              <EmptyBox
                if={
                  dataSource?.has_audit_power &&
                  moduleFeatureSupport.sqlOptimization
                }
              >
                <RuleItemTagStyleWrapper className="rule-audit-tag">
                  {t('ruleTemplate.detail.auditCapability')}
                </RuleItemTagStyleWrapper>
              </EmptyBox>
              <EmptyBox
                if={
                  dataSource?.has_rewrite_power &&
                  moduleFeatureSupport.sqlOptimization
                }
              >
                <RuleItemTagStyleWrapper className="rule-rewrite-tag">
                  {t('ruleTemplate.detail.rewriteCapability')}
                </RuleItemTagStyleWrapper>
              </EmptyBox>
            </section>
          </Space>
        </RuleDetailItemStyleWrapper>
      </Form.Item>
      <Form.Item
        label={t('ruleTemplate.editModal.annotation')}
        name="annotation"
      >
        <RuleDetailItemStyleWrapper>
          {dataSource?.annotation}
        </RuleDetailItemStyleWrapper>
      </Form.Item>
      {/* #if [ee] */}
      <EmptyBox if={showKnowledge}>
        <Form.Item label={t('rule.ruleDetail.knowledge')} name="knowledge">
          <RuleDetailItemStyleWrapper>
            <Typography.Link
              href={parse2ReactRouterPath(
                ROUTE_PATHS.SQLE.RULE_KNOWLEDGE.index,
                {
                  params: {
                    ruleName: dataSource?.rule_name ?? '',
                    dbType: dataSource?.db_type ?? ''
                  }
                }
              )}
              target="_blank"
            >
              {t('common.showMore')}
            </Typography.Link>
          </RuleDetailItemStyleWrapper>
        </Form.Item>
      </EmptyBox>
      {/* #endif */}
      <Form.Item label={t('ruleTemplate.editModal.ruleTypeLabel')} name="type">
        <Space direction="vertical">
          {renderRuleCategory(dataSource?.categories)}
        </Space>
      </Form.Item>
      <Form.Item label={t('ruleTemplate.editModal.ruleDbType')} name="db_type">
        <RuleDetailItemStyleWrapper>
          {dataSource?.db_type}
        </RuleDetailItemStyleWrapper>
      </Form.Item>
      {children}
    </>
  );
};

export default RuleBaseInfo;
