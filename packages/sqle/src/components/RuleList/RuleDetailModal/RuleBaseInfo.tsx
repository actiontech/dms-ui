import { Form } from 'antd5';
import {
  RuleDetailItemStyleWrapper,
  RuleDetailKnowledgeLinkStyleWrapper
} from './style';
import { useTranslation } from 'react-i18next';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';
import { EmptyBox } from '@actiontech/shared';

const RuleBaseInfo: React.FC<{
  dataSource: IRuleResV1 | undefined;
  children?: ReactNode;
  showKnowledge?: boolean;
}> = ({ dataSource, children, showKnowledge }) => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item label={t('ruleTemplate.editModal.rule')} name="desc">
        <RuleDetailItemStyleWrapper>
          {dataSource?.desc}
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
      <EmptyBox if={showKnowledge}>
        <Form.Item label={t('rule.ruleDetail.knowledge')} name="knowledge">
          <RuleDetailItemStyleWrapper>
            <RuleDetailKnowledgeLinkStyleWrapper
              type="link"
              size="small"
              href={`/sqle/rule/knowledge/${dataSource?.rule_name}/${dataSource?.db_type}`}
              target="_blank"
            >
              {t('common.showMore')}
            </RuleDetailKnowledgeLinkStyleWrapper>
          </RuleDetailItemStyleWrapper>
        </Form.Item>
      </EmptyBox>
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
