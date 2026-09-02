import {
  ActiontechTable,
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams,
  ColumnsSettingProps,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import ReportDrawer from '../../../../components/ReportDrawer';
import RemediationDetailDrawer from '../../../../components/RemediationDetailDrawer';
import { OpenCreateAuditWhitelistExceptionParams } from '../../../../components/RuleException/AddRuleExceptionButton';
import useWhitelistRedux from '../../../Whitelist/hooks/useWhitelistRedux';
import AddWhitelist from '../../../Whitelist/Drawer/AddWhitelist';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { ScanTypeSqlCollectionStyleWrapper } from './style';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import {
  ScanTypeSqlCollectionProps,
  ScanTypeSqlTableDataSourceItem
} from './index.type';
import useBackendTable from '../../../../hooks/useBackendTable';
import { BasicButton, SQLRenderer, BasicToolTips } from '@actiontech/shared';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { IFilter } from '@actiontech/shared/lib/api/sqle/service/common';
import useAuditResultRuleInfo from '../../../../components/ReportDrawer/useAuditResultRuleInfo';
import {
  formatTime,
  getErrorMessage
} from '@actiontech/shared/lib/utils/Common';
import AuditLevelSummary from '../../../../components/AuditResultMessage/AuditLevelSummary';
import AuditResultExemptionSummary from '../../../../components/AuditResultMessage/AuditResultExemptionSummary';
import AuditStatusTag from './AuditStatusTag';
import {
  buildTableHeadWithAuditStatus,
  parseAuditResult,
  parseScanAuditResult,
  splitScanAuditResultsByExemption
} from './utils';
import {
  IGetInstanceAuditPlanSQLDataV1Params,
  IGetInstanceAuditPlanSQLExportV1Params
} from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import useLazyFilterTips from './useLazyFilterTips';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { exportSqlManageRemediationV1ExportScopeEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import {
  ISqlManageRuleExceptionContext,
  ScanTaskRuleExceptionSourceContext,
  buildSqlManageRuleExceptionContext,
  toScanTaskRuleExceptionRecord
} from '../../../../page/RuleException/index.data';

type ScanTableRequestResult = {
  data?: ScanTypeSqlTableDataSourceItem[];
  total: number;
  hasPendingAudit: boolean;
  pendingAuditCount: number;
};

const SCAN_SQL_COLUMN_WIDTHS: Record<string, number> = {
  sql: 360,
  fingerprint: 280,
  audit_status: 110,
  priority: 100,
  first_audit_results: 200,
  audit_results: 200,
  schema_name: 140,
  schema_meta_name: 160,
  object_name: 160,
  schema_meta_type: 120,
  object_type: 120
};

const DEFAULT_SCAN_SQL_COLUMN_WIDTH = 140;

const ScanTypeSqlCollection: React.FC<ScanTypeSqlCollectionProps> = ({
  instanceAuditPlanId,
  auditPlanId,
  auditPlanType,
  auditPlanDesc,
  instanceId,
  activeTabKey,
  instanceType,
  exportDone,
  exportPending,
  remediationExportPending,
  remediationExportDone
}) => {
  const { t } = useTranslation();
  const { openAuditWhitelistCreateWithPrefill } = useWhitelistRedux();
  const { sortableTableColumnFactory } = useBackendTable();
  const { projectName, projectID } = useCurrentProject();

  const { dynamicTableFilterMeta, buildFilterMetaFromList } = useLazyFilterTips(
    {
      projectName,
      instanceAuditPlanId,
      auditPlanId
    }
  );
  const { username } = useCurrentUser();
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<ScanTypeSqlTableDataSourceItem>();
  const [remediationDrawerRecord, setRemediationDrawerRecord] =
    useState<ScanTypeSqlTableDataSourceItem>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    tableChange,
    pagination,
    tableFilterInfo,
    sortInfo,
    updateTableFilterInfo,
    createSortParams
  } = useTableRequestParams();

  const { filterContainerMeta, updateFilterButtonMeta } =
    useTableFilterContainer(
      [],
      updateTableFilterInfo,
      dynamicTableFilterMeta?.extraTableFilterMeta
    );

  const [
    reportDrawerVisible,
    { setTrue: openReportDrawer, setFalse: closeReportDrawer }
  ] = useBoolean(false);

  const [
    remediationDrawerVisible,
    { setTrue: openRemediationDrawer, setFalse: closeRemediationDrawer }
  ] = useBoolean(false);

  const onClickSql = useCallback(
    (record: ScanTypeSqlTableDataSourceItem) => {
      openReportDrawer();
      setCurrentAuditResultRecord(record);
    },
    [openReportDrawer]
  );

  const onClickAuditResult = useCallback(
    (record: ScanTypeSqlTableDataSourceItem) => {
      setRemediationDrawerRecord(record);
      openRemediationDrawer();
    },
    [openRemediationDrawer]
  );

  const scanTaskSourceContext = useMemo<ScanTaskRuleExceptionSourceContext>(
    () => ({
      auditPlanType,
      auditPlanId,
      auditPlanDesc,
      instanceType,
      instanceId
    }),
    [auditPlanDesc, auditPlanId, auditPlanType, instanceId, instanceType]
  );

  const toScanTaskRecord = useCallback(
    (record?: ScanTypeSqlTableDataSourceItem) => {
      if (!record) {
        return undefined;
      }
      // 智能扫描特例：例外在 audit_results.is_exempted，创建例外时只带活跃命中。
      const { active } = splitScanAuditResultsByExemption(
        parseScanAuditResult(record['audit_results'])
      );
      return toScanTaskRuleExceptionRecord(
        {
          sql_fingerprint: record['sql_fingerprint'],
          fingerprint: record['fingerprint'],
          sql: record['sql'],
          instance_id: record['instance_id'],
          audit_result: active
        },
        scanTaskSourceContext
      );
    },
    [scanTaskSourceContext]
  );

  const remediationSqlManageContext = useMemo<
    ISqlManageRuleExceptionContext | undefined
  >(() => {
    return buildSqlManageRuleExceptionContext(
      toScanTaskRecord(remediationDrawerRecord)
    );
  }, [remediationDrawerRecord, toScanTaskRecord]);

  // SQL 审核结果抽屉（点击 SQL 语句打开）同样需要快捷添加例外入口。
  const reportSqlManageContext = useMemo<
    ISqlManageRuleExceptionContext | undefined
  >(() => {
    return buildSqlManageRuleExceptionContext(
      toScanTaskRecord(currentAuditResultRecord)
    );
  }, [currentAuditResultRecord, toScanTaskRecord]);

  const handleOpenCreateExceptionFromRemediation = useCallback(
    (params: OpenCreateAuditWhitelistExceptionParams) => {
      closeRemediationDrawer();
      setRemediationDrawerRecord(undefined);
      openAuditWhitelistCreateWithPrefill(
        toScanTaskRecord(remediationDrawerRecord),
        { ruleName: params.auditResult?.rule_name }
      );
    },
    [
      closeRemediationDrawer,
      openAuditWhitelistCreateWithPrefill,
      remediationDrawerRecord,
      toScanTaskRecord
    ]
  );

  const handleOpenCreateExceptionFromReport = useCallback(
    (params: OpenCreateAuditWhitelistExceptionParams) => {
      closeReportDrawer();
      openAuditWhitelistCreateWithPrefill(
        toScanTaskRecord(currentAuditResultRecord),
        { ruleName: params.auditResult?.rule_name }
      );
    },
    [
      closeReportDrawer,
      currentAuditResultRecord,
      openAuditWhitelistCreateWithPrefill,
      toScanTaskRecord
    ]
  );

  const { data: tableMetas, refresh: refreshFilterMetaList } = useRequest(
    () =>
      instance_audit_plan
        .getInstanceAuditPlanSQLMetaV1({
          project_name: projectName,
          instance_audit_plan_id: instanceAuditPlanId,
          audit_plan_id: auditPlanId
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            buildFilterMetaFromList(
              res.data.data?.filter_meta_list ?? [],
              updateFilterButtonMeta
            );
            return res.data.data;
          }
        }),
    {
      ready: activeTabKey === auditPlanId
    }
  );

  const getFilterListByTableFilterInfo = useCallback<() => IFilter[]>(() => {
    const cleanEmptyFilterKey = (obj: Record<string, any>) => {
      return Object.keys(obj)
        .filter((key) => {
          const value = obj[key];
          if (Array.isArray(value)) {
            return value.filter((v) => !!v).length > 0;
          }
          return !!value;
        })
        .reduce<Record<string, any>>((acc, key) => {
          acc[key] = obj[key];
          return acc;
        }, {});
    };

    return Object.keys(cleanEmptyFilterKey(tableFilterInfo)).map<IFilter>(
      (key) => {
        const value = cleanEmptyFilterKey(tableFilterInfo)[key];
        if (Array.isArray(value) && value.length === 2) {
          return {
            filter_name: key,
            filter_between_value: {
              from: value[0],
              to: value[1]
            }
          };
        }
        return {
          filter_name: key,
          filter_compare_value: value
        };
      }
    );
  }, [tableFilterInfo]);

  const tableRowsRequestRef = useRef<Promise<ScanTableRequestResult> | null>(
    null
  );
  const queuedTableRowsRefreshRef = useRef(false);
  const refreshTableRowsRef = useRef<() => void>(() => undefined);
  const requestTableRows = useCallback(() => {
    if (tableRowsRequestRef.current) {
      queuedTableRowsRefreshRef.current = true;
      return tableRowsRequestRef.current;
    }
    const params: IGetInstanceAuditPlanSQLDataV1Params = {
      project_name: projectName,
      instance_audit_plan_id: instanceAuditPlanId,
      audit_plan_id: auditPlanId,
      page_index: pagination.page_index,
      page_size: pagination.page_size,
      filter_list: getFilterListByTableFilterInfo()
    };
    createSortParams(params);
    const request = instance_audit_plan
      .getInstanceAuditPlanSQLDataV1(params)
      .then((res) => ({
        data: res.data.data?.rows,
        total: res.data.total_nums ?? 0,
        hasPendingAudit: res.data.has_pending_audit === true,
        pendingAuditCount: res.data.pending_audit_count ?? 0
      }))
      .finally(() => {
        tableRowsRequestRef.current = null;
        if (queuedTableRowsRefreshRef.current) {
          queuedTableRowsRefreshRef.current = false;
          queueMicrotask(() => refreshTableRowsRef.current());
        }
      });
    tableRowsRequestRef.current = request;
    return request;
  }, [
    auditPlanId,
    createSortParams,
    getFilterListByTableFilterInfo,
    instanceAuditPlanId,
    pagination.page_index,
    pagination.page_size,
    projectName
  ]);

  const {
    data: tableRows,
    refresh: refreshTableRows,
    error: getTableRowError,
    cancel: cancelTableRowsRequest
  } = useRequest(requestTableRows, {
    refreshDeps: [pagination, tableFilterInfo, sortInfo],
    ready: activeTabKey === auditPlanId,
    pollingInterval: 3000,
    pollingWhenHidden: false,
    pollingErrorRetryCount: 3,
    onSuccess: (res) => {
      if (!res.hasPendingAudit) {
        cancelTableRowsRequest();
      }
    },
    onError: () => {
      cancelTableRowsRequest();
    }
  });
  refreshTableRowsRef.current = refreshTableRows;

  useEffect(() => {
    if (activeTabKey !== auditPlanId) {
      queuedTableRowsRefreshRef.current = false;
      cancelTableRowsRequest();
    }
  }, [activeTabKey, auditPlanId, cancelTableRowsRequest]);

  useEffect(() => {
    return () => {
      refreshTableRowsRef.current = () => undefined;
    };
  }, []);

  // 智能扫描特例：从 audit_results 按 is_exempted 拆分，供 ReportDrawer 展示例外区。
  const currentScanAuditBuckets = useMemo(
    () =>
      splitScanAuditResultsByExemption(
        parseScanAuditResult(currentAuditResultRecord?.['audit_results'])
      ),
    [currentAuditResultRecord]
  );

  const {
    auditResultRuleInfo,
    loading: auditResultInfoLoading,
    enrichSkippedItem
  } = useAuditResultRuleInfo(
    currentScanAuditBuckets.active,
    instanceType,
    currentScanAuditBuckets.exempted
  );

  useEffect(() => {
    const refresh = () => {
      refreshFilterMetaList();
      refreshTableRows();
    };
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Sql_Management_Conf_Detail_Sql_List,
      refresh
    );

    return () => {
      unsubscribe();
    };
  }, [refreshFilterMetaList, refreshTableRows]);

  useEffect(() => {
    const exportScanTypeSqlDetail = () => {
      exportPending();
      const hideLoading = messageApi.loading(
        t('managementConf.detail.exportTips'),
        0
      );
      const params: IGetInstanceAuditPlanSQLExportV1Params = {
        project_name: projectName,
        instance_audit_plan_id: instanceAuditPlanId ?? '',
        audit_plan_id: auditPlanId,
        filter_list: getFilterListByTableFilterInfo()
      };

      createSortParams(params);
      instance_audit_plan
        .getInstanceAuditPlanSQLExportV1(params, { responseType: 'blob' })
        .finally(() => {
          exportDone();
          hideLoading();
        });
    };
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Export_Sql_Management_Conf_Detail_Sql_List,
      exportScanTypeSqlDetail
    );

    return () => {
      unsubscribe();
    };
  }, [
    auditPlanId,
    createSortParams,
    exportDone,
    exportPending,
    getFilterListByTableFilterInfo,
    instanceAuditPlanId,
    messageApi,
    projectName,
    t
  ]);

  useEffect(() => {
    const exportScanTypeRemediation = () => {
      remediationExportPending();
      const hideLoading = messageApi.loading(
        t('managementConf.detail.remediationExportTips'),
        0
      );

      const filterList = getFilterListByTableFilterInfo();
      SqlManage.exportSqlManageRemediationV1(
        {
          project_name: projectName,
          export_scope: exportSqlManageRemediationV1ExportScopeEnum.scan_task,
          instance_audit_plan_id: instanceAuditPlanId ?? '',
          audit_plan_type: auditPlanType,
          // 与「导出扫描任务报表」一致：明细动态筛 + SQL/规则搜索写入 filter_list
          filter_list:
            filterList.length > 0 ? JSON.stringify(filterList) : undefined
        },
        { responseType: 'blob' }
      )
        .then((res) => {
          if (res.status === 200) {
            messageApi.success(
              t('managementConf.detail.remediationExportSuccessTips')
            );
          }
        })
        .finally(() => {
          remediationExportDone();
          hideLoading();
        });
    };
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Export_Sql_Management_Conf_Detail_Remediation,
      exportScanTypeRemediation
    );

    return () => {
      unsubscribe();
    };
  }, [
    auditPlanType,
    getFilterListByTableFilterInfo,
    instanceAuditPlanId,
    messageApi,
    projectName,
    remediationExportDone,
    remediationExportPending,
    t
  ]);

  const tableSetting = useMemo<ColumnsSettingProps>(() => {
    return {
      tableName: `sql_management_conf_${auditPlanType}`,
      username: username
    };
  }, [username, auditPlanType]);

  // AC-019：进页/改筛直接换行，禁止表格蓝底 Spin；可留旧行；无旧数据时空表
  const tableHead = useMemo(
    () =>
      buildTableHeadWithAuditStatus(tableMetas?.head, {
        auditStatus: t(
          'managementConf.detail.scanTypeSqlCollection.column.auditStatus'
        ),
        firstAuditResult: t(
          'managementConf.detail.scanTypeSqlCollection.column.firstAuditResult'
        ),
        currentAuditResult: t(
          'managementConf.detail.scanTypeSqlCollection.column.currentAuditResult'
        )
      }),
    [tableMetas?.head, t]
  );

  const renderAuditResultCell = useCallback(
    (
      record: ScanTypeSqlTableDataSourceItem,
      fieldName: 'first_audit_results' | 'audit_results'
    ) => {
      // 审核状态只在 audit_status 列展示（AuditStatusTag），审核结果列不重复显示。
      // 待审核时仍渲染已有结果；无结果则显示 "-"。

      // 智能扫描详情特例：例外留在 audit_results，用 is_exempted 标记，
      // 不拆到 skipped_by_rule_exception（与 SQL 管控 / 工单不同）。
      if (fieldName === 'audit_results') {
        const scanResults = parseScanAuditResult(record[fieldName]);
        const { active, exempted } =
          splitScanAuditResultsByExemption(scanResults);

        if (!active.length && !exempted.length) {
          return '-';
        }

        return (
          <BasicToolTips
            title={t('sqlManagement.table.column.viewAuditResultCompare')}
          >
            <div
              data-testid="trigger-open-remediation-drawer"
              className="audit-result-wrapper"
              onClick={() => onClickAuditResult(record)}
            >
              <AuditResultExemptionSummary
                auditResults={active}
                skippedByRuleException={exempted}
              />
            </div>
          </BasicToolTips>
        );
      }

      const results = parseAuditResult(record[fieldName]);

      if (!results.length) {
        return '-';
      }

      return (
        <BasicToolTips
          title={t('sqlManagement.table.column.viewAuditResultCompare')}
        >
          <div
            data-testid="trigger-open-remediation-drawer"
            className="audit-result-wrapper"
            onClick={() => onClickAuditResult(record)}
          >
            <AuditLevelSummary auditResults={results} />
          </div>
        </BasicToolTips>
      );
    },
    [onClickAuditResult, t]
  );

  const columns = useMemo(() => {
    if (!tableHead.length) {
      return [];
    }

    const generatedColumns = sortableTableColumnFactory(tableHead, {
      columnClassName: (type) =>
        type === 'sql' ? 'ellipsis-column-large-width' : undefined,
      customRender: (text, record, fieldName, type) => {
        if (fieldName === 'audit_status') {
          return <AuditStatusTag status={text} />;
        }

        if (fieldName === 'first_audit_results') {
          return renderAuditResultCell(record, 'first_audit_results');
        }

        if (fieldName === 'audit_results') {
          return renderAuditResultCell(record, 'audit_results');
        }

        if (!text) {
          return '-';
        }

        if (type === 'time') {
          return formatTime(text, '-');
        }

        if (type === 'sql') {
          return (
            <SQLRenderer.Snippet
              tooltip={false}
              className="pointer"
              onClick={() => {
                onClickSql(record);
              }}
              sql={text}
              rows={1}
              showCopyIcon
              cuttingLength={200}
            />
          );
        }

        return text;
      }
    });

    const columnTypeMap = new Map(
      tableHead.map((item) => [item.field_name ?? '', item.type])
    );

    return generatedColumns.map((column) => {
      const fieldName = String(column.dataIndex ?? '');
      const width =
        SCAN_SQL_COLUMN_WIDTHS[fieldName] ??
        (columnTypeMap.get(fieldName) === 'sql'
          ? 320
          : DEFAULT_SCAN_SQL_COLUMN_WIDTH);

      return {
        ...column,
        width
      };
    });
  }, [
    onClickSql,
    renderAuditResultCell,
    sortableTableColumnFactory,
    tableHead
  ]);

  return (
    <ScanTypeSqlCollectionStyleWrapper>
      <TableToolbar setting={tableSetting}>
        {tableMetas?.filter_meta_list?.length && (
          <TableFilterContainer
            filterContainerMeta={filterContainerMeta}
            updateTableFilterInfo={updateTableFilterInfo}
            filterCustomProps={dynamicTableFilterMeta?.tableFilterCustomProps}
          />
        )}
      </TableToolbar>

      {messageContextHolder}
      <ActiontechTable
        rowKey="id"
        enableBodyScrollY
        setting={tableSetting}
        errorMessage={getTableRowError && getErrorMessage(getTableRowError)}
        columns={columns}
        dataSource={tableRows?.data}
        onChange={tableChange}
        pagination={{
          total: tableRows?.total,
          current: pagination.page_index
        }}
        {...(getTableRowError
          ? {}
          : {
              locale: {
                emptyText: t('sqlManagement.table.emptyFilterResult')
              }
            })}
      />
      <ReportDrawer
        title={t(
          'managementConf.detail.scanTypeSqlCollection.column.sqlAuditResultReportTitle'
        )}
        data={{
          auditResult: auditResultRuleInfo,
          // 来自 audit_results.is_exempted，非 skipped_by_rule_exception 字段
          skippedByRuleException: currentScanAuditBuckets.exempted,
          sql: currentAuditResultRecord?.['sql'] ?? ''
        }}
        open={reportDrawerVisible}
        onClose={closeReportDrawer}
        showAnnotation
        loading={auditResultInfoLoading}
        enrichSkippedItem={enrichSkippedItem}
        sqlManageContext={reportSqlManageContext}
        onOpenCreateException={
          reportSqlManageContext
            ? handleOpenCreateExceptionFromReport
            : undefined
        }
        extra={
          <Link
            to={`/sqle/project/${projectID}/sql-management-conf/${instanceAuditPlanId}/analyze/${currentAuditResultRecord?.['id']}`}
            target="blank"
          >
            <BasicButton>
              {t(
                'managementConf.detail.scanTypeSqlCollection.column.action.analysis'
              )}
            </BasicButton>
          </Link>
        }
      />
      <RemediationDetailDrawer
        open={remediationDrawerVisible}
        onClose={closeRemediationDrawer}
        sqlManageId={remediationDrawerRecord?.id}
        sqlManageContext={remediationSqlManageContext}
        status={remediationDrawerRecord?.['status']}
        title={t('sqlManagement.remediationCompare.drawerTitle')}
        onOpenCreateException={handleOpenCreateExceptionFromRemediation}
      />
      <AddWhitelist />
    </ScanTypeSqlCollectionStyleWrapper>
  );
};

export default ScanTypeSqlCollection;
