import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Space, Spin, Tabs, message } from 'antd';
import { Dayjs } from 'dayjs';
import {
  BasicButton,
  BasicDatePicker,
  BasicSelect,
  PageHeader
} from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { LeftArrowOutlined } from '@actiontech/icons';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useInstance from '../../../hooks/useInstance';
import useSQLAuditRecordTag from '../../../hooks/useSQLAuditRecordTag';
import LevelHitSummary from '../Detail/LevelHitSummary';
import RuleHitDetails from '../Detail/RuleHitDetails';
import {
  buildAggregateRecordsParams,
  buildAggregateSqlsParams,
  buildAggregateSummaryParams,
  buildDraftFromLocationState,
  createDefaultDraftFilters,
  formatAuditTimeLabel,
  resolveRequestErrorMessage,
  sanitizeRecordsErrorMessage,
  serializeAggregateQueryParams,
  validateFiltersAuditTime,
  validateRecordIds
} from './index.data';
import type {
  AggregateDraftFilters,
  AggregateQuerySnapshot,
  AggregateScopeMode,
  AggregateScopeParams,
  AggregateSqlItem,
  AggregateSummaryView,
  SqlAuditAggregateLocationState
} from './index.type';
import {
  AggregateFilterStyleWrapper,
  AggregatePageStyleWrapper,
  AggregateResultStyleWrapper
} from './style';
import RecordIdsSelect from './RecordIdsSelect';
import SqlDetailTable from './SqlDetailTable';
import AggregateExportModal from './ExportModal';

const ALL_INSTANCE_VALUE = '__all__';
const DEFAULT_SQLS_PAGE_SIZE = 20;

const toCount = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

/**
 * 快捷审核汇总（AC-PAGE-001/002 + AC-RECORDS-001/002 选人器与 records 查询）。
 */
const SqlAuditAggregate = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { projectID, projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const locationState = location.state as
    | SqlAuditAggregateLocationState
    | null
    | undefined;

  const [draft, setDraft] = useState<AggregateDraftFilters>(() =>
    buildDraftFromLocationState(locationState)
  );
  const [hasQueried, setHasQueried] = useState(false);
  /** 条件相对最近一次查询已变更；结果区失效、导出禁用 */
  const [isDirty, setIsDirty] = useState(false);
  const [querySnapshot, setQuerySnapshot] =
    useState<AggregateQuerySnapshot | null>(null);
  const [scopeParams, setScopeParams] = useState<AggregateScopeParams | null>(
    null
  );

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<AggregateSummaryView | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [sqlsLoading, setSqlsLoading] = useState(false);
  const [sqlsList, setSqlsList] = useState<AggregateSqlItem[]>([]);
  const [sqlsTotal, setSqlsTotal] = useState(0);
  const [sqlsError, setSqlsError] = useState<string | null>(null);
  const [sqlsPageIndex, setSqlsPageIndex] = useState(1);
  const [sqlsPageSize, setSqlsPageSize] = useState(DEFAULT_SQLS_PAGE_SIZE);
  const [contentTab, setContentTab] = useState<'sql' | 'rules'>('sql');
  const [exportOpen, setExportOpen] = useState(false);

  const scopeParamsRef = useRef<AggregateScopeParams | null>(null);
  scopeParamsRef.current = scopeParams;
  const hasQueriedRef = useRef(false);
  hasQueriedRef.current = hasQueried;

  const { instanceIDOptions, updateInstanceList } = useInstance();
  const {
    auditRecordTagsOptions,
    updateSQLAuditRecordTag,
    loading: tagsLoading
  } = useSQLAuditRecordTag();

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateSQLAuditRecordTag(projectName);
  }, [projectName, updateInstanceList, updateSQLAuditRecordTag]);

  const scopeModeOptions = useMemo(
    () => [
      {
        label: t('sqlAudit.aggregate.scopeMode.filters'),
        value: 'filters' as AggregateScopeMode
      },
      {
        label: t('sqlAudit.aggregate.scopeMode.records'),
        value: 'records' as AggregateScopeMode
      }
    ],
    [t]
  );

  const instanceOptions = useMemo(
    () => [
      {
        label: t('sqlAudit.aggregate.filter.allInstances'),
        value: ALL_INSTANCE_VALUE
      },
      ...instanceIDOptions.flatMap((group) =>
        (group.options ?? []).map((opt) => ({
          label: opt.label,
          value: String(opt.value)
        }))
      )
    ],
    [instanceIDOptions, t]
  );

  const resolveInstanceLabel = useCallback(
    (instanceId?: string) => {
      if (instanceId === undefined || instanceId === '') {
        return t('sqlAudit.aggregate.filter.allInstances');
      }
      const found = instanceOptions.find((opt) => opt.value === instanceId);
      return found?.label ?? instanceId;
    },
    [instanceOptions, t]
  );

  const resolveTagsLabel = useCallback(
    (tags: string[]) => {
      if (!tags.length) {
        return t('sqlAudit.aggregate.filter.allTags');
      }
      return tags.join('、');
    },
    [t]
  );

  /** AC-PAGE-002：条件变脏 → 结果立即失效、导出禁用 */
  const invalidateResults = useCallback(() => {
    if (!hasQueriedRef.current) {
      return;
    }
    setIsDirty(true);
    setSummary(null);
    setSummaryError(null);
    setSummaryLoading(false);
    setSqlsList([]);
    setSqlsTotal(0);
    setSqlsError(null);
    setSqlsLoading(false);
    setScopeParams(null);
    setQuerySnapshot(null);
    setSqlsPageIndex(1);
    setSqlsPageSize(DEFAULT_SQLS_PAGE_SIZE);
  }, []);

  const onModeChange = useCallback(
    (value: AggregateScopeMode) => {
      setDraft((prev) => ({ ...prev, mode: value }));
      invalidateResults();
    },
    [invalidateResults]
  );

  const onAuditTimeStartChange = useCallback(
    (value: Dayjs | null) => {
      if (!value) {
        return;
      }
      setDraft((prev) => {
        const end = prev.auditTime?.[1] ?? value;
        return { ...prev, auditTime: [value, end] };
      });
      invalidateResults();
    },
    [invalidateResults]
  );

  const onAuditTimeEndChange = useCallback(
    (value: Dayjs | null) => {
      if (!value) {
        return;
      }
      setDraft((prev) => {
        const start = prev.auditTime?.[0] ?? value;
        return { ...prev, auditTime: [start, value] };
      });
      invalidateResults();
    },
    [invalidateResults]
  );

  const tagsTriggerLabel = useMemo(() => {
    const tags = draft.tags;
    if (!tags.length) {
      return t('sqlAudit.aggregate.filter.allTags');
    }
    if (tags.length <= 2) {
      return tags.join('、');
    }
    return t('sqlAudit.aggregate.filter.selectedTagsCount', {
      count: tags.length
    });
  }, [draft.tags, t]);

  const onInstanceChange = useCallback(
    (value: string) => {
      // 雪花 ID 禁止 Number()：19 位会丢精度 → 裸 ID 展示 + 筛选结果为 0
      setDraft((prev) => ({
        ...prev,
        instanceId:
          !value || value === ALL_INSTANCE_VALUE ? undefined : String(value)
      }));
      invalidateResults();
    },
    [invalidateResults]
  );

  const onTagsChange = useCallback(
    (values: string[]) => {
      setDraft((prev) => ({ ...prev, tags: values ?? [] }));
      invalidateResults();
    },
    [invalidateResults]
  );

  const onRecordIdsChange = useCallback(
    (ids: string[]) => {
      setDraft((prev) => ({ ...prev, recordIds: ids }));
      invalidateResults();
    },
    [invalidateResults]
  );

  const onRecordIdsOverLimit = useCallback(() => {
    messageApi.warning(t('sqlAudit.aggregate.validate.recordsOverLimit'));
  }, [messageApi, t]);

  const onReset = useCallback(() => {
    setDraft(createDefaultDraftFilters());
    invalidateResults();
  }, [invalidateResults]);

  const resolveScopeErrorMessage = useCallback(
    (
      params: AggregateScopeParams,
      raw: string | undefined,
      fallback: string
    ) => {
      if (params.scope_type === 'records') {
        // AC-RECORDS-002：页面统一泛化提示，不回显具体 ID/分类/SQL 细节
        return sanitizeRecordsErrorMessage(
          raw,
          params.filter_audit_record_ids ?? [],
          t('sqlAudit.aggregate.result.recordsRejected')
        );
      }
      return (raw ?? '').trim() || fallback;
    },
    [t]
  );

  const aggregateRequestOptions = useMemo(
    () => ({
      paramsSerializer: serializeAggregateQueryParams
    }),
    []
  );

  const loadSummary = useCallback(
    async (params: AggregateScopeParams) => {
      setSummaryLoading(true);
      setSummaryError(null);
      try {
        const res = await sql_audit_record.getSQLAuditRecordAggregateSummaryV1(
          params,
          aggregateRequestOptions
        );
        if (res.data.code === ResponseCode.SUCCESS && res.data.data) {
          setSummary(res.data.data);
          setSummaryError(null);
        } else {
          setSummary(null);
          setSummaryError(
            resolveScopeErrorMessage(
              params,
              res.data.message,
              t('sqlAudit.aggregate.result.loadFailed')
            )
          );
        }
      } catch (err) {
        setSummary(null);
        setSummaryError(
          resolveScopeErrorMessage(
            params,
            resolveRequestErrorMessage(err, ''),
            t('sqlAudit.aggregate.result.loadFailed')
          )
        );
      } finally {
        setSummaryLoading(false);
      }
    },
    [aggregateRequestOptions, resolveScopeErrorMessage, t]
  );

  const loadSqls = useCallback(
    async (
      params: AggregateScopeParams,
      pageIndex: number,
      pageSize: number
    ) => {
      setSqlsLoading(true);
      setSqlsError(null);
      try {
        const res = await sql_audit_record.getSQLAuditRecordAggregateSqlsV1(
          buildAggregateSqlsParams(params, pageIndex, pageSize),
          aggregateRequestOptions
        );
        if (res.data.code === ResponseCode.SUCCESS) {
          setSqlsList(res.data.data ?? []);
          setSqlsTotal(
            typeof res.data.total_nums === 'number' ? res.data.total_nums : 0
          );
          setSqlsPageIndex(pageIndex);
          setSqlsPageSize(pageSize);
          setSqlsError(null);
        } else {
          setSqlsList([]);
          setSqlsTotal(0);
          setSqlsError(
            resolveScopeErrorMessage(
              params,
              res.data.message,
              t('sqlAudit.aggregate.result.sqlsLoadFailed')
            )
          );
        }
      } catch (err) {
        setSqlsList([]);
        setSqlsTotal(0);
        setSqlsError(
          resolveScopeErrorMessage(
            params,
            resolveRequestErrorMessage(err, ''),
            t('sqlAudit.aggregate.result.sqlsLoadFailed')
          )
        );
      } finally {
        setSqlsLoading(false);
      }
    },
    [aggregateRequestOptions, resolveScopeErrorMessage, t]
  );

  const onQuery = useCallback(async () => {
    let params: AggregateScopeParams;
    let snapshot: AggregateQuerySnapshot;

    if (draft.mode === 'records') {
      const recordsCheck = validateRecordIds(draft.recordIds);
      if (!recordsCheck.ok) {
        messageApi.warning(
          t(
            recordsCheck.reason === 'overlimit'
              ? 'sqlAudit.aggregate.validate.recordsOverLimit'
              : 'sqlAudit.aggregate.validate.recordsRequired'
          )
        );
        return;
      }
      params = buildAggregateRecordsParams(projectName, recordsCheck.recordIds);
      snapshot = {
        mode: 'records',
        recordCount: recordsCheck.recordIds.length
      };
    } else {
      const timeCheck = validateFiltersAuditTime(draft.auditTime);
      if (!timeCheck.ok) {
        const tipKey =
          timeCheck.reason === 'span_exceeded'
            ? 'sqlAudit.aggregate.validate.spanExceeded'
            : 'sqlAudit.aggregate.validate.auditTimeRequired';
        messageApi.warning(t(tipKey));
        return;
      }

      params = buildAggregateSummaryParams(projectName, draft, {
        from: timeCheck.from,
        to: timeCheck.to
      });
      snapshot = {
        mode: 'filters',
        auditTimeLabel: formatAuditTimeLabel(draft.auditTime),
        instanceLabel: resolveInstanceLabel(draft.instanceId),
        tagsLabel: resolveTagsLabel(draft.tags)
      };
    }

    setHasQueried(true);
    setIsDirty(false);
    setQuerySnapshot(snapshot);
    setScopeParams(params);
    setSqlsPageIndex(1);
    setSqlsPageSize(DEFAULT_SQLS_PAGE_SIZE);

    // 分路并行：任一侧失败不 await 阻断对侧
    void loadSummary(params);
    void loadSqls(params, 1, DEFAULT_SQLS_PAGE_SIZE);
  }, [
    draft,
    loadSqls,
    loadSummary,
    messageApi,
    projectName,
    resolveInstanceLabel,
    resolveTagsLabel,
    t
  ]);

  const onRetrySummary = useCallback(() => {
    const params = scopeParamsRef.current;
    if (!params) {
      return;
    }
    void loadSummary(params);
  }, [loadSummary]);

  const onRetrySqls = useCallback(() => {
    const params = scopeParamsRef.current;
    if (!params) {
      return;
    }
    void loadSqls(params, sqlsPageIndex, sqlsPageSize);
  }, [loadSqls, sqlsPageIndex, sqlsPageSize]);

  const onSqlsPageChange = useCallback(
    (pageIndex: number, pageSize: number) => {
      const params = scopeParamsRef.current;
      if (!params) {
        return;
      }
      void loadSqls(params, pageIndex, pageSize);
    },
    [loadSqls]
  );

  const queryBusy = summaryLoading || sqlsLoading;
  /** 结果区有效：已查询且条件未脏 */
  const resultsActive = hasQueried && !isDirty;
  /**
   * S2 §4.1 导出门禁：已查询、未脏、SQL 数 > 0
   */
  const canExport =
    resultsActive &&
    !queryBusy &&
    !summaryError &&
    toCount(summary?.sql_count) > 0;

  const displayMode = resultsActive
    ? querySnapshot?.mode ?? draft.mode
    : draft.mode;
  const displayAuditTimeLabel =
    resultsActive && querySnapshot?.mode === 'filters'
      ? querySnapshot.auditTimeLabel
      : resultsActive && querySnapshot?.mode === 'records'
      ? [
          summary?.report_time_from?.slice(0, 10),
          summary?.report_time_to?.slice(0, 10)
        ]
          .filter(Boolean)
          .join(' ~ ') || formatAuditTimeLabel(draft.auditTime)
      : formatAuditTimeLabel(draft.auditTime);
  const displayInstanceLabel =
    resultsActive && querySnapshot?.mode === 'filters'
      ? querySnapshot.instanceLabel
      : resolveInstanceLabel(draft.instanceId);
  const displayTagsLabel =
    resultsActive && querySnapshot?.mode === 'filters'
      ? querySnapshot.tagsLabel
      : resolveTagsLabel(draft.tags);
  const displayRecordCount =
    resultsActive && querySnapshot?.mode === 'records'
      ? querySnapshot.recordCount
      : draft.recordIds.length;
  const displayInstanceAndTags = `${displayInstanceLabel} / ${displayTagsLabel}`;

  const overviewPlaceholder = t('sqlAudit.aggregate.overview.placeholder');
  const overviewTaskValue = resultsActive
    ? toCount(summary?.task_count)
    : overviewPlaceholder;
  const overviewSqlValue = resultsActive
    ? toCount(summary?.sql_count)
    : overviewPlaceholder;
  const overviewRuleValue = resultsActive
    ? toCount(summary?.rule_hit_count)
    : overviewPlaceholder;
  const ruleTabCount = resultsActive
    ? (summary?.rule_hit_details ?? []).length
    : overviewPlaceholder;
  const sqlTabCount = resultsActive
    ? toCount(summary?.sql_count)
    : overviewPlaceholder;
  const showEmptyResult =
    resultsActive &&
    !summaryLoading &&
    !summaryError &&
    !!summary &&
    toCount(summary.sql_count) === 0 &&
    !sqlsLoading &&
    !sqlsError;

  return (
    <AggregatePageStyleWrapper>
      {messageContextHolder}
      <PageHeader
        fixed
        title={
          <div>
            <Space size={12} align="center">
              <Link to={`/sqle/project/${projectID}/sql-audit`}>
                <BasicButton icon={<LeftArrowOutlined />}>
                  {t('sqlAudit.aggregate.action.back')}
                </BasicButton>
              </Link>
              <span>{t('sqlAudit.aggregate.pageTitle')}</span>
              <span className="aggregate-project-pill">{projectName}</span>
            </Space>
            <div className="aggregate-page-subtitle">
              {t('sqlAudit.aggregate.pageSubtitle')}
            </div>
          </div>
        }
        extra={
          <BasicButton
            type="primary"
            disabled={!canExport}
            onClick={() => {
              if (canExport) {
                setExportOpen(true);
              }
            }}
            data-testid="sql-audit-aggregate-export"
          >
            {t('sqlAudit.aggregate.action.export')}
          </BasicButton>
        }
      />

      <AggregateExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        projectName={projectName}
        scopeParams={scopeParams}
        summary={summary}
        querySnapshot={querySnapshot}
        displayMode={displayMode}
        displayAuditTimeLabel={displayAuditTimeLabel || ''}
        displayScopeDetail={displayInstanceAndTags || ''}
      />

      <AggregateFilterStyleWrapper
        data-testid="sql-audit-aggregate-filter"
        data-mode={draft.mode}
      >
        <div className="aggregate-filter-field">
          <FormItemLabel
            label={t('sqlAudit.aggregate.filter.scopeMode')}
            colon={false}
          >
            <BasicSelect
              value={draft.mode}
              options={scopeModeOptions}
              onChange={onModeChange}
              allowClear={false}
            />
          </FormItemLabel>
        </div>

        {draft.mode === 'filters' ? (
          <>
            <div className="aggregate-filter-field">
              <FormItemLabel
                label={t('sqlAudit.aggregate.filter.auditTime')}
                required
                colon={false}
              >
                <div className="aggregate-date-range">
                  <BasicDatePicker
                    value={draft.auditTime?.[0] ?? null}
                    onChange={onAuditTimeStartChange}
                    allowClear={false}
                  />
                  <span className="aggregate-date-range-sep">
                    {t('sqlAudit.aggregate.filter.dateTo')}
                  </span>
                  <BasicDatePicker
                    value={draft.auditTime?.[1] ?? null}
                    onChange={onAuditTimeEndChange}
                    allowClear={false}
                  />
                </div>
              </FormItemLabel>
            </div>

            <div className="aggregate-filter-field">
              <FormItemLabel
                label={t('sqlAudit.aggregate.filter.instance')}
                colon={false}
              >
                <BasicSelect
                  value={draft.instanceId ?? ALL_INSTANCE_VALUE}
                  options={instanceOptions}
                  onChange={onInstanceChange}
                  placeholder={t('sqlAudit.aggregate.filter.allInstances')}
                  allowClear={false}
                />
              </FormItemLabel>
            </div>

            <div className="aggregate-filter-field">
              <FormItemLabel
                label={t('sqlAudit.aggregate.filter.tags')}
                colon={false}
              >
                <BasicSelect
                  mode="multiple"
                  value={draft.tags}
                  options={auditRecordTagsOptions}
                  onChange={onTagsChange}
                  loading={tagsLoading}
                  placeholder={t('sqlAudit.aggregate.filter.allTags')}
                  allowClear
                  maxTagCount={0}
                  maxTagPlaceholder={() => tagsTriggerLabel}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div className="aggregate-tags-help">
                        {t('sqlAudit.aggregate.filter.tagsMatchAny')}
                      </div>
                    </>
                  )}
                />
              </FormItemLabel>
            </div>
          </>
        ) : (
          <div className="aggregate-filter-field record-picker-field">
            <FormItemLabel
              label={t('sqlAudit.aggregate.filter.records')}
              required
              colon={false}
            >
              <RecordIdsSelect
                value={draft.recordIds}
                onChange={onRecordIdsChange}
                onOverLimit={onRecordIdsOverLimit}
              />
            </FormItemLabel>
          </div>
        )}

        <div className="aggregate-filter-actions">
          <BasicButton onClick={onReset}>{t('common.reset')}</BasicButton>
          <BasicButton
            type="primary"
            onClick={onQuery}
            loading={queryBusy}
            data-testid="sql-audit-aggregate-query"
          >
            {t('sqlAudit.aggregate.action.query')}
          </BasicButton>
        </div>
      </AggregateFilterStyleWrapper>

      <AggregateResultStyleWrapper
        data-testid="sql-audit-aggregate-result"
        data-state={!hasQueried ? 'not-queried' : isDirty ? 'stale' : 'active'}
      >
        <div
          className="aggregate-card"
          data-testid="sql-audit-aggregate-report-scope"
        >
          <div className="section-head">
            <span>{t('sqlAudit.aggregate.reportScope.title')}</span>
            <span className="section-hint">
              {t('sqlAudit.aggregate.reportScope.permissionHint')}
            </span>
          </div>
          <div className="report-meta">
            <div>
              <div className="report-meta-label">
                {t('sqlAudit.aggregate.reportScope.project')}
              </div>
              <div className="report-meta-value">{projectName}</div>
            </div>
            <div>
              <div className="report-meta-label">
                {t('sqlAudit.aggregate.reportScope.mode')}
              </div>
              <div className="report-meta-value">
                {t(`sqlAudit.aggregate.scopeMode.${displayMode}`)}
              </div>
            </div>
            <div>
              <div className="report-meta-label">
                {t('sqlAudit.aggregate.reportScope.auditTime')}
              </div>
              <div className="report-meta-value">
                {displayAuditTimeLabel || overviewPlaceholder}
              </div>
            </div>
            <div>
              <div className="report-meta-label">
                {displayMode === 'records'
                  ? t('sqlAudit.aggregate.reportScope.recordCount')
                  : t('sqlAudit.aggregate.reportScope.instanceAndTags')}
              </div>
              <div className="report-meta-value">
                {displayMode === 'records'
                  ? t('sqlAudit.aggregate.reportScope.recordCountValue', {
                      count: displayRecordCount ?? 0
                    })
                  : displayInstanceAndTags}
              </div>
            </div>
            <div>
              <div className="report-meta-label">
                {t('sqlAudit.aggregate.reportScope.visibility')}
              </div>
              <div className="report-meta-value">
                {t('sqlAudit.aggregate.reportScope.visibilityTip')}
              </div>
            </div>
          </div>
        </div>

        <div
          className="aggregate-card"
          data-testid="sql-audit-aggregate-summary-section"
        >
          <Spin spinning={summaryLoading && resultsActive}>
            {resultsActive && summaryError ? (
              <div
                className="aggregate-result-error"
                data-testid="sql-audit-aggregate-summary-error"
              >
                <span>{summaryError}</span>
                <BasicButton
                  type="primary"
                  size="small"
                  onClick={onRetrySummary}
                  loading={summaryLoading}
                  data-testid="sql-audit-aggregate-summary-retry"
                >
                  {t('common.retry')}
                </BasicButton>
              </div>
            ) : (
              <div
                className="aggregate-overview"
                data-testid="sql-audit-aggregate-overview"
              >
                <div
                  className="metric"
                  data-testid="sql-audit-aggregate-task-count"
                  data-value={
                    resultsActive ? toCount(summary?.task_count) : undefined
                  }
                >
                  <div className="metric-label">
                    {t('sqlAudit.aggregate.overview.taskCount')}
                  </div>
                  <div className="metric-value">
                    {overviewTaskValue}
                    {resultsActive ? (
                      <span className="metric-note">
                        {t('sqlAudit.aggregate.overview.taskUnit')}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div
                  className="metric"
                  data-testid="sql-audit-aggregate-sql-count"
                  data-value={
                    resultsActive ? toCount(summary?.sql_count) : undefined
                  }
                >
                  <div className="metric-label">
                    {t('sqlAudit.aggregate.overview.sqlCount')}
                  </div>
                  <div className="metric-value">
                    {overviewSqlValue}
                    {resultsActive ? (
                      <span className="metric-note">
                        {t('sqlAudit.aggregate.overview.sqlUnit')}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div
                  className="metric"
                  data-testid="sql-audit-aggregate-rule-hit-count"
                  data-value={
                    resultsActive ? toCount(summary?.rule_hit_count) : undefined
                  }
                >
                  <div className="metric-label">
                    {t('sqlAudit.aggregate.overview.ruleHitCount')}
                  </div>
                  <div className="metric-value">
                    {overviewRuleValue}
                    {resultsActive ? (
                      <span className="metric-note">
                        {t('sqlAudit.aggregate.overview.ruleHitNote')}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </Spin>
        </div>

        {resultsActive && !summaryError && summary ? (
          <div className="aggregate-card">
            <LevelHitSummary
              levelSummary={summary.level_summary}
              loading={summaryLoading}
              alwaysShowErrorPriority
              variant="cards"
              sectionHint={t('sqlAudit.aggregate.levelHint')}
            />
          </div>
        ) : null}

        <div className="aggregate-card aggregate-content-card">
          <Tabs
            className="aggregate-content-tabs"
            activeKey={contentTab}
            onChange={(key) => setContentTab(key as 'sql' | 'rules')}
            items={[
              {
                key: 'sql',
                label: (
                  <span>
                    {t('sqlAudit.aggregate.content.sqlTab')}
                    <span className="tab-count">{sqlTabCount}</span>
                  </span>
                ),
                children: (
                  <div
                    className="aggregate-sqls-section"
                    data-testid="sql-audit-aggregate-sqls-section"
                  >
                    {!resultsActive ? (
                      <div
                        className="aggregate-state"
                        data-testid="sql-audit-aggregate-result-empty"
                      >
                        <strong>
                          {isDirty
                            ? t('sqlAudit.aggregate.result.stale')
                            : t('sqlAudit.aggregate.result.notQueried')}
                        </strong>
                        <span>
                          {isDirty
                            ? t('sqlAudit.aggregate.result.staleTip')
                            : t('sqlAudit.aggregate.result.notQueriedTip')}
                        </span>
                      </div>
                    ) : showEmptyResult ? (
                      <div className="aggregate-state">
                        <strong>
                          {t('sqlAudit.aggregate.result.emptyTitle')}
                        </strong>
                        <span>{t('sqlAudit.aggregate.result.emptyTip')}</span>
                      </div>
                    ) : (
                      <Spin spinning={sqlsLoading && !sqlsError}>
                        {sqlsError ? (
                          <div
                            className="aggregate-result-error"
                            data-testid="sql-audit-aggregate-sqls-error"
                          >
                            <span>{sqlsError}</span>
                            <BasicButton
                              type="primary"
                              size="small"
                              onClick={onRetrySqls}
                              loading={sqlsLoading}
                              data-testid="sql-audit-aggregate-sqls-retry"
                            >
                              {t('common.retry')}
                            </BasicButton>
                          </div>
                        ) : (
                          <SqlDetailTable
                            dataSource={sqlsList}
                            total={sqlsTotal}
                            pageIndex={sqlsPageIndex}
                            pageSize={sqlsPageSize}
                            loading={sqlsLoading}
                            onPageChange={onSqlsPageChange}
                          />
                        )}
                      </Spin>
                    )}
                  </div>
                )
              },
              {
                key: 'rules',
                label: (
                  <span>
                    {t('sqlAudit.aggregate.content.rulesTab')}
                    <span className="tab-count">{ruleTabCount}</span>
                  </span>
                ),
                children: (
                  <div className="aggregate-rules-section">
                    {!resultsActive ? (
                      <div className="aggregate-state">
                        <strong>
                          {isDirty
                            ? t('sqlAudit.aggregate.result.stale')
                            : t('sqlAudit.aggregate.result.notQueried')}
                        </strong>
                        <span>
                          {isDirty
                            ? t('sqlAudit.aggregate.result.staleTip')
                            : t('sqlAudit.aggregate.result.notQueriedTip')}
                        </span>
                      </div>
                    ) : summaryError ? (
                      <div
                        className="aggregate-result-error"
                        data-testid="sql-audit-aggregate-rules-error"
                      >
                        <span>{summaryError}</span>
                        <BasicButton
                          type="primary"
                          size="small"
                          onClick={onRetrySummary}
                          loading={summaryLoading}
                        >
                          {t('common.retry')}
                        </BasicButton>
                      </div>
                    ) : (
                      <RuleHitDetails
                        ruleHitDetails={summary?.rule_hit_details}
                        loading={summaryLoading}
                        hideTitle
                        variant="aggregate"
                      />
                    )}
                  </div>
                )
              }
            ]}
          />
        </div>
      </AggregateResultStyleWrapper>
    </AggregatePageStyleWrapper>
  );
};

export default SqlAuditAggregate;
