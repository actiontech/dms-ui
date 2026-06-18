import {
  EmptyBox,
  SegmentedTabsProps,
  PageHeader,
  SegmentedTabs
} from '@actiontech/dms-kit';
import {
  useTypedNavigate,
  useTypedParams,
  useTypedQuery
} from '@actiontech/shared';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import ConfDetailOverview from './Overview';
import { TableRefreshButton } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { useCallback, useState } from 'react';
import ScanTypeSqlCollection from './ScanTypeSqlCollection/indx';
import { useBoolean, useRequest } from 'ahooks';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  useCurrentProject,
  useCurrentUser,
  useUserOperationPermission
} from '@actiontech/shared/lib/global';
import { Result, Space } from 'antd';
import { getErrorMessage } from '@actiontech/dms-kit';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from './index.data';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { DownArrowLineOutlined } from '@actiontech/icons';
import { exportSqlManageRemediationV1ExportScopeEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';

const ConfDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const { id } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail>();
  const extractQueries = useTypedQuery();
  const searchParams = extractQueries(
    ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { projectName, projectArchive } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();

  const [activeKey, setActiveKey] = useState(
    SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY
  );
  const [exporting, { setTrue: exportPending, setFalse: exportDone }] =
    useBoolean();
  const [
    remediationExporting,
    { setTrue: remediationExportPending, setFalse: remediationExportDone }
  ] = useBoolean();

  const [auditing, { setTrue: auditPending, setFalse: auditDone }] =
    useBoolean();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const { isPerformanceCollectScanType } = useScanTypeVerify();
  const {
    exportFormatModalVisible,
    showExportFormatModal,
    hideExportFormatModal,
    selectedExportFormat,
    setSelectedExportFormat
  } = useExportFormatModal(GetAuditPlanSQLExportReqV1ExportFormatEnum.csv);
  const {
    data,
    error,
    refresh: refreshAuditPlanDetail
  } = useRequest(() =>
    SqleApi.InstanceAuditPlanService.getInstanceAuditPlanDetailV2({
      project_name: projectName,
      instance_audit_plan_id: id ?? ''
    }).then((res) => {
      if (searchParams?.active_audit_plan_id) {
        setActiveKey(searchParams.active_audit_plan_id);
      }
      return {
        ...res.data.data,
        audit_plans: res.data.data?.audit_plans?.filter(
          (i) => !isPerformanceCollectScanType(i.audit_plan_type?.type)
        )
      };
    })
  );
  const handleChangeTable = useCallback(
    (tab: string) => {
      setActiveKey(tab);
      if (tab === SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY) {
        navigate(location.pathname, {
          replace: true
        });
      } else if (searchParams?.active_audit_plan_id) {
        navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail, {
          params: {
            projectID,
            id: id ?? ''
          },
          queries: {
            active_audit_plan_id: tab
          },
          replace: true
        });
      }
    },
    [
      id,
      location.pathname,
      navigate,
      projectID,
      searchParams?.active_audit_plan_id
    ]
  );

  const hasOpPermission = useMemo(() => {
    return isHaveServicePermission(
      OpPermissionItemOpPermissionTypeEnum.save_audit_plan,
      data?.instance_id
    );
  }, [data?.instance_id, isHaveServicePermission]);

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const remediationExportPermission = useMemo(() => {
    return (actionPermission || hasOpPermission) && !projectArchive;
  }, [actionPermission, hasOpPermission, projectArchive]);

  const items: SegmentedTabsProps['items'] = [
    {
      label: t('managementConf.detail.overview.title'),
      value: SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY,
      children: (
        <ConfDetailOverview
          activeTabKey={activeKey}
          handleChangeTab={handleChangeTable}
          instanceAuditPlanId={id ?? ''}
          refreshAuditPlanDetail={refreshAuditPlanDetail}
        />
      )
    },
    ...(data?.audit_plans?.map<SegmentedTabsProps['items'][0]>((v) => ({
      label: v.audit_plan_type?.desc,
      value: v.audit_plan_type?.audit_plan_id?.toString() ?? '',
      children: (
        <ScanTypeSqlCollection
          instanceAuditPlanId={id ?? ''}
          auditPlanId={v.audit_plan_type?.audit_plan_id?.toString() ?? ''}
          auditPlanType={v.audit_plan_type?.type ?? ''}
          activeTabKey={activeKey}
          instanceType={data.instance_type ?? ''}
          instanceName={data.instance_name ?? ''}
          exportPending={exportPending}
          exportDone={exportDone}
          remediationExportPending={remediationExportPending}
          remediationExportDone={remediationExportDone}
        />
      )
    })) ?? [])
  ];
  const onRefresh = () => {
    if (activeKey === SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY) {
      eventEmitter.emit(EmitterKey.Refresh_Sql_Management_Conf_Overview_List);
    } else {
      eventEmitter.emit(EmitterKey.Refresh_Sql_Management_Conf_Detail_Sql_List);
    }
  };
  const handleExportFormatConfirm = () => {
    hideExportFormatModal();
    eventEmitter.emit(
      EmitterKey.Export_Sql_Management_Conf_Detail_Sql_List,
      selectedExportFormat
    );
  };

  const exportScanTypeRemediation = () => {
    eventEmitter.emit(EmitterKey.Export_Sql_Management_Conf_Detail_Remediation);
  };

  const exportDataSourceRemediation = () => {
    if (!remediationExportPermission || !data?.instance_id) {
      return;
    }
    remediationExportPending();
    const hideLoading = messageApi.loading(
      t('managementConf.detail.remediationExportTips'),
      0
    );

    SqlManage.exportSqlManageRemediationV1(
      {
        project_name: projectName,
        export_scope: exportSqlManageRemediationV1ExportScopeEnum.data_source,
        filter_instance_id: data.instance_id
      },
      { responseType: 'blob' }
    )
      .then((res) => {
        if (res.status === 200) {
          messageApi.success(
            t('managementConf.detail.remediationExportSuccessTips')
          );
        }
      })
      .finally(() => {
        hideLoading();
        remediationExportDone();
      });
  };

  const onAuditImmediately = () => {
    auditPending();
    SqleApi.InstanceAuditPlanService.auditPlanTriggerSqlAuditV1({
      project_name: projectName,
      instance_audit_plan_id: id ?? '',
      audit_plan_id: activeKey
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('managementConf.detail.auditImmediatelySuccessTips')
          );
          eventEmitter.emit(
            EmitterKey.Refresh_Sql_Management_Conf_Detail_Sql_List
          );
        }
      })
      .finally(() => {
        auditDone();
      });
  };
  const pageHeaderActions = SqlManagementConfDetailPageHeaderActions({
    onAuditImmediately,
    auditPending: auditing,
    onExport: showExportFormatModal,
    exportPending: exporting
  });
  return (
    <>
      {contextMessageHolder}
      <PageHeader
        title={t('managementConf.detail.title', {
          instanceName:
            data?.instance_name || t('managementConf.detail.staticScanTypes')
        })}
        extra={<BackToConf />}
      />
      {error ? (
        <Result
          status="error"
          title={t('common.request.noticeFailTitle')}
          subTitle={getErrorMessage(error)}
        />
      ) : (
        <SegmentedTabs
          activeKey={activeKey}
          onChange={handleChangeTable}
          items={items}
          segmentedRowClassName="flex-space-between"
          segmentedRowExtraContent={
            <Space>
              <EmptyBox if={activeKey !== SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY}>
                <Space>
                  <BasicButton
                    disabled={exporting}
                    onClick={exportScanTypeSqlDetail}
                  >
                    {t('managementConf.detail.export')}
                  </BasicButton>
                  <EmptyBox if={remediationExportPermission}>
                    <BasicButton
                      disabled={remediationExporting}
                      onClick={exportScanTypeRemediation}
                      icon={<DownArrowLineOutlined />}
                    >
                      {t('managementConf.detail.remediationExport')}
                    </BasicButton>
                  </EmptyBox>
                  {hasOpPermission && (
                    <BasicButton
                      loading={auditing}
                      onClick={onAuditImmediately}
                      type="primary"
                    >
                      {t('managementConf.detail.auditImmediately')}
                    </BasicButton>
                  )}
                </Space>
              </EmptyBox>
              <EmptyBox
                if={
                  activeKey === SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY &&
                  remediationExportPermission
                }
              >
                <BasicButton
                  disabled={remediationExporting}
                  onClick={exportDataSourceRemediation}
                  icon={<DownArrowLineOutlined />}
                >
                  {t('managementConf.detail.remediationExport')}
                </BasicButton>
              </EmptyBox>
              <TableRefreshButton refresh={onRefresh} />
            </Space>
          }
        />
      )}
      <ExportFormatModal
        open={exportFormatModalVisible}
        selectedFormat={selectedExportFormat}
        onFormatChange={setSelectedExportFormat}
        onConfirm={handleExportFormatConfirm}
        onCancel={hideExportFormatModal}
      />
    </>
  );
};
export default ConfDetail;
