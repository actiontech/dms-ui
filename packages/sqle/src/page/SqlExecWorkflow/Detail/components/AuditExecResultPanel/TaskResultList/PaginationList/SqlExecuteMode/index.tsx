import { List } from 'antd';
import { useTranslation } from 'react-i18next';
import { SqlExecuteModeProps } from './index.type';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import ResultCard from '../../Common/ResultCard';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../../../hooks/useAuditExecResultPanelSetup';
import { TaskResultListLayoutEnum } from '../../../index.enum';

const SqlExecuteMode: React.FC<SqlExecuteModeProps> = ({
  tableChange,
  tableFilterInfo,
  taskId,
  pagination,
  execStatusFilterValue,
  noDuplicate,
  currentListLayout,
  workflowStatus,
  auditResultActiveKey,
  backupConflict,
  dbType,
  enableBackup,
  taskStatus
}) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

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
          no_duplicate: noDuplicate,
          filter_exec_status: execStatusFilterValue ?? undefined
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
        auditResultActiveKey !== WORKFLOW_OVERVIEW_TAB_KEY &&
        currentListLayout === TaskResultListLayoutEnum.pagination,
      refreshDeps: [
        tableFilterInfo,
        pagination,
        auditResultActiveKey,
        currentListLayout,
        workflowStatus,
        execStatusFilterValue,
        noDuplicate
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
              projectID={projectID}
              taskId={auditResultActiveKey}
              onUpdateDescription={refresh}
              executeMode={WorkflowResV2ExecModeEnum.sqls}
              backupConflict={backupConflict}
              dbType={dbType}
              enableBackup={enableBackup}
              taskStatus={taskStatus}
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
          tableChange?.(
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

export default SqlExecuteMode;
