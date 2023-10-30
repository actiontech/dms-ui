import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChartWrapper from '../../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../../components/CardWrapper';
import TableTopList, {
  ITableTopList
} from '../../../../../components/ChartCom/TableTopList';
import { AvatarCom, BasicButton } from '@actiontech/shared';
import OrderStatus from '../../../../Order/List/components/OrderStatus';
import { IconOrderId } from '../../../../../icon/Order';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { IRiskWorkflow } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const OrderRiskList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID } = useCurrentProject();

  const [data, setData] = useState<IRiskWorkflow[]>();
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.statisticRiskWorkflowV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data.data);
      }
    }
  );

  const tableProps: ITableTopList<IRiskWorkflow> = {
    apiLoading: loading,
    rowKey: 'workflow_id',
    errorCont: errorMessage,
    dataSource: data,
    emptyCont: t('common.tip.no_data'),
    onRefresh: () => {
      getApiData();
    }
  };

  const columnData: () => ITableTopList<IRiskWorkflow>['columns'] = () => {
    return [
      {
        dataIndex: 'workflow_name',
        title: t('projectManage.projectOverview.orderRisk.tableColumn.name'),
        render: (name: string, record: IRiskWorkflow) => {
          if (!name) return '-';
          return (
            <TableColumnWithIconStyleWrapper>
              <IconOrderId />
              <Link
                to={`sqle/project/${projectID}/order/${record.workflow_id}`}
              >
                {name}
              </Link>
            </TableColumnWithIconStyleWrapper>
          );
        }
      },
      {
        dataIndex: 'workflow_status',
        title: t('projectManage.projectOverview.orderRisk.tableColumn.status'),
        render: (status: string) => {
          return (
            <OrderStatus status={status as WorkflowDetailResV1StatusEnum} />
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
    navigate(`/sqle/project/${projectID}/order`);
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
