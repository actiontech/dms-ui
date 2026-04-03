import {
  ActiontechTable,
  ActiontechTableWrapper,
  FilterCustomProps,
  getErrorMessage,
  TableFilterContainer,
  TableToolbar,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/dms-kit';
import {
  ClockCircleOutlined,
  EditFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import { useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatCardsStyleWrapper, StatCardItemStyleWrapper } from '../../style';
import { workflowPanelColumns } from './column';
import {
  GetGlobalWorkflowListV2FilterCardEnum,
  GetGlobalWorkflowListV2WorkflowTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { IGlobalWorkflowListItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { GlobalDashboardWorkflowTableFilterParam } from './index.type';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { GlobalDashboardService } from '@actiontech/shared/lib/api/sqle';

type WorkflowPanelProps = {
  projectId?: string;
  instanceId?: string;
  refreshSignal?: number;
};

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  projectId,
  instanceId,
  refreshSignal
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const [workflowCard, setWorkflowCard] =
    useState<GetGlobalWorkflowListV2FilterCardEnum>(
      GetGlobalWorkflowListV2FilterCardEnum.pending_for_me
    );

  const cursor = useRef<string | undefined>(undefined);
  const [requestErrorMessage, setRequestErrorMessage] = useState<
    string | undefined
  >(undefined);

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    pagination,
    setPagination,
    tableChange,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IGlobalWorkflowListItem,
    GlobalDashboardWorkflowTableFilterParam
  >();

  const resetPagination = useCallback(() => {
    setPagination((prev) => ({ page_index: 1, page_size: prev.page_size }));
  }, [setPagination]);

  useEffect(() => {
    cursor.current = undefined;
  }, [workflowCard, projectId, instanceId, refreshSignal, tableFilterInfo]);

  const workflowStats = useRequest(
    () =>
      GlobalDashboardService.GetGlobalWorkflowStatisticsV2({
        filter_project_uid: projectId,
        filter_instance_id: instanceId
      }),
    { refreshDeps: [projectId, instanceId, refreshSignal] }
  );

  const workflowList = useRequest(
    () => {
      if (pagination.page_index === 1) {
        cursor.current = undefined;
      }
      return GlobalDashboardService.GetGlobalWorkflowListV2({
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_card: workflowCard,
        filter_project_uid: projectId,
        filter_instance_id: instanceId,
        cursor: cursor.current ?? undefined,
        ...tableFilterInfo,
        keyword: searchKeyword?.trim() || undefined
      });
    },
    {
      onSuccess: (res) => {
        cursor.current = res.data?.data?.next_cursor;
        setRequestErrorMessage(undefined);
      },
      onError: (err) => {
        cursor.current = undefined;
        setRequestErrorMessage(getErrorMessage(err));
      },
      refreshDeps: [
        pagination,
        projectId,
        instanceId,
        workflowCard,
        refreshSignal,
        tableFilterInfo
      ]
    }
  );

  const columns = useMemo(() => workflowPanelColumns(), []);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IGlobalWorkflowListItem, FilterCustomProps>([
      [
        'workflow_type',
        {
          options: [
            {
              label: t(
                'globalDashboard.workflow.workflowTypeLabel.sql_release'
              ),
              value: GetGlobalWorkflowListV2WorkflowTypeEnum.sql_release
            },
            {
              label: t(
                'globalDashboard.workflow.workflowTypeLabel.data_export'
              ),
              value: GetGlobalWorkflowListV2WorkflowTypeEnum.data_export
            }
          ]
        }
      ]
    ]);
  }, [t]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<
      IGlobalWorkflowListItem,
      GlobalDashboardWorkflowTableFilterParam
    >(columns, updateTableFilterInfo);

  const tableLoading = workflowList.loading || workflowStats.loading;

  const cards = [
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.pending_for_me,
      title: t('globalDashboard.workflow.card.pendingMine'),
      subtitle: t('globalDashboard.workflow.card.pendingMineSubtitle'),
      count: workflowStats.data?.data.data?.pending_for_me_count ?? 0,
      icon: <ClockCircleOutlined color="currentColor" width={20} height={20} />,
      accentColor:
        sqleTheme.globalDashboard.filterCardAccent.workflow[
          GetGlobalWorkflowListV2FilterCardEnum.pending_for_me
        ]
    },
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me,
      title: t('globalDashboard.workflow.card.initiated'),
      subtitle: t('globalDashboard.workflow.card.initiatedSubtitle'),
      count: workflowStats.data?.data.data?.initiated_by_me_count ?? 0,
      icon: <EditFilled color="currentColor" width={20} height={20} />,
      accentColor:
        sqleTheme.globalDashboard.filterCardAccent.workflow[
          GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me
        ]
    },
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.archived,
      title: t('globalDashboard.workflow.card.archived'),
      subtitle: t('globalDashboard.workflow.card.archivedSubtitle'),
      count: workflowStats.data?.data.data?.archived_count ?? 0,
      icon: <ProfileSquareFilled color="currentColor" width={20} height={20} />,
      accentColor:
        sqleTheme.globalDashboard.filterCardAccent.workflow[
          GetGlobalWorkflowListV2FilterCardEnum.archived
        ]
    }
  ];

  return (
    <>
      <StatCardsStyleWrapper>
        {cards.map((card) => (
          <StatCardItemStyleWrapper
            key={card.key}
            $accentColor={card.accentColor}
            $active={workflowCard === card.key}
            onClick={() => {
              resetPagination();
              setWorkflowCard(card.key);
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
            refresh: workflowList.refresh,
            disabled: tableLoading
          }}
          filterButton={{
            filterButtonMeta,
            updateAllSelectedFilterItem
          }}
          searchInput={{
            placeholder: t(
              'globalDashboard.workflow.toolbar.searchPlaceholder'
            ),
            onChange: setSearchKeyword,
            onSearch: () => {
              refreshBySearchKeyword();
            }
          }}
        />
        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          disabled={tableLoading}
          filterCustomProps={filterCustomProps}
        />
        <ActiontechTable
          dataSource={workflowList.data?.data?.data?.workflows}
          rowKey="workflow_id"
          columns={columns}
          pagination={{
            total: workflowList.data?.data?.data?.total_nums ?? 0,
            current: pagination.page_index,
            pageSize: pagination.page_size
          }}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
        />
      </ActiontechTableWrapper>
    </>
  );
};

export default WorkflowPanel;
