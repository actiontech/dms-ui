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
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import ResultIconRender from '../../../../components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from '../../../../components/AuditResultMessage';

const ScanTypeSqlCollection: React.FC<ScanTypeSqlCollectionProps> = ({
  instanceAuditPlanId,
  auditPlanType,
  activeTabKey,
  instanceType
}) => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<ScanTypeSqlTableDataSourceItem>();

  const {
    tableChange,
    pagination,
    tableFilterInfo,
    sortInfo,
    updateTableFilterInfo
  } = useTableRequestParams();
  const { sortableTableColumnFactory, tableFilterMetaFactory } =
    useBackendTable();

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
  } = useRequest(() =>
    instance_audit_plan
      .getInstanceAuditPlanSQLMetaV1({
        project_name: projectName,
        instance_audit_plan_id: instanceAuditPlanId,
        audit_plan_type: auditPlanType
      })
      .then((res) => res.data)
  );
  const [extraTableFilterMeta, tableFilterCustomProps] = tableFilterMetaFactory(
    tableMetas?.filter_meta_list ?? []
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer([], updateTableFilterInfo, extraTableFilterMeta);

  const {
    data: tableData,
    loading: getTableDataLoading,
    refresh: refreshTableData
  } = useRequest(() =>
    instance_audit_plan
      .getInstanceAuditPlanSQLDataV1({
        project_name: projectName,
        instance_audit_plan_id: instanceAuditPlanId,
        audit_plan_type: auditPlanType,
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_list: Object.keys(tableFilterInfo).map<IFilter>((key) => {
          const value = tableFilterInfo[key];
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
      })
      .then((res) => res.data)
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
      refreshTableData();
    };
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Sql_Management_Conf_Detail_Sql_List,
      refresh
    );

    return () => {
      unsubscribe();
    };
  }, [refreshFilterMetaList, refreshTableData]);

  return (
    <ScanTypeSqlCollectionStyleWrapper>
      <TableToolbar
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        filterCustomProps={tableFilterCustomProps}
      />
      <ActiontechTable
        loading={getFilterMetaListLoading || getTableDataLoading}
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
        dataSource={tableData?.data?.rows}
        onChange={tableChange}
        pagination={{
          total: tableData?.total_nums
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
