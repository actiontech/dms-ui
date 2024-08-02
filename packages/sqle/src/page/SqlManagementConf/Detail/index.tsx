import { PageHeader, SegmentedTabs } from '@actiontech/shared';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';
import ConfDetailOverview from './Overview';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useState } from 'react';
import ScanTypeSqlCollection from './ScanTypeSqlCollection/indx';
import { useRequest } from 'ahooks';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Result } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from './index.data';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

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
          activeTabKey={activeKey}
          instanceType={data.instance_type ?? ''}
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

  return (
    <>
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
          segmentedRowExtraContent={<TableRefreshButton refresh={onRefresh} />}
        />
      )}
    </>
  );
};

export default ConfDetail;
