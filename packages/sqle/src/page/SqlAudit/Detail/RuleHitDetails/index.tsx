import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditRuleHitDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { resolveAuditLevelDisplayMeta } from '../../../../components/AuditResultMessage/errorPriorityDisplay';
import { RuleHitDetailsStyleWrapper } from './style';

type RuleHitDetailsProps = {
  ruleHitDetails?: IAuditRuleHitDetail[] | null;
  loading?: boolean;
  error?: boolean;
};

const EMPTY = '-';

const RuleHitDetails = ({
  ruleHitDetails,
  loading,
  error
}: RuleHitDetailsProps) => {
  const { t } = useTranslation();

  const rows = useMemo(() => ruleHitDetails ?? [], [ruleHitDetails]);

  return (
    <RuleHitDetailsStyleWrapper
      className="sql-audit-rule-hit-details"
      data-testid="sql-audit-rule-hit-details"
    >
      <div className="section-title">
        {t('sqlAudit.detail.ruleHitDetails.title')}
      </div>
      {error ? (
        <div className="rule-hit-error-msg">
          {t('sqlAudit.detail.ruleHitDetails.loadFailed')}
        </div>
      ) : loading && !ruleHitDetails ? (
        <div className="rule-hit-empty">
          {t('sqlAudit.detail.ruleHitDetails.loading')}
        </div>
      ) : rows.length === 0 ? (
        <div className="rule-hit-empty">
          {t('sqlAudit.detail.ruleHitDetails.empty')}
        </div>
      ) : (
        <table className="rule-hit-table">
          <thead>
            <tr>
              <th>{t('sqlAudit.detail.ruleHitDetails.columns.rule')}</th>
              <th>{t('sqlAudit.detail.ruleHitDetails.columns.level')}</th>
              <th>{t('sqlAudit.detail.ruleHitDetails.columns.hitCount')}</th>
              <th>{t('sqlAudit.detail.ruleHitDetails.columns.message')}</th>
              <th>{t('sqlAudit.detail.ruleHitDetails.columns.sqlNumbers')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => {
              const displayName =
                (item.message ?? '').trim() ||
                (item.rule_name ?? '').trim() ||
                EMPTY;
              const meta = resolveAuditLevelDisplayMeta(
                item.level,
                item.error_priority
              );
              const levelLabel = t(meta.labelKey);
              const hitCount =
                typeof item.hit_count === 'number' &&
                Number.isFinite(item.hit_count)
                  ? item.hit_count
                  : 0;
              const sqlNumbers = (item.sql_numbers ?? [])
                .map((n) => `#${n}`)
                .join(', ');
              const rowKey = `${item.rule_name ?? displayName}-${index}`;

              return (
                <tr key={rowKey} data-testid="sql-audit-rule-hit-row">
                  <td data-testid="sql-audit-rule-hit-name">{displayName}</td>
                  <td data-testid="sql-audit-rule-hit-level">{levelLabel}</td>
                  <td
                    data-testid="sql-audit-rule-hit-count"
                    data-value={hitCount}
                  >
                    {hitCount}
                  </td>
                  <td>{(item.message ?? '').trim() || EMPTY}</td>
                  <td>{sqlNumbers || EMPTY}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </RuleHitDetailsStyleWrapper>
  );
};

export default RuleHitDetails;
