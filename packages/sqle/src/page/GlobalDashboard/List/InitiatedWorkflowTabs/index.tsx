import React, { useState, useMemo } from 'react';
import { SegmentedTabs } from '@actiontech/shared';
import { SegmentedTabsProps } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { GlobalDashboardWorkflowTabsProps } from '../../index.type';
import ExecuteWorkflow from './ExecuteWorkflow';
import ExportWorkflow from './ExportWorkflow';

enum InitiatedWorkOrderTabEnum {
  Execute = 'execute',
  Export = 'export'
}

const InitiatedWorkflowTabs: React.FC<GlobalDashboardWorkflowTabsProps> = ({
  filterValues,
  updateFilterValue,
  workflowOrderStatistics,
  exportWorkflowOrderStatistics
}) => {
  const { t } = useTranslation();
  const [innerActiveKey, setInnerActiveKey] = useState(
    InitiatedWorkOrderTabEnum.Execute
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
        value: InitiatedWorkOrderTabEnum.Execute,
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
            {exportWorkflowOrderStatistics}
          </Space>
        ),
        value: InitiatedWorkOrderTabEnum.Export,
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
    workflowOrderStatistics,
    filterValues,
    updateFilterValue,
    exportWorkflowOrderStatistics
  ]);

  return (
    <SegmentedTabs
      activeKey={innerActiveKey}
      onChange={(key) => {
        setInnerActiveKey(key as InitiatedWorkOrderTabEnum);
      }}
      items={innerTabItems}
    />
  );
};

export default InitiatedWorkflowTabs;
