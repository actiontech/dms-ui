import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from 'antd5';
import ChartWrapper from '../../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../../components/CardWrapper';
import { BasicButton } from '@actiontech/shared';
import TableTopList, {
  ITableTopList
} from '../../../../../components/ChartCom/TableTopList';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IcoScanId } from '../../../../../icon/Scan';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { IRiskAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const ScanRiskList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID } = useCurrentProject();

  const [data, setData] = useState<IRiskAuditPlan[]>();
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.getRiskAuditPlanV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data.data ?? []);
      }
    }
  );

  const onGetMore = () => {
    navigate(`/sqle/project/${projectID}/auditPlan`);
  };

  const tableProps: ITableTopList<IRiskAuditPlan> = {
    apiLoading: loading,
    rowKey: 'audit_plan_report_id',
    errorCont: errorMessage,
    dataSource: data?.slice(0, 10), // todo: 数据回来为什么是大于 10 条的
    emptyCont: t('common.tip.no_data'),
    onRefresh: () => {
      getApiData();
    }
  };

  const columnData: () => ITableTopList<IRiskAuditPlan>['columns'] = () => {
    return [
      {
        dataIndex: 'audit_plan_report_timestamp',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.name'
        ),
        render: (name: string, record: IRiskAuditPlan) => {
          if (!name) return '-';
          return (
            <TableColumnWithIconStyleWrapper>
              <span>
                <IcoScanId />
              </span>
              <Link
                data-testid="report-time"
                to={`/sqle/project/${projectID}/auditPlan/detail/${record.audit_plan_name}/report/${record.audit_plan_report_id}`}
              >
                {name}
              </Link>
            </TableColumnWithIconStyleWrapper>
          );
        }
      },
      {
        dataIndex: 'audit_plan_name',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.source'
        ),
        render(name: string) {
          if (!name) {
            return '-';
          }

          return (
            <Link to={`project/${projectID}/auditPlan/detail/${name}`}>
              {name}
            </Link>
          );
        }
      },
      {
        dataIndex: 'audit_plan_report_timestamp',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.time'
        ),
        render(time: string) {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'risk_sql_count',
        title: t(
          'projectManage.projectOverview.auditPlanRisk.tableColumn.count'
        ),
        render(count: number) {
          if (!count) return '-';
          return (
            <Typography.Text
              strong
              className="flex-display flex-end-horizontal"
            >
              {formatParamsBySeparator(count)}
            </Typography.Text>
          );
        }
      }
    ];
  };

  return (
    <CardWrapper
      title={t('projectManage.projectOverview.auditPlanRisk.title')}
      extraNode={
        <BasicButton size="small" onClick={onGetMore}>
          {t('common.showMore')}
        </BasicButton>
      }
    >
      <ChartWrapper
        loading={loading}
        errorInfo={errorMessage}
        dataLength={data?.length ?? 0}
        emptyCont={t('common.tip.no_data')}
        onRefresh={() => {
          getApiData();
        }}
      >
        <TableTopList hideTop3Style {...tableProps} columns={columnData()} />
      </ChartWrapper>
    </CardWrapper>
  );
};

export default ScanRiskList;
