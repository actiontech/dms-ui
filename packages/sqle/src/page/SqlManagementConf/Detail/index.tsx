import {
  BasicButton,
  EmptyBox,
  PageHeader,
  SegmentedTabs
} from '@actiontech/shared';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';
import ConfDetailOverview from './Overview';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ScanTypeSqlCollection from './ScanTypeSqlCollection';
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
import { Result, Space, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from './index.data';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { DownArrowLineOutlined } from '@actiontech/icons';
import { exportSqlManageRemediationV1ExportScopeEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import CreateSqlManagementException from '../../SqlManagementException/Modal/Create';

const ConfDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
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

  const {
    updateUserOperationPermission,
    loading: getUserOperationPermissionLoading,
    isHaveServicePermission
  } = useUserOperationPermission();

  const {
    data,
    error,
    refresh: refreshAuditPlanDetail
  } = useRequest(() =>
    instance_audit_plan
      .getInstanceAuditPlanDetailV1({
        project_name: projectName,
        instance_audit_plan_id: id ?? ''
      })
      .then((res) => {
        if (searchParams.has('active_audit_plan_id')) {
          setActiveKey(searchParams.get('active_audit_plan_id') as string);
        }
        return res.data.data;
      })
  );

  const handleChangeTable = useCallback(
    (tab: string) => {
      setActiveKey(tab);
      if (tab === SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY) {
        navigate(location.pathname, { replace: true });
      } else if (searchParams.has('active_audit_plan_id')) {
        navigate(
          {
            pathname: location.pathname,
            search: `active_audit_plan_id=${tab}`
          },
          { replace: true }
        );
      }
    },
    [location.pathname, navigate, searchParams]
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

  const exportButtonDisabled = exporting || remediationExporting;

  const scanTypeExportMenuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [];

    if (remediationExportPermission) {
      items.push({
        key: 'remediation',
        label: t('managementConf.detail.exportRemediationReport')
      });
    }

    items.push({
      key: 'scanTask',
      label: t('managementConf.detail.exportScanTaskReport')
    });

    return items;
  }, [remediationExportPermission, t]);

  const onScanTypeExportMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'remediation') {
      exportScanTypeRemediation();
      return;
    }
    if (key === 'scanTask') {
      exportScanTypeSqlDetail();
    }
  };

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
          hasOpPermission={hasOpPermission}
          getUserOperationPermissionLoading={getUserOperationPermissionLoading}
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
          auditPlanDesc={v.audit_plan_type?.desc}
          instanceId={data.instance_id}
          activeTabKey={activeKey}
          instanceType={data.instance_type ?? ''}
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

  const exportScanTypeSqlDetail = () => {
    eventEmitter.emit(EmitterKey.Export_Sql_Management_Conf_Detail_Sql_List);
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
    instance_audit_plan
      .auditPlanTriggerSqlAuditV1({
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

  useEffect(() => {
    updateUserOperationPermission();
  }, [updateUserOperationPermission]);

  return (
    <>
      {contextMessageHolder}
      <CreateSqlManagementException
        onCreated={() => {
          eventEmitter.emit(
            EmitterKey.Refresh_Sql_Management_Conf_Detail_Sql_List
          );
        }}
      />
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
                  <Dropdown
                    menu={{
                      items: scanTypeExportMenuItems,
                      onClick: onScanTypeExportMenuClick
                    }}
                    disabled={exportButtonDisabled}
                  >
                    <BasicButton
                      icon={<DownArrowLineOutlined />}
                      disabled={exportButtonDisabled}
                    >
                      {t('managementConf.detail.exportReport')}
                    </BasicButton>
                  </Dropdown>
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
                  {t('managementConf.detail.exportDataSourceRemediationReport')}
                </BasicButton>
              </EmptyBox>
              <TableRefreshButton refresh={onRefresh} />
            </Space>
          }
        />
      )}
    </>
  );
};

export default ConfDetail;
