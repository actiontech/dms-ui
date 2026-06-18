import { Empty, Alert, Card, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import AuditResultMessage from '../../../components/AuditResultMessage';
import { ISqlManageRemediation } from '@actiontech/shared/lib/api/sqle/service/common';
import RemediationStatusTag from '../../SqlManagement/component/SQLEEIndex/RemediationStatusTag';

type RemediationCompareProps = {
  data?: ISqlManageRemediation;
};

const ruleNames = (rules?: ISqlManageRemediation['rule_diff']) => ({
  resolved: rules?.resolved?.map((rule) => rule.rule_name).filter(Boolean),
  newRules: rules?.new?.map((rule) => rule.rule_name).filter(Boolean),
  unchanged: rules?.unchanged?.map((rule) => rule.rule_name).filter(Boolean)
});

const RuleList: React.FC<{ title: string; rules?: string[] }> = ({
  title,
  rules
}) => {
  const { t } = useTranslation();

  return (
    <Space direction="vertical" size={4}>
      <Typography.Text strong>{title}</Typography.Text>
      {rules?.length ? (
        rules.map((rule) => (
          <Typography.Text key={rule}>{rule}</Typography.Text>
        ))
      ) : (
        <Typography.Text type="secondary">
          {t('sqlManagement.remediationCompare.emptyRules')}
        </Typography.Text>
      )}
    </Space>
  );
};

const RemediationCompare: React.FC<RemediationCompareProps> = ({ data }) => {
  const { t } = useTranslation();

  if (!data) {
    return <Empty />;
  }

  const rules = ruleNames(data.rule_diff);

  return (
    <Space direction="vertical" size={16} className="full-width-element">
      <Card title={t('sqlManagement.remediationCompare.title')}>
        <Space direction="vertical" size={12} className="full-width-element">
          <Typography.Paragraph type="secondary">
            {t('sqlManagement.remediationCompare.description')}
          </Typography.Paragraph>
          {data.first_audit_missing && (
            <Alert
              type="warning"
              showIcon
              message={t('sqlManagement.remediationCompare.firstAuditMissing')}
            />
          )}
          <RemediationStatusTag status={data.remediation_status} />
        </Space>
      </Card>
      <Card title={t('sqlManagement.remediationCompare.ruleDiffTitle')}>
        <Space size={48} align="start">
          <RuleList
            title={t('sqlManagement.remediationCompare.resolved')}
            rules={rules.resolved}
          />
          <RuleList
            title={t('sqlManagement.remediationCompare.new')}
            rules={rules.newRules}
          />
          <RuleList
            title={t('sqlManagement.remediationCompare.unchanged')}
            rules={rules.unchanged}
          />
        </Space>
      </Card>
      <Card title={t('sqlManagement.remediationCompare.firstAuditResult')}>
        <AuditResultMessage auditResult={data.first_audit_result ?? []} />
      </Card>
      <Card title={t('sqlManagement.remediationCompare.latestAuditResult')}>
        <AuditResultMessage auditResult={data.latest_audit_result ?? []} />
      </Card>
    </Space>
  );
};

export default RemediationCompare;
