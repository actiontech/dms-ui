import { useMemo } from 'react';
import { IAuditResultItem } from '../../../../../components/ReportDrawer/index.type';
import AuditResultMessage from '../../../../../components/AuditResultMessage';
import { SqlAuditResultStyleWrapper } from '../ComparisonTreeNode/ComparisonDetailDrawer/style';
import useAuditResultRuleInfo from '../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { useTranslation } from 'react-i18next';
import { Result, Spin } from 'antd';
import { BasicToolTip, EmptyBox } from '@actiontech/dms-kit';
import { parse2ReactRouterPath } from '@actiontech/shared';
import AuditExceptionItem from '../../../../../components/AuditResultMessage/AuditExceptionItem';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
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
  const { auditResultWithNormalLevel, auditResultWithAuditException } =
    useMemo(() => {
      const normalLevel: IAuditResultItem[] = [];
      const exceptionResult: IAuditResultItem[] = [];
      (auditResults ?? []).forEach((item) => {
        if (item.execution_failed) {
          exceptionResult.push(item);
        } else {
          normalLevel.push(item);
        }
      });
      return {
        auditResultWithAuditException: exceptionResult,
        auditResultWithNormalLevel: normalLevel
      };
    }, [auditResults]);
  const { auditResultRuleInfo, loading } = useAuditResultRuleInfo(
    auditResultWithNormalLevel,
    instanceType,
    shouldFetchRules && !auditError
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
        <EmptyBox if={auditResultWithNormalLevel.length > 0}>
          <div className="title">
            {t('dataSourceComparison.entry.comparisonDetail.auditResult')}
          </div>
          {auditResultRuleInfo.map((item, index) => {
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
                    ? parse2ReactRouterPath(
                        ROUTE_PATHS.SQLE.RULE_KNOWLEDGE.index,
                        {
                          params: {
                            ruleName: item.rule_name ?? '',
                            dbType: item.db_type ?? ''
                          }
                        }
                      )
                    : ''
                }
              />
            );
          })}
        </EmptyBox>

        <EmptyBox if={auditResultWithAuditException.length > 0}>
          <div className="title">
            <BasicToolTip
              title={t(
                'dataSourceComparison.entry.comparisonDetail.exceptionTips'
              )}
              suffixIcon
            >
              {t('dataSourceComparison.entry.comparisonDetail.exception')}
            </BasicToolTip>
          </div>

          <div className="audit-exception-wrapper">
            {auditResultWithAuditException.map((item, index) => {
              return (
                <AuditExceptionItem
                  key={`${item.rule_name}-${index}`}
                  auditExceptionResult={item}
                />
              );
            })}
          </div>
        </EmptyBox>
      </SqlAuditResultStyleWrapper>
    </Spin>
  );
};
export default AuditResult;
