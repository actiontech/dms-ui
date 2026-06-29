import { useMemo, useState } from 'react';
import { Alert, Empty, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { DownOutlined, RightOutlined } from '@actiontech/icons';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import AuditResultMessage from '../AuditResultMessage';
import {
  IAuditResult,
  ISqlManageRemediation
} from '@actiontech/shared/lib/api/sqle/service/common';
import { RemediationDiffCompareStyleWrapper } from './style';

type RemediationDiffCompareProps = {
  data?: ISqlManageRemediation;
};

type DiffSectionVariant = 'optimized' | 'new' | 'unchanged';

type DiffAuditResultListProps = {
  auditResult: IAuditResult[];
  optimizedRuleNames?: Set<string>;
};

type DiffSectionProps = {
  title: string;
  variant: DiffSectionVariant;
  auditResult: IAuditResult[];
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
  optimizedRuleNames
}) => {
  return (
    <Space direction="vertical" size={8} className="full-width-element">
      {auditResult.map((item, index) => {
        const ruleName = item.rule_name ?? '';
        const isOptimized = ruleName && optimizedRuleNames?.has(ruleName);

        return (
          <div
            key={`${ruleName}${item.message ?? ''}-${index}`}
            className={
              isOptimized ? 'diff-item diff-item-optimized' : 'diff-item'
            }
          >
            <AuditResultMessage auditResult={item} />
          </div>
        );
      })}
    </Space>
  );
};

const DiffFirstAuditPanel: React.FC<{
  auditResult: IAuditResult[];
  optimizedRuleNames: Set<string>;
}> = ({ auditResult, optimizedRuleNames }) => {
  if (!auditResult.length) {
    return <AuditResultMessage />;
  }

  return (
    <div className="diff-section diff-section-unchanged">
      <div className="diff-section-body diff-section-body-standalone">
        <DiffAuditResultList
          auditResult={auditResult}
          optimizedRuleNames={optimizedRuleNames}
        />
      </div>
    </div>
  );
};

const DiffSection: React.FC<DiffSectionProps> = ({
  title,
  variant,
  auditResult
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
          <DiffAuditResultList auditResult={auditResult} />
        </div>
      )}
    </div>
  );
};

const RemediationDiffCompare: React.FC<RemediationDiffCompareProps> = ({
  data
}) => {
  const { t } = useTranslation();

  const { removedRuleNames, addedRuleNames } = useMemo(
    () => ({
      removedRuleNames: ruleNameSet(data?.rule_diff?.resolved),
      addedRuleNames: ruleNameSet(data?.rule_diff?.new)
    }),
    [data?.rule_diff?.new, data?.rule_diff?.resolved]
  );

  const { optimizedResults, latestNew, latestUnchanged } = useMemo(() => {
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
      latestUnchanged: latestGrouped.unchanged
    };
  }, [
    addedRuleNames,
    data?.first_audit_result,
    data?.latest_audit_result,
    removedRuleNames
  ]);

  const firstAuditResults = data?.first_audit_result ?? [];

  if (!data) {
    return <Empty />;
  }

  const hasLatestSections =
    optimizedResults.length > 0 ||
    latestNew.length > 0 ||
    latestUnchanged.length > 0;

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
              />
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
