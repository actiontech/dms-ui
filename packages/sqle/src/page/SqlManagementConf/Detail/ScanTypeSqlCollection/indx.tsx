import { useTableRequestParams } from '@actiontech/shared/lib/components/ActiontechTable';
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
import { BasicTable, SQLRenderer } from '@actiontech/shared';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import useAuditResultRuleInfo from '../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import ResultIconRender from '../../../../components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from '../../../../components/AuditResultMessage';

const ScanTypeSqlCollection: React.FC<ScanTypeSqlCollectionProps> = ({
  instanceAuditPlanId,
  auditPlanId,
  activeTabKey,
  instanceType
}) => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();
  const [currentAuditResultRecord, setCurrentAuditResultRecord] =
    useState<ScanTypeSqlTableDataSourceItem>();

  const { tableChange, pagination } = useTableRequestParams();

  const [
    reportDrawerVisible,
    { setTrue: openReportDrawer, setFalse: closeReportDrawer }
  ] = useBoolean(false);

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
          audit_plan_id: auditPlanId,
          page_index: pagination.page_index,
          page_size: pagination.page_size
        })
        .then((res) => res.data),
    {
      refreshDeps: [pagination],
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
      <BasicTable
        loading={loading}
        columns={tableColumnFactory(data?.data?.head ?? [], {
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
        dataSource={data?.data?.rows}
        onChange={tableChange}
        pagination={{
          total: data?.total_nums
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
