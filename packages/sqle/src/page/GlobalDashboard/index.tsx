import { PageHeader, SegmentedTabs } from '@actiontech/dms-kit';
import { SegmentedTabsProps } from '@actiontech/dms-kit/es/components/SegmentedTabs/SegmentedTabs.types';
import useDashboardFilter from './hooks/useDashboardFilter';
import GlobalDashboardTableFilter from './components/TableFilter';
import { useState, useMemo } from 'react';
import { GlobalDashBoardSegmentedEnum } from './index.type';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import PendingWorkflowTabs from './List/PendingWorkflowTabs';
import PendingSql from './List/PendingSql';
import InitiatedWorkflowTabs from './List/InitiatedWorkflowTabs';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { TableRefreshButton } from '@actiontech/dms-kit/es/components/ActiontechTable';

const GlobalDashBoard = () => {
  const { t } = useTranslation();
  const {
    projectOptions,
    instanceIDOptions,
    form,
    getInstanceListLoading,
    filterValues,
    updateFilterValue,
    refreshStatistics,
    pendingSqlStatistics,
    pendingWorkflowOrderStatistics,
    initiatedWorkflowOrderStatistics,
    pendingExportWorkflowOrderStatistics,
    initiatedExportWorkflowOrderStatistics,
    filterAssignedToMe,
    toggleFilterAssignedToMe
  } = useDashboardFilter();
  const [activeKey, setActiveKey] = useState(
    GlobalDashBoardSegmentedEnum.PendingWorkOrder
  );
  const onRefresh = () => {
    if (activeKey === GlobalDashBoardSegmentedEnum.PendingWorkOrder) {
      eventEmitter.emit(EmitterKey.Refresh_Global_Dashboard_Execute_Work_Order);
      eventEmitter.emit(EmitterKey.Refresh_Global_Dashboard_Export_Work_Order);
    } else if (activeKey === GlobalDashBoardSegmentedEnum.PendingSqlRecord) {
      eventEmitter.emit(EmitterKey.Refresh_Global_Dashboard_Pending_Sql);
    } else if (activeKey === GlobalDashBoardSegmentedEnum.InitiatedWorkOrder) {
      eventEmitter.emit(
        EmitterKey.Refresh_Global_Dashboard_Initiated_Work_Order
      );
      eventEmitter.emit(
        EmitterKey.Refresh_Global_Dashboard_Initiated_Export_Work_Order
      );
    }
    refreshStatistics();
  };
  const tabItems = useMemo<SegmentedTabsProps['items']>(() => {
    return [
      {
        label: (
          <Space>
            {t('globalDashboard.pendingWorkOrder')}
            {(pendingWorkflowOrderStatistics ?? 0) +
              (pendingExportWorkflowOrderStatistics ?? 0)}
          </Space>
        ),
        value: GlobalDashBoardSegmentedEnum.PendingWorkOrder,
        children: (
          <PendingWorkflowTabs
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
            workflowOrderStatistics={pendingWorkflowOrderStatistics ?? 0}
            exportWorkflowOrderStatistics={
              pendingExportWorkflowOrderStatistics ?? 0
            }
            filterAssignedToMe={filterAssignedToMe}
            toggleFilterAssignedToMe={toggleFilterAssignedToMe}
          />
        ),
        destroyInactivePane: true
      },
      {
        label: (
          <Space>
            {t('globalDashboard.initiatedWorkOrder')}
            {(initiatedWorkflowOrderStatistics ?? 0) +
              (initiatedExportWorkflowOrderStatistics ?? 0)}
          </Space>
        ),
        value: GlobalDashBoardSegmentedEnum.InitiatedWorkOrder,
        children: (
          <InitiatedWorkflowTabs
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
            workflowOrderStatistics={initiatedWorkflowOrderStatistics ?? 0}
            exportWorkflowOrderStatistics={
              initiatedExportWorkflowOrderStatistics ?? 0
            }
          />
        ),
        destroyInactivePane: true
      },
      {
        label: (
          <Space>
            {t('globalDashboard.pendingSql.title')}
            {pendingSqlStatistics}
          </Space>
        ),
        value: GlobalDashBoardSegmentedEnum.PendingSqlRecord,
        children: (
          <PendingSql
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
          />
        ),
        destroyInactivePane: true
      }
    ];
  }, [
    t,
    pendingWorkflowOrderStatistics,
    pendingExportWorkflowOrderStatistics,
    filterValues,
    updateFilterValue,
    initiatedWorkflowOrderStatistics,
    initiatedExportWorkflowOrderStatistics,
    pendingSqlStatistics,
    filterAssignedToMe,
    toggleFilterAssignedToMe
  ]);
  return (
    <>
      <PageHeader
        title={
          <Space>
            {t('globalDashboard.pageTitle')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
      />
      <GlobalDashboardTableFilter
        form={form}
        projectOptions={projectOptions}
        instanceIDOptions={instanceIDOptions}
        getInstanceListLoading={getInstanceListLoading}
      />
      <SegmentedTabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
        items={tabItems}
      />
    </>
  );
};
export default GlobalDashBoard;
