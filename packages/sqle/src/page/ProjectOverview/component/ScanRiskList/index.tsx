import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../components/CardWrapper';
import { BasicButton } from '@actiontech/shared';
import TableTopList, {
  ITableTopList
} from '../../../../components/ChartCom/TableTopList';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { ScanTaskFilled } from '@actiontech/icons';
import RiskAuditLevelCell from '../../../../components/AuditResultMessage/RiskAuditLevelCell';
import {
  enrichRiskAuditPlansWithLevel,
  RiskAuditPlanWithLevel
} from '../../../Home/AuditPlanRiskList/enrichRiskLevel';

const ScanRiskList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID } = useCurrentProject();

  const [data, setData] = useState<RiskAuditPlanWithLevel[]>();
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.getRiskAuditPlanV1({ project_name: projectName }),
    {
      onSuccess: async (res) => {
        const list = (res.data.data ?? []).slice(0, 10);
        setData(list);
        const enriched = await enrichRiskAuditPlansWithLevel(projectName, list);
        setData(enriched);
      }
    }
  );

  const onGetMore = () => {
    navigate(`/sqle/project/${projectID}/audit-plan`);
  };

  const tableProps: ITableTopList<RiskAuditPlanWithLevel> = {
    apiLoading: loading,
    rowKey: 'audit_plan_report_id',
    errorCont: errorMessage,
    dataSource: data
  };

  const columnData: () => ITableTopList<RiskAuditPlanWithLevel>['columns'] =
    () => {
      return [
        {
          dataIndex: 'audit_plan_report_timestamp',
          title: t(
            'projectManage.projectOverview.auditPlanRisk.tableColumn.name'
          ),
          render: (name: string, record: RiskAuditPlanWithLevel) => {
            if (!name) return '-';
            return (
              <TableColumnWithIconStyleWrapper>
                <span>
                  <ScanTaskFilled />
                </span>
                <Link
                  data-testid="report-time"
                  to={`/sqle/project/${projectID}/audit-plan/detail/${record.audit_plan_name}/report/${record.audit_plan_report_id}`}
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
              <Link to={`project/${projectID}/audit-plan/detail/${name}`}>
                {name}
              </Link>
            );
          }
        },
        {
          dataIndex: 'audit_level',
          title: t(
            'projectManage.projectOverview.auditPlanRisk.tableColumn.level'
          ),
          render: (_: unknown, record: RiskAuditPlanWithLevel) => (
            <RiskAuditLevelCell record={record} />
          )
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
