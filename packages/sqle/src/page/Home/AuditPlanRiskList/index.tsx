import { useTranslation } from 'react-i18next';
import { IAuditPlanRiskProps } from './index.type';
import { AuditPlanRiskColumns } from './columns';
import { useMemo, useState } from 'react';
import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import {
  DashboardCommonListStyleWrapper,
  TableTitleStyleWrapper
} from '../CommonTable/style';
import { CustomToolbar } from '../CommonTable/CustomToolbar';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { IGetRiskAuditPlanV1Params } from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '../CommonTable';
import { ScanFilled } from '@actiontech/icons';
import {
  enrichRiskAuditPlansWithLevel,
  RiskAuditPlanWithLevel
} from './enrichRiskLevel';

const AuditPlanRiskList: React.FC<IAuditPlanRiskProps> = ({
  projectName,
  projectID
}) => {
  const { t } = useTranslation();
  const columns = useMemo(() => AuditPlanRiskColumns(projectID), [projectID]);
  const [dataSource, setDataSource] = useState<RiskAuditPlanWithLevel[]>([]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { loading, refresh } = useRequest(() => {
    //todo: 此处接口暂时没有提供page_index和page_size参数，暂时使用前端截取的方式
    const params: IGetRiskAuditPlanV1Params = {
      // page_index: 1,
      // page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      project_name: projectName
    };
    return handleTableRequestError(statistic.getRiskAuditPlanV1(params)).then(
      async (res) => {
        const sliced = (res.list ?? []).slice(
          0,
          DASHBOARD_COMMON_GET_ORDER_NUMBER
        );
        // 先落表再回填，避免列表区长时间空白
        setDataSource(sliced);
        const enriched = await enrichRiskAuditPlansWithLevel(
          projectName,
          sliced
        );
        setDataSource(enriched);
        return res;
      }
    );
  });

  return (
    <DashboardCommonListStyleWrapper className="audit-plan-risk-list">
      <CustomToolbar refreshButton={{ refresh, disabled: loading }}>
        <TableTitleStyleWrapper className="audit-plan-risk-title">
          <ScanFilled width={20} height={20} className="custom-icon" />
          {t('dashboard.title.auditPlanRisk')}
        </TableTitleStyleWrapper>
      </CustomToolbar>
      <ActiontechTable
        dataSource={dataSource}
        rowKey={(record: RiskAuditPlanWithLevel) => {
          return `${record?.audit_plan_report_id}`;
        }}
        pagination={false}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
      />
    </DashboardCommonListStyleWrapper>
  );
};

export default AuditPlanRiskList;
