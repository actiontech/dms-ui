import { useEffect, useState } from 'react';
import { Card, Typography, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import RuleUnderstand from './RuleUnderstand';
import { EmptyBox, PageHeader, useTypedParams } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { RuleKnowledgeContentStyleWrapper } from './style';
import { DownTriangleOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const RuleKnowledge: React.FC = () => {
  const { t } = useTranslation();

  const { ruleName = '', dbType = '' } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.RULE_KNOWLEDGE.index>();

  const [isCustomRule, setIsCustomRule] = useState(false);

  const {
    data: ruleKnowledgeInfo,
    loading,
    refresh,
    run: getRuleKnowledge
  } = useRequest(
    (isCustomType: boolean, type: string) => {
      if (isCustomType) {
        return rule_template
          .getCustomRuleKnowledgeV1({ rule_name: ruleName, db_type: type })
          .then((res) => {
            return res.data.data;
          });
      }
      return rule_template
        .getRuleKnowledgeV1({ rule_name: ruleName, db_type: type })
        .then((res) => {
          return res.data.data;
        });
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    if (!!ruleName && !!dbType) {
      rule_template
        .getRuleListV1({
          filter_rule_names: ruleName,
          filter_db_type: dbType
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS && res.data.data?.length) {
            const ruleInfo = res.data.data.find(
              (i) => i.rule_name === ruleName && i.db_type === dbType
            );

            if (!!ruleInfo?.db_type) {
              setIsCustomRule(!!ruleInfo.is_custom_rule);
              getRuleKnowledge(!!ruleInfo.is_custom_rule, ruleInfo.db_type);
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader title={t('ruleKnowledge.pageTitle')} />
      <RuleKnowledgeContentStyleWrapper>
        <Card>
          <Spin spinning={loading}>
            <Typography.Title level={4}>
              {ruleKnowledgeInfo?.rule?.desc ?? '-'}
            </Typography.Title>
            <Typography.Text>
              {ruleKnowledgeInfo?.rule?.annotation ?? '-'}
            </Typography.Text>
          </Spin>
        </Card>
        <div className="next-icon-wrap">
          <DownTriangleOutlined width={18} height={18} />
        </div>
        <EmptyBox if={!!dbType}>
          <RuleUnderstand
            loading={loading}
            ruleName={ruleName}
            content={ruleKnowledgeInfo?.knowledge_content}
            refresh={refresh}
            dbType={dbType!}
            isCustomRule={isCustomRule}
          />
        </EmptyBox>
      </RuleKnowledgeContentStyleWrapper>
    </>
  );
};
export default RuleKnowledge;
