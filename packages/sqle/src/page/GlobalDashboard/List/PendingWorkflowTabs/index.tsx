import React, { useState, useMemo } from 'react';
import {
  BasicButton,
  SegmentedTabs,
  SegmentedTabsProps
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { GlobalDashboardWorkflowTabsProps } from '../../index.type';
import ExecuteWorkflow from './ExecuteWorkflow';
import ExportWorkflow from './ExportWorkflow';

enum PendingWorkflowTabEnum {
  Execute = 'execute',
  Export = 'export'
}

const PendingWorkOrderTabs: React.FC<GlobalDashboardWorkflowTabsProps> = ({
  filterValues,
  updateFilterValue,
  workflowOrderStatistics,
  exportWorkflowOrderStatistics,
  filterAssignedToMe,
  toggleFilterAssignedToMe
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
            {workflowOrderStatistics}
          </Space>
        ),
        value: PendingWorkflowTabEnum.Execute,
        children: (
          <ExecuteWorkflow
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
            filterAssignedToMe={filterAssignedToMe}
          />
        ),
        destroyInactivePane: true
      },
      {
        label: (
          <Space>
            {t('globalDashboard.exportWorkOrder')}
            {exportWorkflowOrderStatistics}
          </Space>
        ),
        value: PendingWorkflowTabEnum.Export,
        children: (
          <ExportWorkflow
            filterValues={filterValues}
            updateFilterValue={updateFilterValue}
            filterAssignedToMe={filterAssignedToMe}
          />
        ),
        destroyInactivePane: true
      }
    ];
  }, [
    t,
    workflowOrderStatistics,
    filterValues,
    updateFilterValue,
    exportWorkflowOrderStatistics,
    filterAssignedToMe
  ]);

  const renderSegmentedRowExtraContent = () => {
    // #if [ce]
    if (innerActiveKey === PendingWorkflowTabEnum.Export) {
      return null;
    }
    // #endif
    return (
      <BasicButton
        className={
          filterAssignedToMe ? 'switch-btn-active' : 'switch-btn-default'
        }
        size="small"
        onClick={toggleFilterAssignedToMe}
      >
        {t('globalDashboard.pendingMyAction')}
      </BasicButton>
    );
  };

  return (
    <SegmentedTabs
      activeKey={innerActiveKey}
      onChange={(key) => {
        setInnerActiveKey(key as PendingWorkflowTabEnum);
      }}
      items={innerTabItems}
      segmentedRowClassName="flex-space-between"
      segmentedRowExtraContent={renderSegmentedRowExtraContent()}
    />
  );
};

export default PendingWorkOrderTabs;
