import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditTaskRuleHitDetailV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { resolveAuditLevelDisplayMeta } from '../../../../components/AuditResultMessage/errorPriorityDisplay';
import { RuleHitDetailsStyleWrapper } from './style';

export type RuleHitDetailsVariant = 'detail' | 'aggregate';

type RuleHitDetailsProps = {
  ruleHitDetails?: IAuditTaskRuleHitDetailV1[] | null;
  loading?: boolean;
  error?: boolean;
  /** 外层已有 Tab/标题时隐藏内嵌 section-title */
  hideTitle?: boolean;
  /**
   * detail（默认）：列序 规则/等级/触发次数/说明；显示名 message → rule_name → -
   * aggregate：列序 规则/等级/说明/触发次数；显示名 rule_name → -（不以说明顶替）
   */
  variant?: RuleHitDetailsVariant;
};

const EMPTY = '-';

const RuleHitDetails = ({
  ruleHitDetails,
  loading,
  error,
  hideTitle = false,
  variant = 'detail'
}: RuleHitDetailsProps) => {
  const { t } = useTranslation();
  const isAggregate = variant === 'aggregate';

  const rows = useMemo(() => ruleHitDetails ?? [], [ruleHitDetails]);

  return (
    <RuleHitDetailsStyleWrapper
      className={`sql-audit-rule-hit-details${hideTitle ? ' is-embedded' : ''}`}
      data-testid="sql-audit-rule-hit-details"
      data-variant={variant}
    >
      {hideTitle ? null : (
        <div className="section-title">
          {t('sqlAudit.detail.ruleHitDetails.title')}
        </div>
      )}
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
              {isAggregate ? (
                <>
                  <th>{t('sqlAudit.detail.ruleHitDetails.columns.message')}</th>
                  <th>
                    {t('sqlAudit.detail.ruleHitDetails.columns.hitCount')}
                  </th>
                </>
              ) : (
                <>
                  <th>
                    {t('sqlAudit.detail.ruleHitDetails.columns.hitCount')}
                  </th>
                  <th>{t('sqlAudit.detail.ruleHitDetails.columns.message')}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => {
              const messageText = (item.message ?? '').trim() || EMPTY;
              // detail 原行为：显示名优先说明文案；aggregate：规则名不以说明顶替
              const displayName = isAggregate
                ? (item.rule_name ?? '').trim() || EMPTY
                : (item.message ?? '').trim() ||
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
              const rowKey = `${item.rule_name ?? displayName}-${
                item.level ?? ''
              }-${item.error_priority ?? ''}-${index}`;

              const levelCell = (
                <td
                  data-testid="sql-audit-rule-hit-level"
                  data-error-priority={meta.dataErrorPriority}
                >
                  {levelLabel}
                </td>
              );
              const countCell = (
                <td
                  data-testid="sql-audit-rule-hit-count"
                  data-value={hitCount}
                >
                  {hitCount}
                </td>
              );
              const messageCell = (
                <td data-testid="sql-audit-rule-hit-message">{messageText}</td>
              );

              return (
                <tr key={rowKey} data-testid="sql-audit-rule-hit-row">
                  <td data-testid="sql-audit-rule-hit-name">{displayName}</td>
                  {levelCell}
                  {isAggregate ? (
                    <>
                      {messageCell}
                      {countCell}
                    </>
                  ) : (
                    <>
                      {countCell}
                      {messageCell}
                    </>
                  )}
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
