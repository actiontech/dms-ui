import { List } from 'antd';
import { useTranslation } from 'react-i18next';
import { SQLExecuteModeProps } from './index.type';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { OVERVIEW_TAB_KEY } from '../../../index.data';
import { ListLayoutEnum } from '../../../../Common/ListLayoutSelector/index.types';
import ResultCard from '../../Common/ResultCard';

const SQLExecuteMode: React.FC<SQLExecuteModeProps> = ({
  tableChange,
  tableFilterInfo,
  taskId,
  pagination,
  auditLevelFilterValue,
  duplicate,
  currentListLayout,
  orderStatus,
  auditResultActiveKey
}) => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

  const {
    data: currentAuditTaskList,
    loading,
    refresh
  } = useRequest(
    () => {
      return task
        .getAuditTaskSQLsV2({
          task_id: taskId,
          ...tableFilterInfo,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          no_duplicate: duplicate,
          filter_exec_status:
            auditLevelFilterValue === 'all' ? undefined : auditLevelFilterValue
        })
        .then((res) => {
          return {
            list: res.data.data,
            total: res.data.total_nums
          };
        });
    },
    {
      ready:
        !!auditResultActiveKey &&
        auditResultActiveKey !== OVERVIEW_TAB_KEY &&
        currentListLayout === ListLayoutEnum.pagination,
      refreshDeps: [
        tableFilterInfo,
        pagination,
        auditResultActiveKey,
        currentListLayout,
        orderStatus
      ]
    }
  );

  return (
    <List
      bordered={false}
      itemLayout="vertical"
      loading={loading}
      split={false}
      dataSource={currentAuditTaskList?.list ?? []}
      renderItem={(item) => {
        return (
          <List.Item key={item.number}>
            <ResultCard
              {...item}
              projectName={projectName}
              taskId={auditResultActiveKey}
              onUpdateDescription={refresh}
              executeMode={WorkflowResV2ExecModeEnum.sqls}
            />
          </List.Item>
        );
      }}
      pagination={{
        className: 'task-result-pagination-list',
        showSizeChanger: true,
        defaultPageSize: 20,
        total: currentAuditTaskList?.total,
        pageSize: pagination.page_size,
        current: pagination.page_index,
        showTotal: (total) => (
          <span>
            {t('common.actiontechTable.pagination.total', {
              total
            })}
          </span>
        ),
        onChange: (page, pageSize) => {
          tableChange &&
            tableChange(
              { current: page, pageSize },
              {},
              {},
              { currentDataSource: [], action: 'paginate' }
            );
        }
      }}
    />
  );
};

export default SQLExecuteMode;
