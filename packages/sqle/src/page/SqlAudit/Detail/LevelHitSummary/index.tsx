import { useTranslation } from 'react-i18next';
import { IAuditTaskLevelSummaryV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { LevelHitSummaryStyleWrapper } from './style';

type LevelHitSummaryProps = {
  levelSummary?: IAuditTaskLevelSummaryV1 | null;
  loading?: boolean;
  error?: boolean;
  /** 汇总页：即使 P0/P1 为 0 也展示子计数文案（AC-STAT-003） */
  alwaysShowErrorPriority?: boolean;
  /** cards：四色等级卡（对齐汇总原型）；inline：详情扁平行 */
  variant?: 'inline' | 'cards';
  /** cards 模式下 section-head 右侧 hint */
  sectionHint?: string;
};

const toCount = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const LevelHitSummary = ({
  levelSummary,
  loading,
  error,
  alwaysShowErrorPriority = false,
  variant = 'inline',
  sectionHint
}: LevelHitSummaryProps) => {
  const { t } = useTranslation();

  const errorCount = toCount(levelSummary?.error_count);
  const errorP0 = toCount(levelSummary?.error_p0_count);
  const errorP1 = toCount(levelSummary?.error_p1_count);
  const warnCount = toCount(levelSummary?.warn_count);
  const noticeCount = toCount(levelSummary?.notice_count);
  const normalCount = toCount(levelSummary?.normal_count);
  const errorPriorityParts = alwaysShowErrorPriority
    ? [`P0 ${errorP0}`, `P1 ${errorP1}`]
    : [
        errorP0 > 0 ? `P0 ${errorP0}` : '',
        errorP1 > 0 ? `P1 ${errorP1}` : ''
      ].filter(Boolean);
  const errorPriorityText =
    errorPriorityParts.length > 0 ? `（${errorPriorityParts.join('，')}）` : '';

  const levelItems = [
    {
      key: 'error',
      className: 'level-stat error',
      count: errorCount,
      label: t('components.auditResultMessage.level.error'),
      testId: 'sql-audit-level-hit-error',
      priority:
        alwaysShowErrorPriority || errorPriorityParts.length > 0
          ? errorPriorityParts
          : []
    },
    {
      key: 'warn',
      className: 'level-stat warn',
      count: warnCount,
      label: t('components.auditResultMessage.level.warn'),
      testId: 'sql-audit-level-hit-warn',
      priority: [] as string[]
    },
    {
      key: 'notice',
      className: 'level-stat notice',
      count: noticeCount,
      label: t('components.auditResultMessage.level.notice'),
      testId: 'sql-audit-level-hit-notice',
      priority: [] as string[]
    },
    {
      key: 'normal',
      className: 'level-stat normal',
      count: normalCount,
      label: t('components.auditResultMessage.level.normal'),
      testId: 'sql-audit-level-hit-normal',
      priority: [] as string[]
    }
  ];

  return (
    <LevelHitSummaryStyleWrapper
      className={`sql-audit-level-hit-summary is-${variant}`}
      data-testid="sql-audit-level-hit-summary"
      data-variant={variant}
    >
      {variant === 'cards' ? (
        <div className="section-head">
          <span>{t('sqlAudit.detail.levelHitSummary.title')}</span>
          {sectionHint ? (
            <span className="section-hint">{sectionHint}</span>
          ) : null}
        </div>
      ) : (
        <div className="section-title">
          {t('sqlAudit.detail.levelHitSummary.title')}
        </div>
      )}
      {error ? (
        <div className="level-hit-error-msg">
          {t('sqlAudit.detail.levelHitSummary.loadFailed')}
        </div>
      ) : loading && !levelSummary ? (
        <div className="level-hit-empty">
          {t('sqlAudit.detail.levelHitSummary.loading')}
        </div>
      ) : variant === 'cards' ? (
        <div className="level-overview">
          {levelItems.map((item) => (
            <div
              key={item.key}
              className={item.className}
              data-testid={item.testId}
              data-value={item.count}
            >
              <div className="level-stat-value">{item.count}</div>
              <div className="level-stat-label">{item.label}</div>
              {item.key === 'error' && item.priority.length > 0 ? (
                <div
                  className="priority-split"
                  data-testid="sql-audit-level-hit-error-priority"
                  data-p0={errorP0}
                  data-p1={errorP1}
                >
                  {item.priority.map((part) => (
                    <span key={part}>{part}</span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
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
