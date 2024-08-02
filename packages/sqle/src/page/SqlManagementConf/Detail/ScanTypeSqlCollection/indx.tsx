import {
  ActiontechTable,
  TableFilterContainer,
  TableToolbar,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import ReportDrawer from '../../../../components/ReportDrawer';
import { useEffect, useMemo, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { ScanTypeSqlCollectionStyleWrapper } from './style';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  ScanTypeSqlCollectionProps,
  ScanTypeSqlTableDataSourceItem
} from './index.type';
import useBackendTable from '../../../../hooks/useBackendTable';
import { SQLRenderer } from '@actiontech/shared';
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
import AuditResultMessage from '../../../../components/AuditResultMessage';
import { IGetInstanceAuditPlanSQLDataV1Params } from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import { mergeFilterButtonMeta } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableFilterContainer';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const ScanTypeSqlCollection: React.FC<ScanTypeSqlCollectionProps> = ({
  instanceAuditPlanId,
  auditPlanId,
  activeTabKey,
  instanceType
}) => {
  const { t } = useTranslation();
  const { sortableTableColumnFactory, tableFilterMetaFactory } =
    useBackendTable();

  const [dynamicTableFilterMeta, setDynamicTableFilterMeta] =
    useState<ReturnType<typeof tableFilterMetaFactory>>();
  const { projectName } = useCurrentProject();
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<ScanTypeSqlTableDataSourceItem>();

  const {
    tableChange,
    pagination,
    tableFilterInfo,
    sortInfo,
    updateTableFilterInfo,
    createSortParams
  } = useTableRequestParams();

  const {
    filterButtonMeta,
    filterContainerMeta,
    updateAllSelectedFilterItem,
    updateFilterButtonMeta
  } = useTableFilterContainer(
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
              tableFilterMetaFactory(res.data.data?.filter_meta_list ?? []);
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
  const {
    data: tableRows,
    loading: getTableRowLoading,
    refresh: refreshTableRows,
    error: getTableRowError
  } = useRequest(
    () => {
      const cleanEmptyFilterKey = (obj: Record<string, any>) => {
        return Object.keys(obj)
          .filter((key) => obj[key] !== undefined)
          .reduce<Record<string, any>>((acc, key) => {
            acc[key] = obj[key];
            return acc;
          }, {});
      };

      const params: IGetInstanceAuditPlanSQLDataV1Params = {
        project_name: projectName,
        instance_audit_plan_id: instanceAuditPlanId,
        audit_plan_id: auditPlanId,
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_list: Object.keys(
          cleanEmptyFilterKey(tableFilterInfo)
        ).map<IFilter>((key) => {
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
        })
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
      ready: activeTabKey === auditPlanId
    }
  );

  const recordAuditResult = useMemo<IAuditResult[]>(() => {
    try {
      return JSON.parse(
        currentAuditResultRecord?.['audit_results'] ?? '[]'
      ) as IAuditResult[];
    } catch (error) {
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

  return (
    <ScanTypeSqlCollectionStyleWrapper>
      {tableMetas?.filter_meta_list?.length && (
        <TableToolbar
          filterButton={{
            filterButtonMeta,
            updateAllSelectedFilterItem
          }}
        >
          <TableFilterContainer
            className="inline-toolbar-table-filter-container"
            filterContainerMeta={filterContainerMeta}
            updateTableFilterInfo={updateTableFilterInfo}
            filterCustomProps={dynamicTableFilterMeta?.tableFilterCustomProps}
          />
        </TableToolbar>
      )}

      <ActiontechTable
        errorMessage={getTableRowError && getErrorMessage(getTableRowError)}
        loading={getFilterMetaListLoading || getTableRowLoading}
        columns={sortableTableColumnFactory(tableMetas?.head ?? [], {
          columnClassName: (type) =>
            type === 'sql' ? 'ellipsis-column-large-width' : undefined,
          customRender: (text, record, fieldName, type) => {
            if (fieldName === 'audit_results') {
              let results: IAuditResult[] = [];
              try {
                results = JSON.parse(text ?? '[]') as IAuditResult[];
              } catch (error) {
                results = [];
              }
              return (
                <div onClick={() => onClickAuditResult(record)}>
                  {results?.length > 1 ? (
                    <ResultIconRender
                      iconLevels={results.map((item) => {
                        return item.level ?? '';
                      })}
                    />
                  ) : (
                    <AuditResultMessage
                      auditResult={
                        Array.isArray(results) && results.length
                          ? results[0]
                          : {}
                      }
                    />
                  )}
                </div>
              );
            }

            if (!text) {
              return '-';
            }

            if (fieldName === 'last_receive_timestamp') {
              return formatTime(text, '-');
            }

            if (type === 'sql') {
              return (
                <SQLRenderer.Snippet
                  tooltip={false}
                  className="pointer"
                  onClick={() => onClickAuditResult(record)}
                  sql={text}
                  rows={1}
                  showCopyIcon
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
      />
    </ScanTypeSqlCollectionStyleWrapper>
  );
};

export default ScanTypeSqlCollection;
