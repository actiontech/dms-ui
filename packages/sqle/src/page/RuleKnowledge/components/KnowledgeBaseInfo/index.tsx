import { Card, Spin, Typography, Space } from 'antd';
import { IRuleKnowledgeResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

interface KnowledgeBaseInfoProps {
  loading: boolean;
  ruleKnowledgeInfo?: IRuleKnowledgeResV1;
}

const KnowledgeBaseInfo: React.FC<KnowledgeBaseInfoProps> = ({
  loading,
  ruleKnowledgeInfo
}) => {
  return (
    <Card className="rule-knowledge-info-card">
      <Spin spinning={loading}>
        <Space direction="vertical">
          <Typography.Title level={4}>
            {ruleKnowledgeInfo?.rule?.desc ?? '-'}
          </Typography.Title>
          <Typography.Text type="secondary">
            {ruleKnowledgeInfo?.rule?.annotation ?? '-'}
          </Typography.Text>
        </Space>
      </Spin>
    </Card>
  );
};

export default KnowledgeBaseInfo;
