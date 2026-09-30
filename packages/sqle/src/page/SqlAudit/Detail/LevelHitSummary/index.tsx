import { useTranslation } from 'react-i18next';
import { IAuditLevelSummary } from '@actiontech/shared/lib/api/sqle/service/common';
import { LevelHitSummaryStyleWrapper } from './style';

type LevelHitSummaryProps = {
  levelSummary?: IAuditLevelSummary | null;
  loading?: boolean;
  error?: boolean;
};

const toCount = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const LevelHitSummary = ({
  levelSummary,
  loading,
  error
}: LevelHitSummaryProps) => {
  const { t } = useTranslation();

  const errorCount = toCount(levelSummary?.error_count);
  const errorP0 = toCount(levelSummary?.error_p0_count);
  const errorP1 = toCount(levelSummary?.error_p1_count);
  const warnCount = toCount(levelSummary?.warn_count);
  const noticeCount = toCount(levelSummary?.notice_count);
  const normalCount = toCount(levelSummary?.normal_count);
  const errorPriorityParts = [
    errorP0 > 0 ? `P0 ${errorP0}` : '',
    errorP1 > 0 ? `P1 ${errorP1}` : ''
  ].filter(Boolean);
  const errorPriorityText =
    errorPriorityParts.length > 0 ? `（${errorPriorityParts.join('，')}）` : '';

  return (
    <LevelHitSummaryStyleWrapper
      className="sql-audit-level-hit-summary"
      data-testid="sql-audit-level-hit-summary"
    >
      <div className="section-title">
        {t('sqlAudit.detail.levelHitSummary.title')}
      </div>
      {error ? (
        <div className="level-hit-error-msg">
          {t('sqlAudit.detail.levelHitSummary.loadFailed')}
        </div>
      ) : loading && !levelSummary ? (
        <div className="level-hit-empty">
          {t('sqlAudit.detail.levelHitSummary.loading')}
        </div>
      ) : (
        <div className="level-hit-items">
          <span
            className="level-hit-item level-hit-error"
            data-testid="sql-audit-level-hit-error"
            data-value={errorCount}
          >
            {t('components.auditResultMessage.level.error')}
            <span className="level-hit-value">{errorCount}</span>
            {errorPriorityText ? (
              <span
                className="level-hit-sub"
                data-testid="sql-audit-level-hit-error-priority"
                data-p0={errorP0}
                data-p1={errorP1}
              >
                {errorPriorityText}
              </span>
            ) : null}
          </span>
          <span
            className="level-hit-item"
            data-testid="sql-audit-level-hit-warn"
            data-value={warnCount}
          >
            {t('components.auditResultMessage.level.warn')}
            <span className="level-hit-value">{warnCount}</span>
          </span>
          <span
            className="level-hit-item"
            data-testid="sql-audit-level-hit-notice"
            data-value={noticeCount}
          >
            {t('components.auditResultMessage.level.notice')}
            <span className="level-hit-value">{noticeCount}</span>
          </span>
          <span
            className="level-hit-item"
            data-testid="sql-audit-level-hit-normal"
            data-value={normalCount}
          >
            {t('components.auditResultMessage.level.normal')}
            <span className="level-hit-value">{normalCount}</span>
          </span>
        </div>
      )}
    </LevelHitSummaryStyleWrapper>
  );
};

export default LevelHitSummary;
