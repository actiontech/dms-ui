import { useEffect, useState } from 'react';
import { Card, Space, Typography, Spin } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
// import { useTheme } from '@mui/styles';
import { useRequest } from 'ahooks';
// import rule_template from '../../api/rule_template';
import RuleUnderstand from './RuleUnderstand';
import { EmptyBox, PageHeader } from '@actiontech/shared';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { RuleKnowledgeContentStyleWrapper } from './style';

const RuleKnowledge: React.FC = () => {
  const { t } = useTranslation();

  const { ruleName = '', dbType = '' } = useParams<{
    ruleName: string;
    dbType: string;
  }>();

  const [isCustomRule, setIsCustomRule] = useState(false);
  const { isAdmin } = useCurrentUser();

  const {
    data: ruleKnowledgeInfo,
    loading,
    refresh,
    run: getRuleKnowledge
  } = useRequest(
    // (isCustomType: boolean, dbType: string) => {
    //   if (isCustomType) {
    //     return rule_template
    //       .getCustomRuleKnowledgeV1({ rule_name: ruleName, db_type: dbType })
    //       .then((res) => {
    //         return res.data.data;
    //       });
    //   }
    //   return rule_template
    //     .getRuleKnowledgeV1({ rule_name: ruleName, db_type: dbType })
    //     .then((res) => {
    //       return res.data.data;
    //     });
    // },
    () => {
      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve({
      //       rule: {
      //         desc: '绑定的变量个数不建议超过阈值',
      //         annotation:
      //           '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100'
      //       },
      //       knowledge_content: 'test'
      //     });
      //   }, 3000);
      // });
      return Promise.resolve({
        rule: {
          desc: '绑定的变量个数不建议超过阈值',
          annotation:
            '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100'
        },
        knowledge_content: 'test'
      });
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    if (!!ruleName && !!dbType) {
      getRuleKnowledge();
      // rule_template
      //   .getRuleListV1({
      //     filter_rule_names: ruleName,
      //     filter_db_type: dbType,
      //   })
      //   .then((res) => {
      //     if (
      //       res.data.code === ResponseCode.SUCCESS &&
      //       res.data.data?.length === 1
      //     ) {
      //       const ruleInfo = res.data.data[0];
      //       if (!!ruleInfo.db_type) {
      //         setIsCustomRule(!!ruleInfo.is_custom_rule);
      //         getRuleKnowledge(!!ruleInfo.is_custom_rule, ruleInfo.db_type);
      //       }
      //     }
      //   });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        title={t('ruleKnowledge.pageTitle')}
        extra={t('ruleKnowledge.pageDesc')}
      />
      <RuleKnowledgeContentStyleWrapper>
        <Space direction="vertical" size="large" className="space-wrapper">
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

          <EmptyBox if={!!dbType}>
            <RuleUnderstand
              loading={loading}
              ruleName={ruleName}
              content={ruleKnowledgeInfo?.knowledge_content}
              refresh={refresh}
              dbType={dbType!}
              isAdmin={isAdmin}
              isCustomRule={isCustomRule}
            />
          </EmptyBox>
        </Space>
      </RuleKnowledgeContentStyleWrapper>
    </>
  );
};
export default RuleKnowledge;
