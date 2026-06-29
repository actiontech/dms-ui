import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SQLRenderer } from '@actiontech/shared';
import {
  buildQuickAddRuleExceptionSummaryItems,
  ISqlManageRuleExceptionContext
} from '../../../page/RuleException/index.data';
import { QuickAddRuleExceptionContextSummaryStyleWrapper } from './style';

const SQL_FINGERPRINT_PREVIEW_ROWS = 2;

type QuickAddRuleExceptionContextSummaryProps = {
  sqlManageContext?: ISqlManageRuleExceptionContext;
  ruleName?: string;
  ruleLabel?: string;
  dbType?: string;
};

const QuickAddRuleExceptionContextSummary: React.FC<
  QuickAddRuleExceptionContextSummaryProps
> = ({ sqlManageContext, ruleName, ruleLabel, dbType }) => {
  const { t } = useTranslation();

  const summaryItems = useMemo(
    () =>
      buildQuickAddRuleExceptionSummaryItems({
        sqlManageContext,
        ruleName,
        ruleLabel,
        dbType,
        getLabel: (key) => t(`ruleException.quickAdd.context.${key}`)
      }),
    [dbType, ruleLabel, ruleName, sqlManageContext, t]
  );

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
                <SQLRenderer.Snippet
                  sql={item.value}
                  rows={SQL_FINGERPRINT_PREVIEW_ROWS}
                  showCopyIcon={false}
                  tooltip={false}
                  paragraph={{
                    ellipsis: {
                      expandable: true,
                      rows: SQL_FINGERPRINT_PREVIEW_ROWS
                    }
                  }}
                />
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
