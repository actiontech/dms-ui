import {
  ActiontechTable,
  ActiontechTableWrapper,
  CustomAvatar,
  CustomSegmentedFilter,
  getErrorMessage,
  ResponseCode,
  ROUTE_PATHS,
  TableToolbar,
  useTableRequestParams,
  useTableFilterContainer,
  TableFilterContainer,
  FilterCustomProps
} from '@actiontech/dms-kit';
import {
  CheckboxMultipleBlankFilled,
  ClockCircleOutlined,
  EditFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import { useRequest } from 'ahooks';
import { message, Space, Typography } from 'antd';
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
import { workflowPanelTableActions } from './action';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { GlobalDashboardService } from '@actiontech/shared/lib/api/sqle';
import { GlobalWorkflowListItemWorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { parse2ReactRouterPath } from '@actiontech/shared';
import {
  workflowFilterStatusOptions,
  workflowTypeLabelDictionary
} from './data';
import DataExportWorkflows from '@actiontech/shared/lib/api/base/service/DataExportWorkflows';
import { UserService } from '@actiontech/shared/lib/api/base';
import { DmsApi } from '@actiontech/shared/lib/api';
import type { IOpsType } from '@actiontech/shared/lib/api/base/service/common';
import { useCurrentUser } from '@actiontech/shared/lib/features';
// #if [ee]
import ExportGlobalWorkflowButton from './ExportGlobalWorkflowButton';
// #endif

const DATA_MASKING_APPROVALS_TAB = 'Approvals';

type WorkflowPanelProps = {
  projectId?: string;
  instanceId?: string;
  refreshSignal?: number;
  initialCard?: GetGlobalWorkflowListV2FilterCardEnum;
  onExportFinished?: () => void;
};

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  projectId,
  instanceId,
  refreshSignal,
  initialCard,
  onExportFinished
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const { bindProjects } = useCurrentUser();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [workflowType, setWorkflowType] =
    useState<GetGlobalWorkflowListV2WorkflowTypeEnum | null>(null);
  const [workflowCard, setWorkflowCard] =
    useState<GetGlobalWorkflowListV2FilterCardEnum>(
      initialCard ?? GetGlobalWorkflowListV2FilterCardEnum.pending_for_me
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
        workflow_type: workflowType ?? undefined,
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
        tableFilterInfo,
        workflowType
      ]
    }
  );

  const { data: userListData } = useRequest(() =>
    UserService.ListUsers({ page_size: 9999 })
  );

  const userOptions = useMemo(() => {
    return (userListData?.data?.data ?? []).map((u) => ({
      value: u.uid,
      label: (
        <Space>
          <CustomAvatar
            noTips
            size="small"
            name={(u.name?.[0] ?? '').toUpperCase()}
          />
          <Typography.Text>{u.name}</Typography.Text>
        </Space>
      ),
      text: u.name
    }));
  }, [userListData]);

  const opsTypeProjectIds = useMemo(() => {
    if (projectId) {
      return [projectId];
    }
    return Array.from(
      new Set(
        bindProjects
          .map((project) => project.project_id)
          .filter((id): id is string => Boolean(id))
      )
    );
  }, [projectId, bindProjects]);

  const { data: opsTypeList } = useRequest(
    async () => {
      if (opsTypeProjectIds.length === 0) {
        return [] as IOpsType[];
      }
      const results = await Promise.all(
        opsTypeProjectIds.map((uid) =>
          DmsApi.ProjectService.ListOpsTypes({
            page_size: 1000,
            project_uid: uid
          })
            .then((res) => {
              if (res.data.code === ResponseCode.SUCCESS) {
                return res.data.data ?? [];
              }
              return [] as IOpsType[];
            })
            .catch(() => [] as IOpsType[])
        )
      );
      const byUid = new Map<string, IOpsType>();
      results.flat().forEach((opsType) => {
        if (opsType.uid) {
          byUid.set(opsType.uid, opsType);
        }
      });
      return Array.from(byUid.values());
    },
    {
      refreshDeps: [opsTypeProjectIds]
    }
  );

  const opsTypeOptions = useMemo(
    () =>
      (opsTypeList ?? []).map((opsType) => ({
        label: opsType.name ?? '',
        value: opsType.uid ?? ''
      })),
    [opsTypeList]
  );

  const openWorkflow = useCallback(
    async (record: IGlobalWorkflowListItem) => {
      const projectID = record.project_uid?.trim();
      const workflowId = record.workflow_id?.trim();
      if (!projectID || !workflowId) {
        messageApi.warning(t('globalDashboard.common.missingProject'));
        return;
      }

      if (
        record.workflow_type ===
        GlobalWorkflowListItemWorkflowTypeEnum.data_export
      ) {
        try {
          const res = await DataExportWorkflows.GetDataExportWorkflow({
            project_uid: projectID,
            data_export_workflow_uid: workflowId
          });
          const unmaskingWorkflowUid =
            res?.data?.data?.unmasking_workflow?.unmasking_workflow_uid?.trim();
          if (
            res?.data?.code === ResponseCode.SUCCESS &&
            unmaskingWorkflowUid
          ) {
            const approvalsPath = parse2ReactRouterPath(
              ROUTE_PATHS.BASE.DATA_MASKING.index,
              {
                params: { projectID },
                queries: {
                  active: DATA_MASKING_APPROVALS_TAB,
                  workflowId: unmaskingWorkflowUid
                }
              }
            );
            window.open(approvalsPath, '_blank');
            return;
          }
        } catch {
          // 解析失败时回落导出详情，避免阻断原有打开路径
        }

        window.open(
          parse2ReactRouterPath(ROUTE_PATHS.BASE.DATA_EXPORT.detail, {
            params: { projectID, workflowID: workflowId }
          }),
          '_blank'
        );
        return;
      }

      window.open(
        parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail, {
          params: { projectID, workflowId }
        }),
        '_blank'
      );
    },
    [t, messageApi]
  );

  const columns = useMemo(
    () => workflowPanelColumns(openWorkflow),
    [openWorkflow]
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<
      IGlobalWorkflowListItem,
      GlobalDashboardWorkflowTableFilterParam
    >(columns, updateTableFilterInfo);

  const filterCustomProps = useMemo(
    () =>
      new Map<keyof IGlobalWorkflowListItem, FilterCustomProps>([
        ['status', { options: workflowFilterStatusOptions() }],
        ['updated_at', { showTime: true }],
        ['create_user_name', { options: userOptions }],
        ['created_at', { showTime: true }],
        ['ops_type', { options: opsTypeOptions }]
      ]),
    [userOptions, opsTypeOptions]
  );

  const actions = useMemo(
    () => workflowPanelTableActions(workflowCard, openWorkflow),
    [workflowCard, openWorkflow]
  );

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
    },
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.view_all,
      title: t('globalDashboard.workflow.card.viewAll'),
      subtitle: t('globalDashboard.workflow.card.viewAllSubtitle'),
      count: workflowStats.data?.data.data?.view_all_count ?? 0,
      icon: (
        <CheckboxMultipleBlankFilled
          color="currentColor"
          width={20}
          height={20}
        />
      ),
      accentColor:
        sqleTheme.globalDashboard.filterCardAccent.workflow[
          GetGlobalWorkflowListV2FilterCardEnum.view_all
        ]
    }
  ];

  return (
    <>
      {messageContextHolder}
      {/* #if [ee] */}
      <ExportGlobalWorkflowButton
        filterCard={workflowCard}
        workflowType={workflowType}
        projectId={projectId}
        instanceId={instanceId}
        tableFilterInfo={tableFilterInfo}
        searchKeyword={searchKeyword}
        onExportFinished={onExportFinished}
      />
      {/* #endif */}
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
        >
          <CustomSegmentedFilter<GetGlobalWorkflowListV2WorkflowTypeEnum | null>
            value={workflowType}
            onChange={(val) => {
              setWorkflowType(val);
            }}
            labelDictionary={workflowTypeLabelDictionary()}
            options={[
              GetGlobalWorkflowListV2WorkflowTypeEnum.sql_release,
              GetGlobalWorkflowListV2WorkflowTypeEnum.data_export
            ]}
            withAll
          />
        </TableToolbar>
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
          actions={actions}
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
