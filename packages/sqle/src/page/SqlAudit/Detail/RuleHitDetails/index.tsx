import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditTaskRuleHitDetailV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import {
  ActiontechTable,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
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
   * detail（默认）：列序 规则/等级/触发次数/说明
   * aggregate：列序 规则/等级/说明/触发次数
   */
  variant?: RuleHitDetailsVariant;
};

const EMPTY = '-';
const RULE_COLUMN_WIDTH = 280;
const LEVEL_COLUMN_WIDTH = 90;
const HIT_COUNT_COLUMN_WIDTH = 90;
const MESSAGE_COLUMN_WIDTH = 360;
const TABLE_MIN_WIDTH =
  RULE_COLUMN_WIDTH +
  LEVEL_COLUMN_WIDTH +
  HIT_COUNT_COLUMN_WIDTH +
  MESSAGE_COLUMN_WIDTH;

const renderEllipsisText = (text?: string | null) => {
  const displayText = text?.trim() || EMPTY;

  return (
    <BasicTypographyEllipsis
      copyable={false}
      textCont={displayText}
      tooltipLimitLength={displayText.length}
    />
  );
};

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
  const columns = useMemo<
    ActiontechTableColumn<IAuditTaskRuleHitDetailV1>
  >(() => {
    const ruleColumn: ActiontechTableColumn<IAuditTaskRuleHitDetailV1>[number] =
      {
        dataIndex: 'rule_name',
        title: t('sqlAudit.detail.ruleHitDetails.columns.rule'),
        width: RULE_COLUMN_WIDTH,
        className: 'rule-hit-ellipsis-column',
        render: (ruleName) => (
          <div data-testid="sql-audit-rule-hit-name">
            {renderEllipsisText(ruleName)}
          </div>
        )
      };
    const levelColumn: ActiontechTableColumn<IAuditTaskRuleHitDetailV1>[number] =
      {
        dataIndex: 'level',
        title: t('sqlAudit.detail.ruleHitDetails.columns.level'),
        width: LEVEL_COLUMN_WIDTH,
        render: (_, item) => {
          const meta = resolveAuditLevelDisplayMeta(
            item.level,
            item.error_priority
          );

          return (
            <span
              data-testid="sql-audit-rule-hit-level"
              data-error-priority={meta.dataErrorPriority}
            >
              {t(meta.labelKey)}
            </span>
          );
        }
      };
    const hitCountColumn: ActiontechTableColumn<IAuditTaskRuleHitDetailV1>[number] =
      {
        dataIndex: 'hit_count',
        title: t('sqlAudit.detail.ruleHitDetails.columns.hitCount'),
        width: HIT_COUNT_COLUMN_WIDTH,
        render: (hitCount) => {
          const displayHitCount =
            typeof hitCount === 'number' && Number.isFinite(hitCount)
              ? hitCount
              : 0;

          return (
            <span
              data-testid="sql-audit-rule-hit-count"
              data-value={displayHitCount}
            >
              {displayHitCount}
            </span>
          );
        }
      };
    const messageColumn: ActiontechTableColumn<IAuditTaskRuleHitDetailV1>[number] =
      {
        dataIndex: 'message',
        title: t('sqlAudit.detail.ruleHitDetails.columns.message'),
        width: MESSAGE_COLUMN_WIDTH,
        className: 'rule-hit-ellipsis-column',
        render: (message) => (
          <div data-testid="sql-audit-rule-hit-message">
            {renderEllipsisText(message)}
          </div>
        )
      };

    return isAggregate
      ? [ruleColumn, levelColumn, messageColumn, hitCountColumn]
      : [ruleColumn, levelColumn, hitCountColumn, messageColumn];
  }, [isAggregate, t]);

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
        <ActiontechTable<IAuditTaskRuleHitDetailV1, Record<string, never>>
          className="rule-hit-table"
          columns={columns}
          dataSource={rows}
          pagination={false}
          rowKey={(item) =>
            `${item.rule_name ?? EMPTY}-${item.level ?? EMPTY}-${
              item.message ?? EMPTY
            }`
          }
          rowClassName="sql-audit-rule-hit-row"
          scroll={{ x: TABLE_MIN_WIDTH }}
          tableLayout="fixed"
        />
      )}
    </RuleHitDetailsStyleWrapper>
  );
};

export default RuleHitDetails;
