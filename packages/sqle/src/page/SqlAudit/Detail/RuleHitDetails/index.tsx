import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditRuleHitDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import {
  ActiontechTable,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { resolveAuditLevelDisplayMeta } from '../../../../components/AuditResultMessage/errorPriorityDisplay';
import { RuleHitDetailsStyleWrapper } from './style';

type RuleHitDetailsProps = {
  ruleHitDetails?: IAuditRuleHitDetail[] | null;
  loading?: boolean;
  error?: boolean;
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
  error
}: RuleHitDetailsProps) => {
  const { t } = useTranslation();

  const rows = useMemo(() => ruleHitDetails ?? [], [ruleHitDetails]);
  const columns = useMemo<ActiontechTableColumn<IAuditRuleHitDetail>>(
    () => [
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
      },
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
            <span data-testid="sql-audit-rule-hit-level">
              {t(meta.labelKey)}
            </span>
          );
        }
      },
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
      },
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
      }
    ],
    [t]
  );

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
        <ActiontechTable<IAuditRuleHitDetail, Record<string, never>>
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
