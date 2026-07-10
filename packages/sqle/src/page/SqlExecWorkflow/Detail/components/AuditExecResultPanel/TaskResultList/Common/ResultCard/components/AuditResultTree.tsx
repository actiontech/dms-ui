import {
  IAuditResult,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';
import type { DataNode } from 'antd/es/tree';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import AuditResultMessage from '../../../../../../../../../components/AuditResultMessage';
import ExemptedAuditResultWithActions from '../../../../../../../../../components/RuleException/ExemptedAuditResultWithActions';
import FullSqlExemptedResultItem from '../../../../../../../../../components/RuleException/FullSqlExemptedResultItem';
import { IAuditResultItem } from '../../../../../../../../../components/ReportDrawer/index.type';
import useAuditResultRuleInfo from '../../../../../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import {
  buildAuditResultDisplayBuckets,
  isFullSqlExemption,
  shouldRenderAsFullSqlExemptedItem,
  resolvePrimaryExceptionId
} from '../../../../../../../../../page/RuleException/index.data';
import {
  buildAuditResultDisplayPayload,
  enrichSkippedRuleExceptionItem,
  resolveAuditResultExpandProps
} from '../../../../../../../../../components/AuditResultMessage/auditResultDisplay';
import { TaskAuditResultTreeStyleWrapper } from './style';
import { DownOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

export interface AuditResultTreeProps {
  auditResult?: IAuditResult[];
  skippedByRuleException?: ISkippedByRuleExceptionItem[];
  auditLevel?: string;
  dbType?: string;
}

const AuditResultTree: React.FC<AuditResultTreeProps> = ({
  auditResult,
  skippedByRuleException,
  dbType
}) => {
  const { t } = useTranslation();

  const { auditResultRuleInfo, loading, ruleInfo } = useAuditResultRuleInfo(
    auditResult ?? [],
    dbType,
    skippedByRuleException
  );

  const { active, exempted } = useMemo(
    () =>
      buildAuditResultDisplayBuckets(
        auditResultRuleInfo,
        skippedByRuleException ?? []
      ),
    [auditResultRuleInfo, skippedByRuleException]
  );

  const fullSqlExemption = useMemo(
    () =>
      isFullSqlExemption({
        audit_result: auditResult,
        skipped_by_rule_exception: skippedByRuleException
      }),
    [auditResult, skippedByRuleException]
  );

  const showExemptedSection = exempted.length > 0 || fullSqlExemption;
  const showActivePass =
    active.length === 0 && (fullSqlExemption || exempted.length > 0);

  const fullSqlExceptionId = useMemo(
    () => resolvePrimaryExceptionId(skippedByRuleException),
    [skippedByRuleException]
  );

  const resolveFullSqlExemptedMessage = () =>
    skippedByRuleException?.[0]?.message ?? '';

  const renderActiveAuditResultItem = (
    item: IAuditResultItem,
    index: number
  ) => {
    const auditResultPayload = buildAuditResultDisplayPayload(item);
    const key = `${item.rule_name ?? ''}${item.message ?? ''}-${index}`;
    const { moreBtnLink } = resolveAuditResultExpandProps(item, dbType, true);

    return (
      <AuditResultMessage
        styleClass="result-item"
        key={key}
        auditResult={auditResultPayload}
        displayMode="ruleDesc"
        showAnnotation
        isRuleDeleted={item.isRuleDeleted}
        moreBtnLink={moreBtnLink}
      />
    );
  };

  const renderExemptedAuditResultItem = (
    item: ISkippedByRuleExceptionItem,
    index: number
  ) => {
    const enriched = enrichSkippedRuleExceptionItem(item, ruleInfo, {
      fallbackDbType: dbType
    });
    const key = `${item.rule_name ?? ''}${item.message ?? ''}-${index}`;
    const { moreBtnLink } = resolveAuditResultExpandProps(
      enriched,
      dbType,
      true
    );

    return (
      <ExemptedAuditResultWithActions
        key={key}
        skippedItem={enriched}
        displayMode="ruleDesc"
        showAnnotation
        isRuleDeleted={enriched.isRuleDeleted}
        moreBtnLink={moreBtnLink}
        defaultAnnotationExpanded
      />
    );
  };

  const renderFullSqlExemptedItem = (key: string, message?: string) => (
    <FullSqlExemptedResultItem
      key={key}
      message={message ?? resolveFullSqlExemptedMessage()}
      exceptionId={fullSqlExceptionId}
      showViewDetailAction={fullSqlExceptionId != null}
    />
  );

  const treeData = useMemo<DataNode[]>(() => {
    const auditResultTitle = (
      <span className="audit-result-tree-title">
        {t('execWorkflow.audit.table.auditResult')}
      </span>
    );
    const exemptedTitle = (
      <span className="audit-result-tree-title">
        {t('ruleException.tag.exempted')}
      </span>
    );

    const hasAuditContent =
      (auditResult?.length ?? 0) > 0 ||
      (skippedByRuleException?.length ?? 0) > 0;

    if (!hasAuditContent) {
      return [
        {
          title: auditResultTitle,
          key: 'audit_tree_title',
          children: [
            {
              title: '-',
              key: 'empty_tree',
              isLeaf: true
            }
          ]
        }
      ];
    }

    const auditResultChildren: DataNode[] = loading
      ? [
          {
            title: <Spin size="small" />,
            key: 'audit_loading',
            isLeaf: true
          }
        ]
      : showActivePass
      ? [
          {
            title: <AuditResultMessage styleClass="result-item" />,
            key: 'audit_pass',
            isLeaf: true
          }
        ]
      : active.map((item, index) => ({
          title: renderActiveAuditResultItem(item as IAuditResultItem, index),
          key: `active_${index}`,
          isLeaf: true
        }));

    const nodes: DataNode[] = [
      {
        title: auditResultTitle,
        key: 'audit_tree_title',
        children: auditResultChildren.length
          ? auditResultChildren
          : [
              {
                title: '-',
                key: 'empty_tree',
                isLeaf: true
              }
            ]
      }
    ];

    if (showExemptedSection) {
      const exemptedChildren: DataNode[] =
        fullSqlExemption && exempted.length === 0
          ? [
              {
                title: renderFullSqlExemptedItem('full-sql-exempted'),
                key: 'full_sql_exempted',
                isLeaf: true
              }
            ]
          : exempted.map((item, index) => {
              const itemKey = `${item.rule_name ?? ''}${
                item.message ?? ''
              }-${index}`;

              // 仅整句例外标记（无 rule_name + 通过等级）走 FullSqlExemptedResultItem；
              // 智能扫描中空 rule_name 的真实 error 命中需按原等级展示。
              if (shouldRenderAsFullSqlExemptedItem(fullSqlExemption, item)) {
                return {
                  title: renderFullSqlExemptedItem(itemKey, item.message ?? ''),
                  key: `exempted_${index}`,
                  isLeaf: true
                };
              }

              return {
                title: renderExemptedAuditResultItem(item, index),
                key: `exempted_${index}`,
                isLeaf: true
              };
            });

      nodes.push({
        title: exemptedTitle,
        key: 'exempted_tree_title',
        children: exemptedChildren
      });
    }

    return nodes;
  }, [
    active,
    auditResult,
    exempted,
    fullSqlExemption,
    loading,
    showActivePass,
    showExemptedSection,
    fullSqlExceptionId,
    skippedByRuleException,
    ruleInfo,
    dbType,
    t
  ]);

  return (
    <TaskAuditResultTreeStyleWrapper
      showLine
      switcherIcon={
        <CommonIconStyleWrapper className="custom-icon custom-icon-arrow-down">
          <DownOutlined width={16} height={16} />
        </CommonIconStyleWrapper>
      }
      defaultExpandedKeys={['audit_tree_title', 'exempted_tree_title']}
      treeData={treeData}
      selectable={false}
    />
  );
};

export default AuditResultTree;
