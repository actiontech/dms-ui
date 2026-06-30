import { useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { SQLRenderer } from '@actiontech/shared';
import {
  buildQuickAddRuleExceptionSummaryItems,
  ISqlManageRuleExceptionContext
} from '../../../page/RuleException/index.data';
import useSourceTips, {
  resolveAuditTaskTypeLabel
} from '../../../page/SqlManagement/component/SQLEEIndex/hooks/useSourceTips';
import { QuickAddRuleExceptionContextSummaryStyleWrapper } from './style';

const SQL_FINGERPRINT_COLLAPSED_ROWS = 1;

type ContextSummaryFingerPrintValueProps = {
  sql?: string;
};

const ContextSummaryFingerPrintValue: React.FC<
  ContextSummaryFingerPrintValueProps
> = ({ sql }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [sql]);

  if (!sql) {
    return null;
  }

  if (expanded) {
    return (
      <>
        <SQLRenderer sql={sql} showCopyIcon={false} />
        <Typography.Link
          className="context-summary-sql-toggle"
          onClick={() => setExpanded(false)}
        >
          {t('common.collapse')}
        </Typography.Link>
      </>
    );
  }

  return (
    <SQLRenderer.Snippet
      sql={sql}
      rows={SQL_FINGERPRINT_COLLAPSED_ROWS}
      showCopyIcon={false}
      tooltip={false}
      highlightSyntax={false}
      paragraph={{
        ellipsis: {
          expandable: true,
          rows: SQL_FINGERPRINT_COLLAPSED_ROWS,
          symbol: t('common.expansion'),
          tooltip: false,
          onExpand: () => {
            setExpanded(true);
          }
        }
      }}
    />
  );
};

type QuickAddRuleExceptionContextSummaryProps = {
  sqlManageContext?: ISqlManageRuleExceptionContext;
  ruleName?: string;
  ruleLabel?: string;
};

const QuickAddRuleExceptionContextSummary: React.FC<
  QuickAddRuleExceptionContextSummaryProps
> = ({ sqlManageContext, ruleName, ruleLabel }) => {
  const { t } = useTranslation();
  const { generateSourceSelectOptions } = useSourceTips();

  const summaryItems = useMemo(() => {
    const items = buildQuickAddRuleExceptionSummaryItems({
      sqlManageContext,
      ruleName,
      ruleLabel,
      getLabel: (key) => t(`ruleException.quickAdd.context.${key}`)
    });

    return items.map((item) => {
      if (item.key === 'audit_task_type' && item.value) {
        return {
          ...item,
          value:
            resolveAuditTaskTypeLabel(
              item.value,
              generateSourceSelectOptions
            ) ?? item.value
        };
      }
      return item;
    });
  }, [generateSourceSelectOptions, ruleLabel, ruleName, sqlManageContext, t]);

  return (
    <QuickAddRuleExceptionContextSummaryStyleWrapper>
      <div className="context-summary-title">
        {t('ruleException.quickAdd.context.title')}
      </div>
      <div className="context-summary-list">
        {summaryItems.map((item) => (
          <div key={item.key} className="context-summary-item">
            <div className="context-summary-item-label">{item.label}</div>
            <div
              className={`context-summary-item-value${
                item.value ? '' : ' is-missing'
              }`}
            >
              {item.key === 'fingerPrint' && item.value ? (
                <ContextSummaryFingerPrintValue sql={item.value} />
              ) : (
                item.value || t('ruleException.matchConditionsSummary.empty')
              )}
            </div>
          </div>
        ))}
      </div>
    </QuickAddRuleExceptionContextSummaryStyleWrapper>
  );
};

export default QuickAddRuleExceptionContextSummary;
