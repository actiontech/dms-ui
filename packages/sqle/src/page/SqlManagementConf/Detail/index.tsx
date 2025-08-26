import {
  EmptyBox,
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps,
  useTypedNavigate,
  useTypedParams,
  useTypedQuery
} from '@actiontech/shared';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import ConfDetailOverview from './Overview';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useState } from 'react';
import ScanTypeSqlCollection from './ScanTypeSqlCollection/indx';
import { useBoolean, useRequest } from 'ahooks';
import { useLocation } from 'react-router-dom';
import { SqleApi } from '@actiontech/shared/lib/api';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Result, Space } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from './index.data';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SqlManagementConfDetailPageHeaderActions } from './action';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useScanTypeVerify from '../Common/ConfForm/useScanTypeVerify';

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
  const navigate = useTypedNavigate();
  const { projectName } = useCurrentProject();

  const [activeKey, setActiveKey] = useState(
    SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY
  );
  const [exporting, { setTrue: exportPending, setFalse: exportDone }] =
    useBoolean();

  const [auditing, { setTrue: auditPending, setFalse: auditDone }] =
    useBoolean();

  const [messageApi, contextMessageHolder] = message.useMessage();

  const { isPerformanceCollectScanType } = useScanTypeVerify();

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
        navigate(location.pathname, { replace: true });
      } else if (searchParams?.active_audit_plan_id) {
        navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail, {
          params: { projectID, id: id ?? '' },
          queries: { active_audit_plan_id: tab },
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
    onExport: exportScanTypeSqlDetail,
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
                  {pageHeaderActions.export}
                  {pageHeaderActions.immediately_audit}
                </Space>
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
