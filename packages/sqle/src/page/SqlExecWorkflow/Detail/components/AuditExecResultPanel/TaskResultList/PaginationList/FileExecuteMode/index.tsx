import { useTranslation } from 'react-i18next';
import { FileExecuteModeProps } from './index.type';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/features';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { List } from 'antd';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import ResultCard from '../../Common/ResultCard';
import FileModeHeader from '../../Common/FileModeHeader';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../../../hooks/useAuditExecResultPanelSetup';
import { TaskResultListLayoutEnum } from '../../../index.enum';

const FileExecuteMode: React.FC<FileExecuteModeProps> = ({
  tableChange,
  taskId,
  pagination,
  currentListLayout,
  workflowStatus,
  auditResultActiveKey,
  assigneeUserNames
}) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();
  const { username } = useCurrentUser();

  const {
    data: currentAuditTaskList,
    loading,
    refresh
  } = useRequest(
    () => {
      return task
        .getAuditFileList({
          task_id: taskId,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString()
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
        pagination,
        auditResultActiveKey,
        currentListLayout,
        workflowStatus
      ]
    }
  );

  return (
    <>
      <FileModeHeader
        taskId={taskId}
        refresh={refresh}
        allowExec={
          workflowStatus === WorkflowRecordResV2StatusEnum.wait_for_execution &&
          assigneeUserNames.includes(username)
        }
      />

      <List
        className="file-execute-mode-list-wrapper"
        bordered={false}
        itemLayout="vertical"
        loading={loading}
        split={false}
        dataSource={currentAuditTaskList?.list ?? []}
        renderItem={(item) => {
          return (
            <List.Item key={item.file_id}>
              <ResultCard
                {...item}
                projectID={projectID}
                taskId={auditResultActiveKey}
                executeMode={WorkflowResV2ExecModeEnum.sql_file}
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
    </>
  );
};

export default FileExecuteMode;
