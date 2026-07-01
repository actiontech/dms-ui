import { useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicTag, SQLRenderer } from '@actiontech/shared';
import {
  buildQuickAddRuleExceptionSummaryItems,
  ISqlManageRuleExceptionContext
} from '../../../page/RuleException/index.data';
import { buildRuleKnowledgePath } from '../../../page/RuleException/utils';
import { IAuditResultWithExemption } from '../../../page/RuleException/index.type';
import useSourceTips, {
  resolveAuditTaskTypeLabel
} from '../../../page/SqlManagement/component/SQLEEIndex/hooks/useSourceTips';
import AuditResultMessage from '../../AuditResultMessage';
import { IAuditResultWithExtra } from '../../AuditResultMessage/index.type';
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
  auditResult?: IAuditResultWithExemption;
  ruleScopeDbType?: string;
};

const QuickAddRuleExceptionContextSummary: React.FC<
  QuickAddRuleExceptionContextSummaryProps
> = ({
  sqlManageContext,
  ruleName,
  ruleLabel,
  auditResult,
  ruleScopeDbType
}) => {
  const { t } = useTranslation();
  const { generateSourceSelectOptions } = useSourceTips();

  const ruleScopeAuditResult = useMemo(():
    | IAuditResultWithExtra
    | undefined => {
    const resolvedRuleName = ruleName ?? auditResult?.rule_name;
    if (!resolvedRuleName) {
      return undefined;
    }
    const extraAuditResult = auditResult as IAuditResultWithExtra | undefined;
    return {
      level: auditResult?.level ?? '',
      rule_name: resolvedRuleName,
      desc: ruleLabel,
      message: auditResult?.message,
      annotation: extraAuditResult?.annotation,
      i18n_audit_result_info: extraAuditResult?.i18n_audit_result_info,
      db_type: auditResult?.db_type ?? ruleScopeDbType
    };
  }, [auditResult, ruleLabel, ruleName, ruleScopeDbType]);

  const ruleScopeNavigatePath = useMemo(
    () =>
      buildRuleKnowledgePath(
        ruleName ?? auditResult?.rule_name,
        ruleScopeDbType
      ),
    [auditResult?.rule_name, ruleName, ruleScopeDbType]
  );

  const hasRuleScopeValue = !!ruleScopeAuditResult?.rule_name;

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
        {summaryItems.map((item) => {
          if (item.key === 'rule_scope') {
            return (
              <div
                key={item.key}
                className="context-summary-item context-summary-item-rule-scope"
              >
                <div className="context-summary-item-label-row">
                  <div className="context-summary-item-label">{item.label}</div>
                  {ruleScopeDbType ? (
                    <BasicTag size="small">{ruleScopeDbType}</BasicTag>
                  ) : null}
                </div>
                <div
                  className={`context-summary-item-value${
                    hasRuleScopeValue ? '' : ' is-missing'
                  }`}
                >
                  {hasRuleScopeValue ? (
                    <AuditResultMessage
                      styleClass="result-item"
                      auditResult={ruleScopeAuditResult}
                      displayMode="ruleDesc"
                      showAnnotation={!!ruleScopeAuditResult?.annotation}
                      moreBtnLink={ruleScopeNavigatePath ?? ''}
                      moreBtnPlacement="descRow"
                    />
                  ) : (
                    t('ruleException.matchConditionsSummary.empty')
                  )}
                </div>
              </div>
            );
          }

          return (
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
          );
        })}
      </div>
    </QuickAddRuleExceptionContextSummaryStyleWrapper>
  );
};

export default QuickAddRuleExceptionContextSummary;
