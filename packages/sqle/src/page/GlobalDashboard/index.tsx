import { PageHeader, SegmentedTabs } from '@actiontech/shared';
import useDashboardFilter from './hooks/useDashboardFilter';
import GlobalDashboardTableFilter from './components/TableFilter';
import { useState, useMemo } from 'react';
import { GlobalDashBoardSegmentedEnum } from './index.type';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import PendingWorkOrder from './List/PendingWorkOrder';
import PendingSql from './List/PendingSql';
import InitiatedWorkOrder from './List/InitiatedWorkOrder';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';

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
    initiatedWorkflowOrderStatistics
  } = useDashboardFilter();

  const [activeKey, setActiveKey] = useState(
    GlobalDashBoardSegmentedEnum.PendingWorkOrder
  );

  const onRefresh = () => {
    if (activeKey === GlobalDashBoardSegmentedEnum.PendingWorkOrder) {
      eventEmitter.emit(EmitterKey.Refresh_Global_Dashboard_Pending_Work_Order);
    } else if (activeKey === GlobalDashBoardSegmentedEnum.PendingSqlRecord) {
      eventEmitter.emit(EmitterKey.Refresh_Global_Dashboard_Pending_Sql);
    } else if (activeKey === GlobalDashBoardSegmentedEnum.InitiatedWorkOrder) {
      eventEmitter.emit(
        EmitterKey.Refresh_Global_Dashboard_Initiated_Work_Order
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
            {pendingWorkflowOrderStatistics}
          </Space>
        ),
        value: GlobalDashBoardSegmentedEnum.PendingWorkOrder,
        children: (
          <PendingWorkOrder
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
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
      },
      {
        label: (
          <Space>
            {t('globalDashboard.initiatedWorkOrder')}
            {initiatedWorkflowOrderStatistics}
          </Space>
        ),
        value: GlobalDashBoardSegmentedEnum.InitiatedWorkOrder,
        children: (
          <InitiatedWorkOrder
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
          />
        ),
        destroyInactivePane: true
      }
    ];
  }, [
    t,
    filterValues,
    updateFilterValue,
    pendingSqlStatistics,
    pendingWorkflowOrderStatistics,
    initiatedWorkflowOrderStatistics
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
