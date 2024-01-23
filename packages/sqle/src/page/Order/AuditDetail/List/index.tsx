import { useRequest } from 'ahooks';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import useOverviewActions from './useOverviewActions';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import ScheduleTimeModal from '../ScheduleTimeModal';
import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  auditResultOverviewActions,
  auditResultOverviewColumn
} from './column';
import { OrderDetailAuditResultListProps } from './index.type';

const OrderDetailAuditResultList: React.FC<OrderDetailAuditResultListProps> = ({
  workflowID,
  projectName,
  isArchive,
  getOverviewListSuccessHandle,
  refreshOverviewFlag,
  setAuditResultActiveKey,
  refreshOrder,
  orderStatus
}) => {
  const { username } = useCurrentUser();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    loading,
    data: overviewList,
    refresh: refreshOverview
  } = useRequest(
    () =>
      handleTableRequestError(
        workflow.getSummaryOfInstanceTasksV2({
          workflow_id: workflowID ?? '',
          project_name: projectName
        })
      ),
    {
      refreshDeps: [workflowID, refreshOverviewFlag],
      ready: !!workflowID,
      onSuccess: ({ list }) => {
        return getOverviewListSuccessHandle?.(list ?? []);
      }
    }
  );

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
    workflowID,
    projectName,
    refreshOrder,
    refreshOverview
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
        loading={loading}
        columns={auditResultOverviewColumn()}
        errorMessage={requestErrorMessage}
        dataSource={overviewList?.list}
        pagination={false}
        actions={
          !isArchive
            ? auditResultOverviewActions({
                scheduleTimeHandle,
                sqlExecuteHandle,
                sqlTerminateHandle,
                openScheduleModalAndSetCurrentTask,
                currentUsername: username,
                orderStatus
              })
            : undefined
        }
        onRow={(record) => {
          return {
            onClick: () => {
              setAuditResultActiveKey(`${record.task_id}`);
            }
          };
        }}
      />
    </>
  );
};

export default OrderDetailAuditResultList;
