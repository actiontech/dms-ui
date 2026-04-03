import {
  ActiontechTable,
  ActiontechTableWrapper,
  ROUTE_PATHS,
  TableToolbar,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/dms-kit';
import { RocketFilled, WarningFilled } from '@actiontech/icons';
import { useRequest } from 'ahooks';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import {
  SqlGovernancePanelStyleWrapper,
  StatCardsStyleWrapper,
  StatCardItemStyleWrapper
} from '../../style';
import { sqlGovernancePanelColumns } from './column';
import { sqlGovernancePanelTableActions } from './action';
import { IGlobalSqlManageTaskItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { GetGlobalSqlManageTaskListV2FilterCardEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { usePermission } from '@actiontech/shared/lib/features';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { parse2ReactRouterPath } from '@actiontech/shared';
import { GetSqlManageListV3FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { GlobalDashboardService } from '@actiontech/shared/lib/api/sqle';

type SqlGovernancePanelProps = {
  projectId?: string;
  instanceId?: string;
  refreshSignal?: number;
};

const SqlGovernancePanel: React.FC<SqlGovernancePanelProps> = ({
  projectId,
  instanceId,
  refreshSignal
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const { checkActionPermission } = usePermission();
  const [sqlFilterCard, setSqlFilterCard] =
    useState<GetGlobalSqlManageTaskListV2FilterCardEnum>(
      GetGlobalSqlManageTaskListV2FilterCardEnum.pending
    );

  const {
    pagination,
    setPagination,
    tableChange,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<IGlobalSqlManageTaskItemV2>();

  const resetPagination = useCallback(() => {
    setPagination((prev) => ({ page_index: 1, page_size: prev.page_size }));
  }, [setPagination]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const sqlStats = useRequest(
    () =>
      GlobalDashboardService.GetGlobalSqlManageStatisticsV2({
        filter_project_uid: projectId,
        filter_instance_id: instanceId
      }),
    { refreshDeps: [projectId, instanceId, refreshSignal] }
  );

  const sqlList = useRequest(
    () =>
      handleTableRequestError(
        GlobalDashboardService.GetGlobalSqlManageTaskListV2({
          page_index: pagination.page_index,
          page_size: pagination.page_size,
          filter_card: sqlFilterCard,
          filter_project_uid: projectId,
          filter_instance_id: instanceId,
          keyword: searchKeyword?.trim() || undefined
        })
      ),
    {
      refreshDeps: [
        pagination,
        projectId,
        instanceId,
        sqlFilterCard,
        refreshSignal
      ]
    }
  );

  const goSqlManagement = useCallback(
    (record: IGlobalSqlManageTaskItemV2, type: 'optimize' | 'detail') => {
      if (!record.project_uid) {
        message.warning(t('globalDashboard.common.missingProject'));
        return;
      }

      const targetPath = parse2ReactRouterPath(
        ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index,
        {
          params: { projectID: record.project_uid },
          queries: {
            instance_id: record.instance_id,
            source: record.source,
            is_assignee_self: String(true),
            status_filter:
              type === 'optimize'
                ? GetSqlManageListV3FilterStatusEnum.unhandled
                : GetSqlManageListV3FilterStatusEnum.solved
          }
        }
      );
      window.open(targetPath, '_blank');
    },
    [t]
  );

  const onOptimize = useCallback(
    (record: IGlobalSqlManageTaskItemV2) => {
      goSqlManagement(record, 'optimize');
    },
    [goSqlManagement]
  );

  const onDetail = useCallback(
    (record: IGlobalSqlManageTaskItemV2) => {
      goSqlManagement(record, 'detail');
    },
    [goSqlManagement]
  );

  const columns = useMemo(() => sqlGovernancePanelColumns(), []);

  const actions = useMemo(
    () =>
      sqlGovernancePanelTableActions(
        onOptimize,
        onDetail,
        checkActionPermission
      ),
    [onOptimize, onDetail, checkActionPermission]
  );

  const tableLoading = sqlList.loading || sqlStats.loading;

  const cards = [
    {
      key: GetGlobalSqlManageTaskListV2FilterCardEnum.pending,
      title: t('globalDashboard.sql.card.pending'),
      subtitle: t('globalDashboard.sql.card.pendingSubtitle'),
      count: sqlStats.data?.data.data?.pending_sql_count ?? 0,
      icon: <WarningFilled color="currentColor" width={20} height={20} />,
      accentColor:
        sqleTheme.globalDashboard.filterCardAccent.sqlGovernance[
          GetGlobalSqlManageTaskListV2FilterCardEnum.pending
        ]
    },
    {
      key: GetGlobalSqlManageTaskListV2FilterCardEnum.optimized,
      title: t('globalDashboard.sql.card.optimized'),
      subtitle: t('globalDashboard.sql.card.optimizedSubtitle'),
      count: sqlStats.data?.data.data?.optimized_this_week_count ?? 0,
      icon: <RocketFilled color="currentColor" width={20} height={20} />,
      accentColor:
        sqleTheme.globalDashboard.filterCardAccent.sqlGovernance[
          GetGlobalSqlManageTaskListV2FilterCardEnum.optimized
        ]
    }
  ];

  return (
    <SqlGovernancePanelStyleWrapper>
      <StatCardsStyleWrapper>
        {cards.map((card) => (
          <StatCardItemStyleWrapper
            key={card.key}
            $accentColor={card.accentColor}
            $active={sqlFilterCard === card.key}
            onClick={() => {
              resetPagination();
              setSqlFilterCard(card.key);
            }}
          >
            <div className="stat-card-title">{card.title}</div>
            <div className="stat-card-count-row">
              <span className="stat-card-icon">{card.icon}</span>
              <span className="stat-card-count">{card.count}</span>
            </div>
            <div className="stat-card-subtitle">{card.subtitle}</div>
          </StatCardItemStyleWrapper>
        ))}
      </StatCardsStyleWrapper>
      <ActiontechTableWrapper loading={tableLoading}>
        <TableToolbar
          refreshButton={{
            refresh: sqlList.refresh,
            disabled: tableLoading
          }}
          searchInput={{
            placeholder: t('globalDashboard.sql.toolbar.searchPlaceholder'),
            onChange: setSearchKeyword,
            onSearch: () => {
              refreshBySearchKeyword();
            }
          }}
        />
        <ActiontechTable
          dataSource={sqlList.data?.list}
          rowKey={(record) => record.sql_fingerprint ?? ''}
          columns={columns}
          actions={actions}
          pagination={{
            total: sqlList.data?.total ?? 0,
            current: pagination.page_index,
            pageSize: pagination.page_size
          }}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
        />
      </ActiontechTableWrapper>
    </SqlGovernancePanelStyleWrapper>
  );
};

export default SqlGovernancePanel;
