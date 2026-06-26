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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  IAuditResult,
  IFilter
} from '@actiontech/shared/lib/api/sqle/service/common';
import useAuditResultRuleInfo from '../../../../components/ReportDrawer/useAuditResultRuleInfo';
import {
  formatTime,
  getErrorMessage
} from '@actiontech/shared/lib/utils/Common';
import AuditResultMessage from '../../../../components/AuditResultMessage';
import AuditLevelSummary from '../../../../components/AuditResultMessage/AuditLevelSummary';
import AuditStatusTag from './AuditStatusTag';
import {
  BEING_AUDITED,
  buildTableHeadWithAuditStatus,
  parseAuditResult
} from './utils';
import {
  IGetInstanceAuditPlanSQLDataV1Params,
  IGetInstanceAuditPlanSQLExportV1Params
} from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import { mergeFilterButtonMeta } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableFilterContainer';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { exportSqlManageRemediationV1ExportScopeEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { getAuditTaskSQLsV2FilterAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

const ScanTypeSqlCollection: React.FC<ScanTypeSqlCollectionProps> = ({
  instanceAuditPlanId,
  auditPlanId,
  auditPlanType,
  activeTabKey,
  instanceType,
  exportDone,
  exportPending,
  remediationExportPending,
  remediationExportDone
}) => {
  const { t } = useTranslation();
  const { sortableTableColumnFactory, tableFilterMetaFactory } =
    useBackendTable();

  const [dynamicTableFilterMeta, setDynamicTableFilterMeta] =
    useState<ReturnType<typeof tableFilterMetaFactory>>();
  const { projectName, projectID } = useCurrentProject();
  const { username } = useCurrentUser();
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<ScanTypeSqlTableDataSourceItem>();
  const [remediationDrawerRecord, setRemediationDrawerRecord] =
    useState<ScanTypeSqlTableDataSourceItem>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [polling, { setFalse: finishPollRequest, setTrue: startPollRequest }] =
    useBoolean();

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

  const {
    data: tableMetas,
    loading: getFilterMetaListLoading,
    refresh: refreshFilterMetaList
  } = useRequest(
    () =>
      instance_audit_plan
        .getInstanceAuditPlanSQLMetaV1({
          project_name: projectName,
          instance_audit_plan_id: instanceAuditPlanId,
          audit_plan_id: auditPlanId
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const { tableFilterCustomProps, extraTableFilterMeta } =
              tableFilterMetaFactory(
                res.data.data?.filter_meta_list ?? [],
                true
              );
            setDynamicTableFilterMeta({
              tableFilterCustomProps,
              extraTableFilterMeta
            });
            updateFilterButtonMeta(
              mergeFilterButtonMeta([], extraTableFilterMeta)
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

  const {
    data: tableRows,
    loading: getTableRowLoading,
    refresh: refreshTableRows,
    error: getTableRowError,
    cancel: cancelTableRowsRequest
  } = useRequest(
    () => {
      const params: IGetInstanceAuditPlanSQLDataV1Params = {
        project_name: projectName,
        instance_audit_plan_id: instanceAuditPlanId,
        audit_plan_id: auditPlanId,
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_list: getFilterListByTableFilterInfo()
      };
      createSortParams(params);
      return instance_audit_plan
        .getInstanceAuditPlanSQLDataV1(params)
        .then((res) => ({
          data: res.data.data?.rows,
          total: res.data.total_nums ?? 0
        }));
    },
    {
      refreshDeps: [pagination, tableFilterInfo, sortInfo],
      ready: activeTabKey === auditPlanId,
      pollingInterval: 1000,
      pollingErrorRetryCount: 3,
      onSuccess: (res) => {
        if (res.data?.some((row) => row?.audit_status === BEING_AUDITED)) {
          startPollRequest();
        } else {
          cancelTableRowsRequest();
          finishPollRequest();
        }
      },
      onError: () => {
        cancelTableRowsRequest();
        finishPollRequest();
      }
    }
  );

  const recordAuditResult = useMemo<IAuditResult[]>(() => {
    return parseAuditResult(currentAuditResultRecord?.['audit_results']);
  }, [currentAuditResultRecord]);

  const { auditResultRuleInfo, loading: auditResultInfoLoading } =
    useAuditResultRuleInfo(recordAuditResult, instanceType);

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

      SqlManage.exportSqlManageRemediationV1(
        {
          project_name: projectName,
          export_scope: exportSqlManageRemediationV1ExportScopeEnum.scan_task,
          instance_audit_plan_id: instanceAuditPlanId ?? '',
          audit_plan_type: auditPlanType
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

  const loading = useMemo(
    () =>
      polling && !getFilterMetaListLoading
        ? false
        : getFilterMetaListLoading || getTableRowLoading,
    [polling, getFilterMetaListLoading, getTableRowLoading]
  );

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
      const isBeingAudited = record['audit_status'] === BEING_AUDITED;

      if (isBeingAudited) {
        return (
          <AuditResultMessage
            auditResult={{}}
            auditStatus={getAuditTaskSQLsV2FilterAuditStatusEnum.doing}
          />
        );
      }

      const results = parseAuditResult(record[fieldName]);

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

    return sortableTableColumnFactory(tableHead, {
      columnClassName: (type) =>
        type === 'sql' ? 'ellipsis-column-large-width' : undefined,
      customRender: (text, record, fieldName, type) => {
        const isBeingAudited = record['audit_status'] === BEING_AUDITED;

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
                if (!isBeingAudited) {
                  onClickSql(record);
                }
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
        setting={tableSetting}
        errorMessage={getTableRowError && getErrorMessage(getTableRowError)}
        loading={loading}
        columns={columns}
        dataSource={tableRows?.data}
        onChange={tableChange}
        pagination={{
          total: tableRows?.total
        }}
      />
      <ReportDrawer
        title={t(
          'managementConf.detail.scanTypeSqlCollection.column.sqlAuditResultReportTitle'
        )}
        data={{
          auditResult: auditResultRuleInfo,
          sql: currentAuditResultRecord?.['sql'] ?? ''
        }}
        open={reportDrawerVisible}
        onClose={closeReportDrawer}
        loading={auditResultInfoLoading}
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
      />
    </ScanTypeSqlCollectionStyleWrapper>
  );
};

export default ScanTypeSqlCollection;
