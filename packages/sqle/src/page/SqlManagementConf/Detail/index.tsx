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
import { useCallback, useMemo, useState } from 'react';
import ScanTypeSqlCollection from './ScanTypeSqlCollection/indx';
import { useBoolean, useRequest } from 'ahooks';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Result, Space } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from './index.data';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import usePermission from '@actiontech/shared/lib/global/usePermission/usePermission';

const ConfDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { projectName } = useCurrentProject();

  const [activeKey, setActiveKey] = useState(
    SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY
  );
  const [exporting, { setTrue: exportPending, setFalse: exportDone }] =
    useBoolean();

  const [auditing, { setTrue: auditPending, setFalse: auditDone }] =
    useBoolean();

  const [messageApi, contextMessageHolder] = message.useMessage();

  const { checkDbServicePermission } = usePermission();

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
    return checkDbServicePermission(
      OpPermissionItemOpPermissionTypeEnum.save_audit_plan,
      data?.instance_id
    );
  }, [data?.instance_id, checkDbServicePermission]);

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
              <TableRefreshButton refresh={onRefresh} />
            </Space>
          }
        />
      )}
    </>
  );
};

export default ConfDetail;
