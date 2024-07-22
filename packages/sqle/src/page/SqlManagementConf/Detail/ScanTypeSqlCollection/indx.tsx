import {
  ActiontechTable,
  TableFilterContainer,
  TableToolbar,
  useTableFilterContainer,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import { ScanTypeSqlCollectionColumnAction } from './column';
import ReportDrawer from '../../../../components/ReportDrawer';
import { useEffect, useMemo, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import SqlStatusFilterContainer from './SqlStatusFilterContainer';
import useSqlStatusFilterContainer from './SqlStatusFilterContainer/useSqlStatusFilterContainer';
import { ScanTypeSqlCollectionStyleWrapper } from './style';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  ScanTypeSqlCollectionProps,
  ScanTypeSqlTableDataSourceItem
} from './index.type';
import useBackendTable from '../../../../hooks/useBackendTable';
import { BasicTable, SQLRenderer } from '@actiontech/shared';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import {
  IAuditResult,
  IAuditTaskSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import useAuditResultRuleInfo from '../../../../components/ReportDrawer/useAuditResultRuleInfo';

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
    tableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword,
    updateTableFilterInfo
  } = useTableRequestParams<any, any>();

  const [
    reportDrawerVisible,
    { setTrue: openReportDrawer, setFalse: closeReportDrawer }
  ] = useBoolean(false);

  const {
    sqlStatusFilterValue,
    handleChangeSqlStatus,
    sqlStatusFilterOptions,
    auditAction,
    lastAuditTime
  } = useSqlStatusFilterContainer();

  const onClickAuditResult = (record: ScanTypeSqlTableDataSourceItem) => {
    openReportDrawer();
    setCurrentAuditResultRecord(record);
  };

  const { data, loading, refresh } = useRequest(
    () =>
      instance_audit_plan
        .getInstanceAuditPlanSQLsV1({
          project_name: projectName,
          instance_audit_plan_id: instanceAuditPlanId,
          audit_plan_type: auditPlanType,
          page_index: pagination.page_index,
          page_size: pagination.page_size
        })
        .then((res) => res.data.data),
    {
      refreshDeps: [pagination],
      ready: activeTabKey === auditPlanType
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

  const { auditResultRuleInfo, loading: getRuleInfoLoading } =
    useAuditResultRuleInfo(recordAuditResult, instanceType);

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Sql_Management_Conf_Detail_Sql_List,
      refresh
    );

    return () => {
      unsubscribe();
    };
  }, [refresh]);

  const { tableColumnFactory } = useBackendTable();
  return (
    <ScanTypeSqlCollectionStyleWrapper>
      {/* <TableToolbar
        // loading={loading}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          placeholder: t(
            'managementConf.detail.scanTypeSqlCollection.filter.searchInputPlaceholder'
          ),
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
      >
        <TableFilterContainer
          inlineToolbar
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          // disabled={loading}
          // filterCustomProps={filterCustomProps}
        />
      </TableToolbar> */}
      {/* <SqlStatusFilterContainer
        lastAuditTime={lastAuditTime}
        value={sqlStatusFilterValue}
        onChange={handleChangeSqlStatus}
        options={sqlStatusFilterOptions}
        auditAction={auditAction}
      /> */}
      {/* <ActiontechTable
        onChange={tableChange}
        columns={columns}
        actions={ScanTypeSqlCollectionColumnAction(() => {
          console.log('分析');
        })}
      /> */}

      <BasicTable
        loading={loading}
        columns={tableColumnFactory(
          data?.head?.filter((v) => v.field_name !== 'audit_results') ?? [],
          {
            columnClassName: (type) =>
              type === 'sql' ? 'ellipsis-column-large-width' : undefined,
            customRender: (text, record, type) => {
              if (!text) {
                return '-';
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
          }
        )}
        dataSource={data?.rows}
        onChange={tableChange}
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
      />
    </ScanTypeSqlCollectionStyleWrapper>
  );
};

export default ScanTypeSqlCollection;
