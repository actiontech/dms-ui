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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { ScanTypeSqlCollectionStyleWrapper } from './style';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/features';
import {
  ScanTypeSqlCollectionProps,
  ScanTypeSqlTableDataSourceItem
} from './index.type';
import useBackendTable from '../../../../hooks/useBackendTable';
import { ActionButton, SQLRenderer } from '@actiontech/shared';
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
import ResultIconRender from '../../../../components/AuditResultMessage/ResultIconRender';
import {
  IGetInstanceAuditPlanSQLDataV1Params,
  IGetInstanceAuditPlanSQLExportV1Params
} from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import { mergeFilterButtonMeta } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableFilterContainer';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { ResultIconRenderProps } from '../../../../components/AuditResultMessage/index.type';

const BEING_AUDITED = 'being_audited';

const ScanTypeSqlCollection: React.FC<ScanTypeSqlCollectionProps> = ({
  instanceAuditPlanId,
  auditPlanId,
  auditPlanType,
  activeTabKey,
  instanceType,
  exportDone,
  exportPending,
  instanceName
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

  const onClickAuditResult = (record: ScanTypeSqlTableDataSourceItem) => {
    openReportDrawer();
    setCurrentAuditResultRecord(record);
  };

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
    cancel
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
        if (res.data?.some((i) => i?.audit_status === BEING_AUDITED)) {
          startPollRequest();
        } else {
          cancel();
          finishPollRequest();
        }
      }
    }
  );

  const recordAuditResult = useMemo<IAuditResult[]>(() => {
    try {
      return JSON.parse(
        currentAuditResultRecord?.['audit_results'] ?? '[]'
      ) as IAuditResult[];
    } catch {
      return [];
    }
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

  const parseAuditResult = (
    resultString: string
  ): ResultIconRenderProps['auditResultInfo'] => {
    let results: IAuditResult[] = [];
    try {
      results = JSON.parse(resultString ?? '[]') as IAuditResult[];
    } catch {
      results = [];
    }

    return results?.map((item) => {
      return {
        level: item.level ?? '',
        executionFailed: !!item.execution_failed
      };
    });
  };

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
        columns={sortableTableColumnFactory(tableMetas?.head ?? [], {
          columnClassName: (type) =>
            type === 'sql' ? 'ellipsis-column-large-width' : undefined,
          customRender: (text, record, fieldName, type) => {
            const currentAuditStatusIsBeingAudited =
              record.audit_status === BEING_AUDITED;
            if (fieldName === 'audit_results') {
              return (
                <div
                  data-testid="trigger-open-report-drawer"
                  onClick={() => {
                    if (!currentAuditStatusIsBeingAudited) {
                      onClickAuditResult(record);
                    }
                  }}
                >
                  <ResultIconRender
                    auditResultInfo={parseAuditResult(text)}
                    isAuditing={currentAuditStatusIsBeingAudited}
                  />
                </div>
              );
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
                    if (!currentAuditStatusIsBeingAudited) {
                      onClickAuditResult(record);
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
        })}
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
          <ActionButton
            text={t(
              'managementConf.detail.scanTypeSqlCollection.column.action.analysis'
            )}
            actionType="navigate-link"
            link={{
              to: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.analyze,
              target: '_blank',
              params: {
                projectID,
                instanceAuditPlanId,
                id: currentAuditResultRecord?.id ?? ''
              },
              queries: {
                instance_name: instanceName,
                schema: currentAuditResultRecord?.schema_name ?? ''
              }
            }}
          />
        }
      />
    </ScanTypeSqlCollectionStyleWrapper>
  );
};

export default ScanTypeSqlCollection;
