import React, { useState, useMemo } from 'react';
import { SegmentedTabs } from '@actiontech/dms-kit';
import { SegmentedTabsProps } from '@actiontech/dms-kit/es/components/SegmentedTabs/SegmentedTabs.types';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { GlobalDashboardPendingWorkflowTabsProps } from '../../index.type';
import ExecuteWorkflow from './ExecuteWorkflow';
import ExportWorkflow from './ExportWorkflow';

enum PendingWorkflowTabEnum {
  Execute = 'execute',
  Export = 'export'
}

const PendingWorkOrderTabs: React.FC<
  GlobalDashboardPendingWorkflowTabsProps
> = ({
  filterValues,
  updateFilterValue,
  pendingWorkflowOrderStatistics,
  pendingExportWorkflowOrderStatistics
}) => {
  const { t } = useTranslation();
  const [innerActiveKey, setInnerActiveKey] = useState(
    PendingWorkflowTabEnum.Execute
  );

  const innerTabItems = useMemo<SegmentedTabsProps['items']>(() => {
    return [
      {
        label: (
          <Space>
            {t('globalDashboard.onlineWorkOrder')}
            {pendingWorkflowOrderStatistics}
          </Space>
        ),
        value: PendingWorkflowTabEnum.Execute,
        children: (
          <ExecuteWorkflow
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
          />
        ),
        destroyInactivePane: true
      },
      {
        label: (
          <Space>
            {t('globalDashboard.exportWorkOrder')}
            {pendingExportWorkflowOrderStatistics}
          </Space>
        ),
        value: PendingWorkflowTabEnum.Export,
        children: (
          <ExportWorkflow
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
    filterValues,
    updateFilterValue,
    pendingExportWorkflowOrderStatistics
  ]);

  return (
    <SegmentedTabs
      activeKey={innerActiveKey}
      onChange={(key) => {
        setInnerActiveKey(key as PendingWorkflowTabEnum);
      }}
      items={innerTabItems}
    />
  );
};

export default PendingWorkOrderTabs;
