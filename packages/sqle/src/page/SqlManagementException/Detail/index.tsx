import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Space, Spin, Typography, message } from 'antd';
import {
  BasicButton,
  BasicDrawer,
  BasicTag,
  SQLRenderer
} from '@actiontech/shared';
import { useRequest } from 'ahooks';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BlacklistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlManagementExceptionMatchTypeDirection } from '../index.data';
import { formatMatchMode, formatRuleScope } from '../../RuleException/utils';
import { blacklistRecordToExtended } from '../../RuleException/index.data';
import useRuleTips from '../../../hooks/useRuleTips';
import useAuditTaskSelectOptions from '../hooks/useAuditTaskSelectOptions';
import {
  buildAuditTaskNavigatePath,
  extractAuditTaskMatchInfo,
  findInstanceAuditPlanById,
  formatAuditTaskDisplayLabel,
  isAuditTaskIdMatchType
} from '../utils';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  DetailFieldCardStyleWrapper,
  DetailMetaInfoCardStyleWrapper,
  SqlManagementExceptionDetailStyleWrapper
} from './style';

export const SQL_MANAGEMENT_EXCEPTION_DETAIL_DRAWER_WIDTH = 960;

const SQL_SNIPPET_COLLAPSED_ROWS = 1;

type SqlManagementExceptionDetailDrawerProps = {
  open: boolean;
  blacklistId?: number;
  onClose: () => void;
  onEdit?: (record: IBlacklistResV1) => void;
  onDeleted?: () => void;
};

type DetailMetaInfoItemProps = {
  label: string;
  value: ReactNode;
};

const DetailMetaInfoItem: React.FC<DetailMetaInfoItemProps> = ({
  label,
  value
}) => (
  <div className="detail-meta-item">
    <div className="detail-meta-label">{label}</div>
    <div className="detail-meta-value">{value}</div>
  </div>
);

type DetailFieldCardProps = {
  label: string;
  labelExtra?: ReactNode;
  children?: ReactNode;
};

const DetailFieldCard: React.FC<DetailFieldCardProps> = ({
  label,
  labelExtra,
  children
}) => (
  <DetailFieldCardStyleWrapper>
    <div className="detail-field-header">
      <div className="detail-field-label">{label}</div>
      {labelExtra}
    </div>
    {children ? <div className="detail-field-value">{children}</div> : null}
  </DetailFieldCardStyleWrapper>
);

const getMatchTypeLabel = (type?: string) => {
  if (
    type &&
    Object.prototype.hasOwnProperty.call(
      SqlManagementExceptionMatchTypeDirection,
      type
    )
  ) {
    return SqlManagementExceptionMatchTypeDirection[
      type as keyof typeof SqlManagementExceptionMatchTypeDirection
    ];
  }
  return type ?? '-';
};

const MatchModeSqlValue: React.FC<{ sql?: string }> = ({ sql }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [sql]);

  if (!sql) {
    return <>-</>;
  }

  if (expanded) {
    return (
      <>
        <SQLRenderer sql={sql} showCopyIcon />
        <Typography.Link
          className="match-mode-sql-toggle"
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
      rows={SQL_SNIPPET_COLLAPSED_ROWS}
      showCopyIcon
      tooltip={false}
      highlightSyntax={false}
      paragraph={{
        ellipsis: {
          expandable: true,
          rows: SQL_SNIPPET_COLLAPSED_ROWS,
          symbol: t('common.expansion'),
          tooltip: false,
          onExpand: () => setExpanded(true)
        }
      }}
    />
  );
};

const renderMatchContent = (type?: string, content?: string) => {
  if (
    type === BlacklistResV1TypeEnum.sql ||
    type === BlacklistResV1TypeEnum.fp_sql
  ) {
    return <MatchModeSqlValue sql={content} />;
  }
  return content || '-';
};

const SqlManagementExceptionDetailDrawer: React.FC<
  SqlManagementExceptionDetailDrawerProps
> = ({ open, blacklistId, onClose, onEdit, onDeleted }) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName, projectID, projectArchive } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const canWrite = isAdmin || isProjectManager(projectName);
  const { ruleNameDescMap, updateRuleTips } = useRuleTips();
  const { getAuditTaskIdOptions, instanceAuditPlans } =
    useAuditTaskSelectOptions(projectName);

  const {
    data: detail,
    loading,
    run,
    mutate
  } = useRequest(
    (id: string) =>
      blacklist
        .getBlacklistByIDV1({
          project_name: projectName,
          blacklist_id: id
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
          throw new Error(res.data.message);
        }),
    { manual: true }
  );

  useEffect(() => {
    if (open && blacklistId) {
      run(`${blacklistId}`);
      updateRuleTips(projectName);
    }
    if (!open) {
      mutate(undefined);
    }
  }, [blacklistId, mutate, open, projectName, run, updateRuleTips]);

  const extendedDetail = detail ? blacklistRecordToExtended(detail) : undefined;

  const auditTaskMatchInfo = useMemo(
    () => (detail ? extractAuditTaskMatchInfo(detail) : undefined),
    [detail]
  );

  const auditTaskPlanOptions = useMemo(
    () => getAuditTaskIdOptions(auditTaskMatchInfo?.auditTaskType) ?? [],
    [auditTaskMatchInfo?.auditTaskType, getAuditTaskIdOptions]
  );

  const auditTaskDisplayName = useMemo(() => {
    if (!auditTaskMatchInfo?.auditTaskId) {
      return undefined;
    }
    const matchedOption = auditTaskPlanOptions.find(
      (option) => `${option?.value ?? ''}` === auditTaskMatchInfo.auditTaskId
    );
    if (matchedOption?.label && typeof matchedOption.label === 'string') {
      return matchedOption.label;
    }
    const plan = findInstanceAuditPlanById(
      instanceAuditPlans,
      auditTaskMatchInfo.auditTaskId
    );
    return formatAuditTaskDisplayLabel(plan, auditTaskMatchInfo.auditTaskId, t);
  }, [auditTaskMatchInfo, auditTaskPlanOptions, instanceAuditPlans, t]);

  const auditTaskNavigatePath = useMemo(
    () =>
      buildAuditTaskNavigatePath(
        projectID,
        auditTaskMatchInfo?.auditTaskType,
        auditTaskMatchInfo?.auditTaskId
      ),
    [auditTaskMatchInfo, projectID]
  );

  const matchModeItems = useMemo(() => {
    if (!detail) {
      return [];
    }
    return formatMatchMode(detail, getMatchTypeLabel).filter(
      (row) => !isAuditTaskIdMatchType(row.type)
    );
  }, [detail]);

  const formattedRuleScope = useMemo(() => {
    if (!detail) {
      return undefined;
    }
    return formatRuleScope(detail, ruleNameDescMap);
  }, [detail, ruleNameDescMap]);

  const onDelete = useCallback(() => {
    if (!blacklistId) {
      return;
    }
    const hide = messageApi.loading(
      t('sqlManagementException.operate.deleting')
    );
    blacklist
      .deleteBlackList({
        project_name: projectName,
        blacklist_id: `${blacklistId}`
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('sqlManagementException.operate.deleteSuccess'));
          EventEmitter.emit(EmitterKey.Refresh_Sql_management_Exception_List);
          onDeleted?.();
          onClose();
        }
      })
      .finally(() => hide());
  }, [blacklistId, messageApi, onClose, onDeleted, projectName, t]);

  const renderRuleScopeTag = () => {
    if (!formattedRuleScope) {
      return null;
    }
    const isAll =
      formattedRuleScope.mode === BlacklistResV1RuleScopeModeEnum.all;
    return (
      <BasicTag size="small">
        {isAll
          ? t('ruleException.ruleScope.all')
          : t('sqlManagementException.table.ruleScopePartial')}
      </BasicTag>
    );
  };

  const renderRuleScopeValue = () => {
    if (
      !formattedRuleScope ||
      formattedRuleScope.mode === BlacklistResV1RuleScopeModeEnum.all ||
      !formattedRuleScope.ruleLabels.length
    ) {
      return null;
    }
    return (
      <div className="detail-internal-list">
        {formattedRuleScope.ruleLabels.map((ruleLabel) => (
          <div
            key={ruleLabel}
            className="detail-internal-list-item rule-scope-list-item"
          >
            {ruleLabel}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        width={SQL_MANAGEMENT_EXCEPTION_DETAIL_DRAWER_WIDTH}
        open={open}
        onClose={onClose}
        title={t('ruleException.detail.title')}
        extra={
          canWrite && !projectArchive ? (
            <Space>
              <BasicButton onClick={onClose}>{t('common.close')}</BasicButton>
              <BasicButton
                onClick={() => detail && onEdit?.(detail)}
                disabled={!detail}
              >
                {t('common.edit')}
              </BasicButton>
              <BasicButton danger onClick={onDelete}>
                {t('common.delete')}
              </BasicButton>
            </Space>
          ) : (
            <BasicButton onClick={onClose}>{t('common.close')}</BasicButton>
          )
        }
      >
        <Spin spinning={loading}>
          {extendedDetail ? (
            <SqlManagementExceptionDetailStyleWrapper>
              <DetailMetaInfoCardStyleWrapper>
                <DetailMetaInfoItem
                  label={t('ruleException.detail.createdBy')}
                  value={extendedDetail.created_by || '-'}
                />
                <DetailMetaInfoItem
                  label={t('ruleException.detail.createdAt')}
                  value={formatTime(extendedDetail.created_at, '-')}
                />
                <DetailMetaInfoItem
                  label={t('ruleException.detail.matchedCount')}
                  value={extendedDetail.matched_count ?? '-'}
                />
                <DetailMetaInfoItem
                  label={t('ruleException.detail.lastMatchTime')}
                  value={formatTime(extendedDetail.last_match_time, '-')}
                />
              </DetailMetaInfoCardStyleWrapper>
              <DetailFieldCard label={t('ruleException.table.matchMode')}>
                {matchModeItems.length || auditTaskMatchInfo?.auditTaskId ? (
                  <div className="detail-internal-list">
                    {matchModeItems.map((row, index) => (
                      <div
                        key={`${row.type ?? 'row'}-${index}`}
                        className="detail-internal-list-item match-mode-item"
                      >
                        <div className="match-mode-item-label">
                          {row.typeLabel}
                        </div>
                        <div className="match-mode-item-value">
                          {renderMatchContent(row.type, row.content)}
                        </div>
                      </div>
                    ))}
                    {auditTaskMatchInfo?.auditTaskId ? (
                      <div className="detail-internal-list-item match-mode-item">
                        <div className="match-mode-item-label">
                          {t('sqlManagementException.detail.auditTaskName')}
                        </div>
                        <div className="match-mode-item-value">
                          {auditTaskNavigatePath ? (
                            <Link target="_blank" to={auditTaskNavigatePath}>
                              {auditTaskDisplayName}
                            </Link>
                          ) : (
                            <Typography.Text>
                              {auditTaskDisplayName}
                            </Typography.Text>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  '-'
                )}
              </DetailFieldCard>
              <DetailFieldCard
                label={t('ruleException.detail.ruleScope')}
                labelExtra={renderRuleScopeTag()}
              >
                {renderRuleScopeValue()}
              </DetailFieldCard>
              <DetailFieldCard label={t('ruleException.detail.reason')}>
                {extendedDetail.desc || '-'}
              </DetailFieldCard>
            </SqlManagementExceptionDetailStyleWrapper>
          ) : null}
        </Spin>
      </BasicDrawer>
    </>
  );
};

export default SqlManagementExceptionDetailDrawer;
