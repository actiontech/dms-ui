import useOverviewActions from '../hooks/useOverviewActions';
import {
  useCurrentProject,
  useCurrentUser,
  usePermission
} from '@actiontech/shared/lib/global';
import ScheduleTimeModal from './ScheduleTimeModal';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { auditResultOverviewColumn } from './column';
import { WorkflowOverviewListProps } from './index.type';
import { AuditResultOverviewListAction } from './action';

const WorkflowOverviewList: React.FC<WorkflowOverviewListProps> = ({
  workflowInfo,
  activeTabChangeEvent,
  refreshWorkflow,
  refreshOverviewAction,
  getOverviewLoading,
  overviewList,
  overviewTableErrorMessage
}) => {
  const { username } = useCurrentUser();
  const { projectName } = useCurrentProject();
  const { parse2TableActionPermissions } = usePermission();
  const {
    contextHolder,
    scheduleModalVisible,
    closeScheduleModal,
    sqlExecuteHandle,
    sqlTerminateHandle,
    scheduleTimeHandle,
    openScheduleModalAndSetCurrentTask,
    currentTask
  } = useOverviewActions({
    projectName,
    workflowId: workflowInfo?.workflow_id,
    refreshWorkflow,
    refreshOverview: refreshOverviewAction
  });

  return (
    <>
      {contextHolder}
      <ScheduleTimeModal
        open={scheduleModalVisible}
        closeScheduleModal={closeScheduleModal}
        submit={scheduleTimeHandle}
        maintenanceTime={currentTask?.instance_maintenance_times ?? []}
      />
      <ActiontechTable
        rowKey="task_id"
        className="table-row-cursor"
        loading={getOverviewLoading}
        columns={auditResultOverviewColumn()}
        errorMessage={overviewTableErrorMessage}
        dataSource={overviewList?.list}
        pagination={false}
        actions={parse2TableActionPermissions(
          AuditResultOverviewListAction({
            scheduleTimeHandle,
            sqlExecuteHandle,
            sqlTerminateHandle,
            openScheduleModalAndSetCurrentTask,
            currentUsername: username,
            workflowStatus: workflowInfo?.record?.status
          })
        )}
        onRow={(record) => {
          return {
            onClick: () => {
              activeTabChangeEvent(`${record.task_id}`);
            }
          };
        }}
      />
    </>
  );
};

export default WorkflowOverviewList;
