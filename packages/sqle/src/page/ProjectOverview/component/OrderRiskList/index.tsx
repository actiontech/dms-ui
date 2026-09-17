import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../components/CardWrapper';
import TableTopList, {
  ITableTopList
} from '../../../../components/ChartCom/TableTopList';
import { AvatarCom, BasicButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { IRiskWorkflow } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import WorkflowStatus from '../../../SqlExecWorkflow/List/components/WorkflowStatus';
import { BriefcaseFilled } from '@actiontech/icons';
import RiskAuditLevelCell from '../../../../components/AuditResultMessage/RiskAuditLevelCell';

type RiskWorkflowWithLevel = IRiskWorkflow & {
  audit_level?: string;
  error_priority?: string;
  audit_error_priority?: string;
};

const OrderRiskList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID } = useCurrentProject();

  const [data, setData] = useState<RiskWorkflowWithLevel[]>();
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.statisticRiskWorkflowV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData((res.data.data ?? []) as RiskWorkflowWithLevel[]);
      }
    }
  );

  const tableProps: ITableTopList<RiskWorkflowWithLevel> = {
    apiLoading: loading,
    rowKey: (record) => `${record?.workflow_id}-${record?.workflow_name}`,
    errorCont: errorMessage,
    dataSource: data
  };

  const columnData: () => ITableTopList<RiskWorkflowWithLevel>['columns'] =
    () => {
      return [
        {
          dataIndex: 'workflow_name',
          title: t('projectManage.projectOverview.orderRisk.tableColumn.name'),
          render: (name: string, record: RiskWorkflowWithLevel) => {
            if (!name) return '-';
            return (
              <TableColumnWithIconStyleWrapper>
                <BriefcaseFilled width={14} height={14} />
                <Link
                  to={`/sqle/project/${projectID}/exec-workflow/${record.workflow_id}`}
                >
                  {name}
                </Link>
              </TableColumnWithIconStyleWrapper>
            );
          }
        },
        {
          dataIndex: 'audit_level',
          title: t('projectManage.projectOverview.orderRisk.tableColumn.level'),
          render: (_: unknown, record: RiskWorkflowWithLevel) => (
            <RiskAuditLevelCell record={record} />
          )
        },
        {
          dataIndex: 'workflow_status',
          title: t(
            'projectManage.projectOverview.orderRisk.tableColumn.status'
          ),
          render: (status: string) => {
            return (
              <WorkflowStatus
                status={status as WorkflowDetailResV1StatusEnum}
              />
            );
          }
        },
        {
          dataIndex: 'update_time',
          title: t('projectManage.projectOverview.orderRisk.tableColumn.time'),
          render(time: string) {
            return formatTime(time, '-');
          }
        },
        {
          dataIndex: 'create_user_name',
          title: t(
            'projectManage.projectOverview.orderRisk.tableColumn.createUser'
          ),
          render(create_user_name: string) {
            if (!create_user_name) return '-';
            return <AvatarCom name={create_user_name} />;
          }
        }
      ];
    };

  const onGetMore = () => {
    navigate(`/sqle/project/${projectID}/exec-workflow`);
  };

  return (
    <CardWrapper
      title={t('projectManage.projectOverview.orderRisk.title')}
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

export default OrderRiskList;
