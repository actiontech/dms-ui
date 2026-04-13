import { TableRefreshButton } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { PageHeader, ROUTE_PATHS, SegmentedTabs } from '@actiontech/dms-kit';
import { SegmentedTabsProps } from '@actiontech/dms-kit/es/components/SegmentedTabs/SegmentedTabs.types';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { Form, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useInstance from '../../hooks/useInstance';
import GlobalDashboardTableFilter from './components/TableFilter';
import { GlobalDashboardFilterType } from './index.type';
import { DashboardTabKey } from './constants';
import WorkflowPanel from './components/WorkflowPanel';
import SqlGovernancePanel from './components/SqlGovernancePanel';
import AccountPanel from './components/AccountPanel';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';

const GlobalDashBoard = () => {
  const { t } = useTranslation();
  const { bindProjects, isAdmin } = useCurrentUser();
  const extractQuery = useTypedQuery();
  const navigate = useTypedNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTabKey>(
    DashboardTabKey.Workflow
  );
  const [refreshSignals, setRefreshSignals] = useState({
    [DashboardTabKey.Workflow]: 0,
    [DashboardTabKey.SqlGovernance]: 0,
    [DashboardTabKey.Account]: 0
  });

  const [form] = Form.useForm<GlobalDashboardFilterType>();
  const projectId = Form.useWatch('projectId', form);
  const instanceId = Form.useWatch('instanceId', form);

  const {
    updateInstanceList,
    instanceIDOptions,
    loading: getInstanceListLoading
  } = useInstance();

  const projectOptions = useMemo(() => {
    return bindProjects.map((project) => ({
      label: project.project_name,
      value: project.project_id
    }));
  }, [bindProjects]);

  const refreshCurrentTab = () => {
    setRefreshSignals((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + 1
    }));
  };

  const tabItems = useMemo<SegmentedTabsProps['items']>(() => {
    const items: SegmentedTabsProps['items'] = [
      {
        label: t('globalDashboard.tab.workflow'),
        value: DashboardTabKey.Workflow,
        destroyInactivePane: true,
        children: (
          <WorkflowPanel
            projectId={projectId}
            instanceId={instanceId}
            refreshSignal={refreshSignals[DashboardTabKey.Workflow]}
          />
        )
      },
      {
        label: t('globalDashboard.tab.sqlGovernance'),
        value: DashboardTabKey.SqlGovernance,
        destroyInactivePane: true,
        children: (
          <SqlGovernancePanel
            projectId={projectId}
            instanceId={instanceId}
            refreshSignal={refreshSignals[DashboardTabKey.SqlGovernance]}
          />
        )
      },
      // #if [provision]
      {
        label: t('globalDashboard.tab.account'),
        value: DashboardTabKey.Account,
        destroyInactivePane: true,
        children: (
          <AccountPanel
            projectId={projectId}
            instanceId={instanceId}
            refreshSignal={refreshSignals[DashboardTabKey.Account]}
            isAdmin={isAdmin}
          />
        )
      }
      // #endif
    ];

    return items;
  }, [t, projectId, instanceId, refreshSignals, isAdmin]);

  useEffect(() => {
    const searchParams = extractQuery(ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index);
    if (
      searchParams &&
      searchParams.tab &&
      Object.values(DashboardTabKey).includes(
        searchParams.tab as DashboardTabKey
      )
    ) {
      setActiveTab(searchParams.tab as DashboardTabKey);
    }
  }, [extractQuery]);

  return (
    <>
      <PageHeader
        title={
          <Space>
            {t('globalDashboard.pageTitle')}
            <TableRefreshButton refresh={refreshCurrentTab} />
          </Space>
        }
      />
      <SegmentedTabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as DashboardTabKey);
          navigate(ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index, {
            queries: { tab: key },
            replace: true
          });
        }}
        items={tabItems}
        segmentedRowClassName="flex-space-between"
        segmentedRowExtraContent={
          <GlobalDashboardTableFilter
            form={form}
            projectOptions={projectOptions}
            instanceIDOptions={instanceIDOptions}
            getInstanceListLoading={getInstanceListLoading}
            onProjectChange={(selectedProjectId) => {
              const projectName = projectOptions.find(
                (p) => p.value === selectedProjectId
              )?.label;
              if (projectName) {
                updateInstanceList({ project_name: projectName });
              }
              form.resetFields(['instanceId']);
            }}
          />
        }
      />
    </>
  );
};

export default GlobalDashBoard;
