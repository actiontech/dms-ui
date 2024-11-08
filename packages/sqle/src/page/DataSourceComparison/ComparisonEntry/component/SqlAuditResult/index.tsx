import { useMemo } from 'react';
import { IAuditResultItem } from '../../../../../components/ReportDrawer/index.type';
import AuditResultMessage from '../../../../../components/AuditResultMessage';
import { SqlAuditResultStyleWrapper } from '../ComparisonTreeNode/ComparisonDetailDrawer/style';
import useAuditResultRuleInfo from '../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { useTranslation } from 'react-i18next';
import { Result, Spin } from 'antd';

type Props = {
  auditResults: IAuditResultItem[];
  instanceType: string;
  auditError?: string;
  shouldFetchRules: boolean;
};

const AuditResult: React.FC<Props> = ({
  auditResults,
  instanceType,
  auditError,
  shouldFetchRules
}) => {
  const { t } = useTranslation();

  const resultDataIsEmpty = useMemo(() => {
    return (
      (Array.isArray(auditResults) && !auditResults.length) || !auditResults
    );
  }, [auditResults]);

  const { auditResultRuleInfo, loading } = useAuditResultRuleInfo(
    auditResults ?? [],
    instanceType,
    shouldFetchRules
  );

  if (auditError) {
    return (
      <Result
        status="error"
        title={t('dataSourceComparison.entry.comparisonDetail.auditFailed')}
        subTitle={auditError}
      />
    );
  }

  if (resultDataIsEmpty) {
    return <AuditResultMessage styleClass="result-item" />;
  }

  return (
    <Spin spinning={loading} delay={300}>
      <SqlAuditResultStyleWrapper>
        {(auditResultRuleInfo ?? [])?.map(
          (item: IAuditResultItem, index: number) => {
            if (item.isRuleDeleted) {
              return (
                <AuditResultMessage
                  styleClass="result-item"
                  key={`${item.rule_name ?? ''}${item.message ?? ''}-${index}`}
                  auditResult={{
                    level: item?.level ?? '',
                    message: item?.message ?? ''
                  }}
                  isRuleDeleted={item.isRuleDeleted}
                />
              );
            }
            return (
              <AuditResultMessage
                styleClass="result-item"
                key={`${item.rule_name ?? ''}${item.message ?? ''}-${index}`}
                auditResult={{
                  level: item?.level ?? '',
                  message: item?.message ?? '',
                  annotation: item.annotation ?? ''
                }}
                showAnnotation
                moreBtnLink={
                  item?.rule_name && item?.db_type
                    ? `/sqle/rule/knowledge/${item?.rule_name}/${item?.db_type}`
                    : ''
                }
              />
            );
          }
        )}
      </SqlAuditResultStyleWrapper>
    </Spin>
  );
};

export default AuditResult;
