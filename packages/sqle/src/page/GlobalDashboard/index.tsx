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
import { GetGlobalWorkflowListV2FilterCardEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';
// #if [ee]
import { ActionButton } from '@actiontech/shared';
import { DownArrowLineOutlined } from '@actiontech/icons';
import { useBoolean } from 'ahooks';
import { GetAuditPlanSQLExportReqV1ExportFormatEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useExportFormatModal } from '../../hooks/useExportFormatModal';
import ExportFormatModal from '../../components/ExportFormatModal';
import EmitterKey from '../../data/EmitterKey';
import EventEmitter from '../../utils/EventEmitter';
// #endif

const GlobalDashBoard = () => {
  const { t } = useTranslation();
  const { bindProjects, isAdmin } = useCurrentUser();
  const extractQuery = useTypedQuery();
  const navigate = useTypedNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTabKey>(
    DashboardTabKey.Workflow
  );
  const [initialWorkflowCard, setInitialWorkflowCard] = useState<
    GetGlobalWorkflowListV2FilterCardEnum | undefined
  >(undefined);
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

  // #if [ee]
  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  const {
    exportFormatModalVisible,
    showExportFormatModal,
    hideExportFormatModal,
    selectedExportFormat,
    setSelectedExportFormat
  } = useExportFormatModal(GetAuditPlanSQLExportReqV1ExportFormatEnum.csv);

  const handleExportFormatConfirm = () => {
    hideExportFormatModal();
    startExport();
    EventEmitter.emit(
      EmitterKey.Export_Global_Dashboard_Workflow_List,
      selectedExportFormat
    );
  };
  // #endif

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
            initialCard={initialWorkflowCard}
            // #if [ee]
            onExportFinished={finishExport}
            // #endif
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
  }, [
    t,
    projectId,
    instanceId,
    refreshSignals,
    isAdmin,
    initialWorkflowCard,
    // #if [ee]
    finishExport
    // #endif
  ]);

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
    if (
      searchParams?.card &&
      Object.values(GetGlobalWorkflowListV2FilterCardEnum).includes(
        searchParams.card as GetGlobalWorkflowListV2FilterCardEnum
      )
    ) {
      setInitialWorkflowCard(
        searchParams.card as GetGlobalWorkflowListV2FilterCardEnum
      );
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
        // #if [ee]
        extra={
          activeTab === DashboardTabKey.Workflow ? (
            <ActionButton
              text={t('globalDashboard.workflow.export.buttonText')}
              icon={<DownArrowLineOutlined />}
              onClick={showExportFormatModal}
              disabled={exportButtonDisabled}
            />
          ) : null
        }
        // #endif
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
      {/* #if [ee] */}
      <ExportFormatModal
        open={exportFormatModalVisible}
        selectedFormat={selectedExportFormat}
        onFormatChange={setSelectedExportFormat}
        onConfirm={handleExportFormatConfirm}
        onCancel={hideExportFormatModal}
      />
      {/* #endif */}
    </>
  );
};

export default GlobalDashBoard;
