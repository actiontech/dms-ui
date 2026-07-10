import { useMemo, useState } from 'react';
import { Alert, Empty, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { DownOutlined, RightOutlined } from '@actiontech/icons';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import AuditResultMessage from '../AuditResultMessage';
import useAuditResultRuleInfo from '../ReportDrawer/useAuditResultRuleInfo';
import {
  buildAuditResultDisplayPayload,
  enrichSkippedRuleExceptionItem,
  mergeAuditResultsForRuleLookup,
  resolveAuditResultExpandProps
} from '../AuditResultMessage/auditResultDisplay';
import {
  IAuditResult,
  ISkippedByRuleExceptionItem,
  ISqlManageRemediation
} from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditResultItem } from '../ReportDrawer/index.type';
import {
  isFullSqlExemption,
  resolveDbTypeFromAuditResults
} from '../../page/RuleException/index.data';
import { ISqlManageRuleExceptionContext } from '../../page/RuleException/index.data';
import AuditResultWithRuleException from '../RuleException/AuditResultWithRuleException';
import ExemptedAuditResultWithActions from '../RuleException/ExemptedAuditResultWithActions';
import CollapsibleExemptedSection from '../RuleException/AuditResultExemptionPanel/CollapsibleExemptedSection';
import { OpenCreateAuditWhitelistExceptionParams } from '../RuleException/AddRuleExceptionButton';
import { RemediationDiffCompareStyleWrapper } from './style';

type RemediationDiffCompareProps = {
  data?: ISqlManageRemediation;
  sqlManageId?: number | string;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRefresh?: () => void;
  onOpenCreateException?: (
    params: OpenCreateAuditWhitelistExceptionParams
  ) => void;
};

type DiffSectionVariant = 'optimized' | 'new' | 'unchanged' | 'exempted';

type DiffAuditResultListProps = {
  auditResult: IAuditResult[];
  optimizedRuleNames?: Set<string>;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRefresh?: () => void;
  showRuleExceptionActions?: boolean;
  enrichAuditResultItem?: ReturnType<
    typeof useAuditResultRuleInfo
  >['enrichAuditResultItem'];
  fallbackDbType?: string;
  onOpenCreateException?: (
    params: OpenCreateAuditWhitelistExceptionParams
  ) => void;
};

type DiffExemptedResultListProps = {
  skippedByRuleException: ISkippedByRuleExceptionItem[];
  sqlManageContext?: ISqlManageRuleExceptionContext;
  onRefresh?: () => void;
  fallbackDbType?: string;
  enrichSkippedItem?: ReturnType<
    typeof useAuditResultRuleInfo
  >['enrichSkippedItem'];
};

type DiffSectionProps = {
  title: string;
  variant: DiffSectionVariant;
  auditResult: IAuditResult[];
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRefresh?: () => void;
  showRuleExceptionActions?: boolean;
  enrichAuditResultItem?: ReturnType<
    typeof useAuditResultRuleInfo
  >['enrichAuditResultItem'];
  fallbackDbType?: string;
  onOpenCreateException?: (
    params: OpenCreateAuditWhitelistExceptionParams
  ) => void;
};

const ruleNameSet = (rules?: IAuditResult[]) =>
  new Set(
    (rules ?? [])
      .map((rule) => rule.rule_name ?? '')
      .filter((ruleName) => !!ruleName)
  );

const filterAuditResultsByRuleNames = (
  auditResult: IAuditResult[] | undefined,
  ruleNames: Set<string>
) => {
  return (auditResult ?? []).filter((item) => {
    const ruleName = item.rule_name ?? '';
    return ruleName && ruleNames.has(ruleName);
  });
};

const groupAuditResults = (
  auditResult: IAuditResult[] | undefined,
  highlightedRuleNames: Set<string>
) => {
  const highlighted: IAuditResult[] = [];
  const unchanged: IAuditResult[] = [];

  for (const item of auditResult ?? []) {
    const ruleName = item.rule_name ?? '';
    if (ruleName && highlightedRuleNames.has(ruleName)) {
      highlighted.push(item);
    } else {
      unchanged.push(item);
    }
  }

  return { highlighted, unchanged };
};

const DiffAuditResultList: React.FC<DiffAuditResultListProps> = ({
  auditResult,
  optimizedRuleNames,
  sqlManageContext,
  status,
  onRefresh,
  showRuleExceptionActions,
  enrichAuditResultItem,
  fallbackDbType,
  onOpenCreateException
}) => {
  return (
    <Space direction="vertical" size={8} className="full-width-element">
      {auditResult.map((item, index) => {
        const ruleName = item.rule_name ?? '';
        const isOptimized = ruleName && optimizedRuleNames?.has(ruleName);
        const displayItem = (enrichAuditResultItem?.(item) ??
          item) as IAuditResultItem;
        const auditResultPayload = buildAuditResultDisplayPayload(displayItem);
        const { showAnnotation: itemShowAnnotation, moreBtnLink } =
          resolveAuditResultExpandProps(displayItem, fallbackDbType, true);

        return (
          <div
            key={`${ruleName}${item.message ?? ''}-${index}`}
            className={
              isOptimized ? 'diff-item diff-item-optimized' : 'diff-item'
            }
          >
            {showRuleExceptionActions ? (
              <AuditResultWithRuleException
                auditResult={auditResultPayload}
                sqlManageContext={sqlManageContext}
                status={status}
                onRefresh={onRefresh}
                onOpenCreateException={onOpenCreateException}
                displayMode="ruleDesc"
                showAnnotation={itemShowAnnotation}
                isRuleDeleted={displayItem.isRuleDeleted}
                moreBtnLink={moreBtnLink}
                defaultAnnotationExpanded={false}
              />
            ) : (
              <AuditResultMessage
                auditResult={auditResultPayload}
                displayMode="ruleDesc"
                showAnnotation={itemShowAnnotation}
                isRuleDeleted={displayItem.isRuleDeleted}
                moreBtnLink={moreBtnLink}
                defaultAnnotationExpanded={false}
              />
            )}
          </div>
        );
      })}
    </Space>
  );
};

const DiffExemptedResultList: React.FC<DiffExemptedResultListProps> = ({
  skippedByRuleException,
  sqlManageContext,
  onRefresh,
  fallbackDbType,
  enrichSkippedItem
}) => {
  return (
    <Space direction="vertical" size={8} className="full-width-element">
      {skippedByRuleException.map((item, index) => {
        const enriched =
          enrichSkippedItem?.(item) ??
          enrichSkippedRuleExceptionItem(item, undefined, {
            fallbackDbType
          });
        const { showAnnotation: itemShowAnnotation, moreBtnLink } =
          resolveAuditResultExpandProps(enriched, fallbackDbType, true);

        return (
          <div
            key={`${item.rule_name ?? ''}${item.message ?? ''}-${index}`}
            className="diff-item"
          >
            <ExemptedAuditResultWithActions
              skippedItem={enriched}
              displayMode="ruleDesc"
              showAnnotation={itemShowAnnotation}
              isRuleDeleted={enriched.isRuleDeleted}
              moreBtnLink={moreBtnLink}
              defaultAnnotationExpanded={false}
            />
          </div>
        );
      })}
    </Space>
  );
};

const DiffFirstAuditPanel: React.FC<{
  auditResult: IAuditResult[];
  optimizedRuleNames: Set<string>;
  enrichAuditResultItem?: ReturnType<
    typeof useAuditResultRuleInfo
  >['enrichAuditResultItem'];
  fallbackDbType?: string;
}> = ({
  auditResult,
  optimizedRuleNames,
  enrichAuditResultItem,
  fallbackDbType
}) => {
  if (!auditResult.length) {
    return <AuditResultMessage />;
  }

  return (
    <div className="diff-section diff-section-unchanged">
      <div className="diff-section-body diff-section-body-standalone">
        <DiffAuditResultList
          auditResult={auditResult}
          optimizedRuleNames={optimizedRuleNames}
          enrichAuditResultItem={enrichAuditResultItem}
          fallbackDbType={fallbackDbType}
        />
      </div>
    </div>
  );
};

const DiffSection: React.FC<DiffSectionProps> = ({
  title,
  variant,
  auditResult,
  sqlManageContext,
  status,
  onRefresh,
  showRuleExceptionActions,
  enrichAuditResultItem,
  fallbackDbType,
  onOpenCreateException
}) => {
  const [expanded, setExpanded] = useState(true);

  if (!auditResult.length) {
    return null;
  }

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={`diff-section diff-section-${variant}${
        !expanded ? ' diff-section-collapsed' : ''
      }`}
    >
      <div
        className="diff-section-header diff-section-header-collapsible"
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleExpanded();
          }
        }}
      >
        <div className="diff-section-header-main">
          {expanded ? (
            <DownOutlined className="diff-section-chevron" />
          ) : (
            <RightOutlined className="diff-section-chevron" />
          )}
          <Typography.Text className="diff-section-title">
            {title}
          </Typography.Text>
        </div>
        <Typography.Text type="secondary" className="diff-section-count">
          {auditResult.length}
        </Typography.Text>
      </div>
      {expanded && (
        <div className="diff-section-body">
          <DiffAuditResultList
            auditResult={auditResult}
            sqlManageContext={sqlManageContext}
            status={status}
            onRefresh={onRefresh}
            showRuleExceptionActions={showRuleExceptionActions}
            enrichAuditResultItem={enrichAuditResultItem}
            fallbackDbType={fallbackDbType}
            onOpenCreateException={onOpenCreateException}
          />
        </div>
      )}
    </div>
  );
};

const RemediationDiffCompare: React.FC<RemediationDiffCompareProps> = ({
  data,
  sqlManageId,
  sqlManageContext,
  status,
  onRefresh,
  onOpenCreateException
}) => {
  const { t } = useTranslation();

  const resolvedSqlManageContext = useMemo(() => {
    if (sqlManageContext?.sql_fingerprint) {
      return sqlManageContext;
    }
    if (data?.sql_fingerprint) {
      return { sql_fingerprint: data.sql_fingerprint };
    }
    return undefined;
  }, [data?.sql_fingerprint, sqlManageContext]);

  const fallbackDbType = useMemo(
    () =>
      resolveDbTypeFromAuditResults(
        mergeAuditResultsForRuleLookup(
          data?.latest_audit_result,
          data?.first_audit_result
        )
      ) ?? resolvedSqlManageContext?.db_type,
    [
      data?.first_audit_result,
      data?.latest_audit_result,
      resolvedSqlManageContext?.db_type
    ]
  );

  const auditResultsForRuleLookup = useMemo(
    () =>
      mergeAuditResultsForRuleLookup(
        data?.first_audit_result,
        data?.latest_audit_result
      ),
    [data?.first_audit_result, data?.latest_audit_result]
  );

  const { enrichAuditResultItem, enrichSkippedItem } = useAuditResultRuleInfo(
    auditResultsForRuleLookup,
    fallbackDbType,
    data?.skipped_by_rule_exception
  );

  const fullSqlExemption = useMemo(() => {
    const skipped = data?.skipped_by_rule_exception ?? [];
    const latest = data?.latest_audit_result ?? [];

    return isFullSqlExemption({
      audit_result: latest,
      skipped_by_rule_exception: skipped
    });
  }, [data?.latest_audit_result, data?.skipped_by_rule_exception]);

  const { removedRuleNames, addedRuleNames } = useMemo(
    () => ({
      removedRuleNames: ruleNameSet(data?.rule_diff?.resolved),
      addedRuleNames: ruleNameSet(data?.rule_diff?.new)
    }),
    [data?.rule_diff?.new, data?.rule_diff?.resolved]
  );

  const { optimizedResults, latestNew, latestUnchanged, latestExempted } =
    useMemo(() => {
      const latestGrouped = groupAuditResults(
        data?.latest_audit_result,
        addedRuleNames
      );

      return {
        optimizedResults: filterAuditResultsByRuleNames(
          data?.first_audit_result,
          removedRuleNames
        ),
        latestNew: latestGrouped.highlighted,
        latestUnchanged: fullSqlExemption ? [] : latestGrouped.unchanged,
        latestExempted: data?.skipped_by_rule_exception ?? []
      };
    }, [
      addedRuleNames,
      data?.first_audit_result,
      data?.latest_audit_result,
      data?.skipped_by_rule_exception,
      fullSqlExemption,
      removedRuleNames
    ]);

  const firstAuditResults = data?.first_audit_result ?? [];

  if (!data) {
    return <Empty />;
  }

  const hasLatestSections =
    optimizedResults.length > 0 ||
    latestNew.length > 0 ||
    latestUnchanged.length > 0 ||
    latestExempted.length > 0;

  const firstAuditMissing =
    !data.first_audit_time && firstAuditResults.length === 0;

  return (
    <RemediationDiffCompareStyleWrapper>
      {firstAuditMissing && (
        <Alert
          type="warning"
          showIcon
          message={t('sqlManagement.remediationCompare.firstAuditMissing')}
        />
      )}
      <div className="diff-columns">
        <section className="diff-column">
          <div className="diff-column-header">
            <Typography.Title level={5} className="diff-column-title">
              {t('sqlManagement.remediationCompare.firstAuditResult')}
            </Typography.Title>
            <Typography.Text
              type="secondary"
              className="diff-column-audit-time"
            >
              {t('sqlManagement.remediationCompare.auditTime', {
                time: formatTime(data.first_audit_time, '-')
              })}
            </Typography.Text>
          </div>
          <DiffFirstAuditPanel
            auditResult={firstAuditResults}
            optimizedRuleNames={removedRuleNames}
            enrichAuditResultItem={enrichAuditResultItem}
            fallbackDbType={fallbackDbType}
          />
        </section>
        <section className="diff-column">
          <div className="diff-column-header">
            <Typography.Title level={5} className="diff-column-title">
              {t('sqlManagement.remediationCompare.latestAuditResult')}
            </Typography.Title>
            <Typography.Text
              type="secondary"
              className="diff-column-audit-time"
            >
              {t('sqlManagement.remediationCompare.auditTime', {
                time: formatTime(data.latest_audit_time, '-')
              })}
            </Typography.Text>
          </div>
          {hasLatestSections ? (
            <Space
              direction="vertical"
              size={12}
              className="full-width-element"
            >
              <DiffSection
                title={t('sqlManagement.remediationCompare.diffSectionNew')}
                variant="new"
                auditResult={latestNew}
                sqlManageContext={resolvedSqlManageContext}
                status={status}
                onRefresh={onRefresh}
                showRuleExceptionActions
                enrichAuditResultItem={enrichAuditResultItem}
                fallbackDbType={fallbackDbType}
                onOpenCreateException={onOpenCreateException}
              />
              <DiffSection
                title={t(
                  'sqlManagement.remediationCompare.diffSectionOptimized'
                )}
                variant="optimized"
                auditResult={optimizedResults}
              />
              <DiffSection
                title={t(
                  'sqlManagement.remediationCompare.diffSectionUnchanged'
                )}
                variant="unchanged"
                auditResult={latestUnchanged}
                sqlManageContext={resolvedSqlManageContext}
                status={status}
                onRefresh={onRefresh}
                showRuleExceptionActions
                enrichAuditResultItem={enrichAuditResultItem}
                fallbackDbType={fallbackDbType}
                onOpenCreateException={onOpenCreateException}
              />
              <CollapsibleExemptedSection
                layout="diff"
                title={t(
                  'sqlManagement.remediationCompare.diffSectionExempted'
                )}
                count={latestExempted.length}
              >
                <DiffExemptedResultList
                  skippedByRuleException={latestExempted}
                  sqlManageContext={resolvedSqlManageContext}
                  onRefresh={onRefresh}
                  fallbackDbType={fallbackDbType}
                  enrichSkippedItem={enrichSkippedItem}
                />
              </CollapsibleExemptedSection>
            </Space>
          ) : (
            <AuditResultMessage />
          )}
        </section>
      </div>
    </RemediationDiffCompareStyleWrapper>
  );
};

export default RemediationDiffCompare;
