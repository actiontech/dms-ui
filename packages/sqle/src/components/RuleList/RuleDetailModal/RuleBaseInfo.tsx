import { Form, Typography, Space } from 'antd';
import { RuleDetailItemStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';
import { EmptyBox } from '@actiontech/shared';
import { RuleItemTagStyleWrapper } from '../style';
import usePermission from '@actiontech/shared/lib/global/usePermission/usePermission';

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
              href={`/sqle/rule/knowledge/${dataSource?.rule_name}/${dataSource?.db_type}`}
              target="_blank"
            >
              {t('common.showMore')}
            </Typography.Link>
          </RuleDetailItemStyleWrapper>
        </Form.Item>
      </EmptyBox>
      {/* #endif */}
      <Form.Item label={t('ruleTemplate.editModal.ruleTypeLabel')} name="type">
        <RuleDetailItemStyleWrapper>
          {dataSource?.type}
        </RuleDetailItemStyleWrapper>
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
