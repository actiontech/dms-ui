import { useTranslation } from 'react-i18next';
import { IAuditPlanRiskProps } from './index.type';
import { AuditPlanRiskColumns } from './columns';
import { useMemo } from 'react';
import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import { TableTitleStyleWrapper } from '../CommonTable/style';
import { IconAuditPlanTaskList } from '../../../icon/Dashboard';
import { CustomToolbar } from '../CommonTable/CustomToolbar';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { IGetRiskAuditPlanV1Params } from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import { IRiskAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '../CommonTable';

const AuditPlanRiskList: React.FC<IAuditPlanRiskProps> = ({
  projectName,
  projectID
}) => {
  const { t } = useTranslation();
  const columns = useMemo(() => AuditPlanRiskColumns(projectID), [projectID]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data, loading, refresh } = useRequest(() => {
    //todo: 此处接口暂时没有提供page_index和page_size参数，暂时使用前端截取的方式
    const params: IGetRiskAuditPlanV1Params = {
      // page_index: 1,
      // page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      project_name: projectName
    };
    return handleTableRequestError(statistic.getRiskAuditPlanV1(params));
  });

  return (
    <>
      <CustomToolbar refreshButton={{ refresh, disabled: loading }}>
        <TableTitleStyleWrapper>
          <IconAuditPlanTaskList />
          {t('dashboard.title.auditPlanRisk')}
        </TableTitleStyleWrapper>
      </CustomToolbar>
      <ActiontechTable
        dataSource={data?.list?.slice(0, DASHBOARD_COMMON_GET_ORDER_NUMBER)}
        rowKey={(record: IRiskAuditPlan) => {
          return `${record?.audit_plan_report_id}`;
        }}
        pagination={false}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
      />
    </>
  );
};

export default AuditPlanRiskList;
