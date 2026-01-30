import useOverviewActions from '../hooks/useOverviewActions';
import {
  useCurrentProject,
  useCurrentUser,
  usePermission
} from '@actiontech/shared/lib/features';
import ScheduleTimeModal from './ScheduleTimeModal';
import { ActiontechTable } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { auditResultOverviewColumn } from './column';
import { WorkflowOverviewListProps } from './index.type';
import { AuditResultOverviewListAction } from './action';
import {
  updateRetryExecuteData,
  updateSqlExecWorkflowModalStatus
} from '../../../../../../store/sqlExecWorkflow/index';
import { ModalName } from '../../../../../../data/ModalName';
import { useDispatch } from 'react-redux';
import { IGetWorkflowTasksItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import MobileCardList from './MobileCardList';
import { useCallback, useMemo } from 'react';
import { useMedia } from '@actiontech/shared';
import { EmptyBox } from '@actiontech/dms-kit';

const WorkflowOverviewList: React.FC<WorkflowOverviewListProps> = ({
  workflowInfo,
  activeTabChangeEvent,
  refreshWorkflow,
  refreshOverviewAction,
  getOverviewLoading,
  overviewList,
  overviewTableErrorMessage
}) => {
  const { isMobile } = useMedia();
  const { username } = useCurrentUser();
  const { projectName } = useCurrentProject();
  const { parse2TableActionPermissions } = usePermission();
  const dispatch = useDispatch();
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

  const onRetryExecute = useCallback(
    (record: IGetWorkflowTasksItemV2) => {
      dispatch(
        updateRetryExecuteData({
          taskId: record.task_id?.toString() ?? ''
        })
      );
      dispatch(
        updateSqlExecWorkflowModalStatus({
          modalName: ModalName.Sql_Exec_Workflow_Retry_Execute_Modal,
          status: true
        })
      );
    },
    [dispatch]
  );

  const actions = useMemo(
    () =>
      parse2TableActionPermissions(
        AuditResultOverviewListAction({
          scheduleTimeHandle,
          sqlExecuteHandle,
          sqlTerminateHandle,
          openScheduleModalAndSetCurrentTask,
          currentUsername: username,
          workflowStatus: workflowInfo?.record?.status,
          executable: !!workflowInfo?.record?.executable,
          onRetryExecute,
          workflowInfoRecord: workflowInfo?.record
        })
      ),
    [
      scheduleTimeHandle,
      sqlExecuteHandle,
      sqlTerminateHandle,
      openScheduleModalAndSetCurrentTask,
      username,
      workflowInfo?.record,
      onRetryExecute,
      parse2TableActionPermissions
    ]
  );

  const columns = useMemo(() => auditResultOverviewColumn(), []);

  return (
    <>
      {contextHolder}
      <ScheduleTimeModal
        open={scheduleModalVisible}
        closeScheduleModal={closeScheduleModal}
        submit={scheduleTimeHandle}
        maintenanceTime={currentTask?.instance_maintenance_times ?? []}
      />

      <EmptyBox
        if={isMobile}
        defaultNode={
          <ActiontechTable
            rowKey="task_id"
            className="table-row-cursor"
            loading={getOverviewLoading}
            columns={columns}
            errorMessage={overviewTableErrorMessage}
            dataSource={overviewList?.list}
            pagination={false}
            actions={actions}
            onRow={(record) => {
              return {
                onClick: () => {
                  activeTabChangeEvent(`${record.task_id}`);
                }
              };
            }}
          />
        }
      >
        <MobileCardList
          dataSource={overviewList?.list}
          loading={getOverviewLoading}
          actions={actions}
          columns={columns}
          onCardClick={(record) => activeTabChangeEvent(`${record.task_id}`)}
        />
      </EmptyBox>
    </>
  );
};

export default WorkflowOverviewList;
