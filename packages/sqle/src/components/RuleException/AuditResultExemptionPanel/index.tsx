import { useMemo } from 'react';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { ISkippedByRuleExceptionItem } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  buildAuditResultDisplayBuckets,
  isFullSqlExemption,
  shouldRenderAsFullSqlExemptedItem,
  resolveDbTypeFromAuditResults,
  resolvePrimaryExceptionId
} from '../../../page/RuleException/index.data';
import {
  buildAuditResultDisplayPayload,
  buildSkippedRuleExceptionDisplayPayload,
  enrichSkippedRuleExceptionItem,
  resolveAuditResultExpandProps
} from '../../AuditResultMessage/auditResultDisplay';
import AuditResultMessage from '../../AuditResultMessage';
import AuditResultWithRuleException from '../AuditResultWithRuleException';
import ExemptedAuditResultWithActions from '../ExemptedAuditResultWithActions';
import CollapsibleExemptedSection from './CollapsibleExemptedSection';
import FullSqlExemptedResultItem from '../FullSqlExemptedResultItem';
import { AuditResultExemptionPanelStyleWrapper } from './style';
import {
  AuditResultExemptionPanelLayout,
  AuditResultExemptionPanelProps
} from './types';
import { IAuditResultItem } from '../../ReportDrawer/index.type';

export type { AuditResultExemptionPanelLayout } from './types';
export type { AuditResultExemptionPanelProps } from './types';

const AuditResultExemptionPanel: React.FC<AuditResultExemptionPanelProps> = ({
  auditResult = [],
  skippedByRuleException = [],
  layout = 'report',
  showAnnotation,
  auditStatus,
  actions,
  enrichment,
  sqlManageContext: sqlManageContextProp,
  onOpenCreateException: onOpenCreateExceptionProp,
  onRefresh: onRefreshProp,
  status: statusProp,
  showRuleExceptionActions: showRuleExceptionActionsProp,
  showExemptedActions: showExemptedActionsProp,
  enrichAuditResultItem: enrichAuditResultItemProp,
  enrichSkippedItem: enrichSkippedItemProp,
  renderAuditResultItem: renderAuditResultItemProp
}) => {
  const { t } = useTranslation();

  const sqlManageContext = actions?.sqlManageContext ?? sqlManageContextProp;
  const onOpenCreateException =
    actions?.onOpenCreateException ?? onOpenCreateExceptionProp;
  const onRefresh = actions?.onRefresh ?? onRefreshProp;
  const status = actions?.status ?? statusProp;
  const showRuleExceptionActions =
    actions?.showRuleExceptionActions ?? showRuleExceptionActionsProp;
  const showExemptedActions =
    actions?.showExemptedActions ?? showExemptedActionsProp;
  const enrichAuditResultItem =
    enrichment?.enrichAuditResultItem ?? enrichAuditResultItemProp;
  const enrichSkippedItem =
    enrichment?.enrichSkippedItem ?? enrichSkippedItemProp;
  const renderAuditResultItem =
    enrichment?.renderAuditResultItem ?? renderAuditResultItemProp;

  const fallbackDbType = useMemo(
    () =>
      resolveDbTypeFromAuditResults(auditResult) ?? sqlManageContext?.db_type,
    [auditResult, sqlManageContext?.db_type]
  );

  const resolveDisplayItem = (item: IAuditResultItem) =>
    enrichAuditResultItem?.(item) ?? item;

  const getAuditResultViewProps = (item: IAuditResultItem) => {
    const displayItem = resolveDisplayItem(item);
    const { showAnnotation: resolvedShowAnnotation, moreBtnLink } =
      resolveAuditResultExpandProps(
        displayItem,
        fallbackDbType,
        showAnnotation
      );

    return {
      auditResult: buildAuditResultDisplayPayload(displayItem),
      moreBtnLink,
      showAnnotation: resolvedShowAnnotation,
      isRuleDeleted: displayItem.isRuleDeleted
    };
  };

  const { active, exempted } = useMemo(
    () => buildAuditResultDisplayBuckets(auditResult, skippedByRuleException),
    [auditResult, skippedByRuleException]
  );

  const fullSqlExemption = useMemo(
    () =>
      isFullSqlExemption({
        audit_result: active,
        skipped_by_rule_exception: exempted
      }),
    [active, exempted]
  );

  const fullSqlExceptionId = resolvePrimaryExceptionId(exempted);

  const shouldShowRuleExceptionActions =
    showRuleExceptionActions ?? !!sqlManageContext;
  const shouldShowExemptedActions = showExemptedActions ?? !!sqlManageContext;
  const defaultAnnotationExpanded = layout !== 'diff';

  const showExemptedSection = exempted.length > 0 || fullSqlExemption;
  const exemptedSectionCount =
    fullSqlExemption && exempted.length === 0 ? 1 : exempted.length;

  const resolveFullSqlExemptedMessage = () =>
    skippedByRuleException[0]?.message ?? '';

  const renderFullSqlExemptedItem = (key: string, message?: string) => (
    <div
      className={layout === 'report' ? 'result-item' : 'diff-item'}
      key={key}
    >
      <FullSqlExemptedResultItem
        message={message ?? resolveFullSqlExemptedMessage()}
        exceptionId={fullSqlExceptionId}
        showViewDetailAction={
          shouldShowExemptedActions || fullSqlExceptionId != null
        }
      />
    </div>
  );

  const renderReportItem = (item: IAuditResultItem, index: number) => {
    const {
      auditResult: auditResultPayload,
      moreBtnLink,
      showAnnotation: itemShowAnnotation,
      isRuleDeleted
    } = getAuditResultViewProps(item);
    const key = `${item.rule_name ?? ''}${item.message ?? ''}-${index}`;

    if (shouldShowRuleExceptionActions && !isRuleDeleted && item.rule_name) {
      return (
        <div className="result-item" key={key}>
          <AuditResultWithRuleException
            auditResult={auditResultPayload}
            sqlManageContext={sqlManageContext}
            status={status}
            onRefresh={onRefresh}
            onOpenCreateException={onOpenCreateException}
            displayMode="ruleDesc"
            showAnnotation={itemShowAnnotation}
            isRuleDeleted={isRuleDeleted}
            moreBtnLink={moreBtnLink}
            defaultAnnotationExpanded={defaultAnnotationExpanded}
          />
        </div>
      );
    }

    return (
      <AuditResultMessage
        styleClass="result-item"
        key={key}
        auditResult={auditResultPayload}
        displayMode="ruleDesc"
        showAnnotation={itemShowAnnotation}
        isRuleDeleted={isRuleDeleted}
        moreBtnLink={moreBtnLink}
        defaultAnnotationExpanded={defaultAnnotationExpanded}
      />
    );
  };

  const renderExemptedItem = (
    item: ISkippedByRuleExceptionItem,
    index: number
  ) => {
    const enriched =
      enrichSkippedItem?.(item) ??
      enrichSkippedRuleExceptionItem(item, undefined, {
        fallbackDbType
      });
    const payload = buildSkippedRuleExceptionDisplayPayload(enriched);
    // Exempted rules always expose desc / more link; expand by default except diff layout.
    const { showAnnotation: itemShowAnnotation, moreBtnLink } =
      resolveAuditResultExpandProps(enriched, fallbackDbType, true);
    const key = `${item.rule_name ?? ''}${item.message ?? ''}-${index}`;

    if (layout === 'report') {
      if (shouldShowExemptedActions) {
        return (
          <div className="result-item" key={key}>
            <ExemptedAuditResultWithActions
              skippedItem={enriched}
              displayMode="ruleDesc"
              showAnnotation={itemShowAnnotation}
              isRuleDeleted={enriched.isRuleDeleted}
              moreBtnLink={moreBtnLink}
              defaultAnnotationExpanded={defaultAnnotationExpanded}
            />
          </div>
        );
      }

      return (
        <AuditResultMessage
          styleClass="result-item"
          key={key}
          auditResult={payload}
          displayMode="ruleDesc"
          showAnnotation={itemShowAnnotation}
          isRuleDeleted={enriched.isRuleDeleted}
          moreBtnLink={moreBtnLink}
          defaultAnnotationExpanded={defaultAnnotationExpanded}
        />
      );
    }

    if (renderAuditResultItem) {
      return renderAuditResultItem(payload as IAuditResultItem, index, {
        showExemptedActions: true
      });
    }

    return (
      <div className="diff-item" key={key}>
        <ExemptedAuditResultWithActions
          skippedItem={enriched}
          displayMode="ruleDesc"
          showAnnotation={itemShowAnnotation}
          isRuleDeleted={enriched.isRuleDeleted}
          moreBtnLink={moreBtnLink}
          defaultAnnotationExpanded={defaultAnnotationExpanded}
        />
      </div>
    );
  };

  const renderDiffItem = (
    item: IAuditResultItem,
    index: number,
    options?: {
      showRuleExceptionActions?: boolean;
      showExemptedActions?: boolean;
    }
  ) => {
    if (renderAuditResultItem) {
      return renderAuditResultItem(item, index, options);
    }

    const ruleName = item.rule_name ?? '';
    const key = `${ruleName}${item.message ?? ''}-${index}`;
    const {
      auditResult: auditResultPayload,
      moreBtnLink,
      showAnnotation: itemShowAnnotation,
      isRuleDeleted
    } = getAuditResultViewProps(item);

    if (options?.showRuleExceptionActions) {
      return (
        <div className="diff-item" key={key}>
          <AuditResultWithRuleException
            auditResult={auditResultPayload}
            sqlManageContext={sqlManageContext}
            status={status}
            onRefresh={onRefresh}
            onOpenCreateException={onOpenCreateException}
            displayMode="ruleDesc"
            showAnnotation={itemShowAnnotation}
            isRuleDeleted={isRuleDeleted}
            moreBtnLink={moreBtnLink}
            defaultAnnotationExpanded={defaultAnnotationExpanded}
          />
        </div>
      );
    }

    return (
      <div className="diff-item" key={key}>
        <AuditResultMessage
          auditResult={auditResultPayload}
          displayMode="ruleDesc"
          showAnnotation={itemShowAnnotation}
          isRuleDeleted={isRuleDeleted}
          moreBtnLink={moreBtnLink}
          defaultAnnotationExpanded={defaultAnnotationExpanded}
        />
      </div>
    );
  };

  const hasContent =
    fullSqlExemption || active.length > 0 || exempted.length > 0;

  if (!hasContent) {
    return (
      <AuditResultMessage styleClass="result-item" auditStatus={auditStatus} />
    );
  }

  return (
    <AuditResultExemptionPanelStyleWrapper>
      {fullSqlExemption ? (
        <AuditResultMessage styleClass="result-item" />
      ) : null}
      {active.length > 0 ? (
        <Space direction="vertical" size={8} className="full-width-element">
          {active.map((item, index) =>
            layout === 'report'
              ? renderReportItem(item as IAuditResultItem, index)
              : renderDiffItem(item as IAuditResultItem, index, {
                  showRuleExceptionActions
                })
          )}
        </Space>
      ) : null}
      {showExemptedSection ? (
        <CollapsibleExemptedSection
          layout={layout}
          title={
            layout === 'report'
              ? t('ruleException.tag.exempted')
              : t('sqlManagement.remediationCompare.diffSectionExempted')
          }
          count={exemptedSectionCount}
        >
          <Space direction="vertical" size={8} className="full-width-element">
            {fullSqlExemption && exempted.length === 0
              ? renderFullSqlExemptedItem('full-sql-exempted')
              : exempted.map((item, index) => {
                  const itemKey = `${item.rule_name ?? ''}${
                    item.message ?? ''
                  }-${index}`;

                  // 仅整句例外标记（无 rule_name + 通过等级）走 FullSqlExemptedResultItem；
                  // 智能扫描中空 rule_name 的真实 error 命中需按原等级展示。
                  if (
                    shouldRenderAsFullSqlExemptedItem(fullSqlExemption, item)
                  ) {
                    return renderFullSqlExemptedItem(
                      itemKey,
                      item.message ?? ''
                    );
                  }

                  return renderExemptedItem(item, index);
                })}
          </Space>
        </CollapsibleExemptedSection>
      ) : null}
    </AuditResultExemptionPanelStyleWrapper>
  );
};

export default AuditResultExemptionPanel;
