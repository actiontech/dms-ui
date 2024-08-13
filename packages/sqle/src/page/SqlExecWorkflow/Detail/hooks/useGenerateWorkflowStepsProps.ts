import { message } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '../../../../data/common';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  IWorkflowResV2,
  IAuditTaskResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import useCloneExecWorkflowInfo from './useCloneExecWorkflowInfo';

type HooksParamType = {
  workflowId: string;
  refreshWorkflowInfo: () => void;
  refreshOverviewAction: (value?: boolean | undefined) => void;
  taskInfos: IAuditTaskResV1[];
  workflowInfo?: IWorkflowResV2;
};

const useGenerateWorkflowStepsProps = ({
  workflowId,
  refreshWorkflowInfo,
  refreshOverviewAction,
  taskInfos,
  workflowInfo
}: HooksParamType) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { executeInOtherInstance } = useCloneExecWorkflowInfo(
    taskInfos,
    workflowInfo
  );

  const passAction = useCallback(
    async (stepId: number) => {
      return workflow
        .approveWorkflowV2({
          workflow_id: workflowId,
          workflow_step_id: `${stepId}`,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('execWorkflow.detail.operator.approveSuccessTips')
            );
            refreshWorkflowInfo();
            refreshOverviewAction();
          }
        });
    },
    [
      workflowId,
      projectName,
      messageApi,
      t,
      refreshWorkflowInfo,
      refreshOverviewAction
    ]
  );

  const executingAction = useCallback(async () => {
    return workflow
      .executeTasksOnWorkflowV2({
        workflow_id: workflowId,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('execWorkflow.detail.operator.executingTips'));
          refreshWorkflowInfo();
          refreshOverviewAction();
        }
      });
  }, [
    messageApi,
    projectName,
    refreshWorkflowInfo,
    refreshOverviewAction,
    t,
    workflowId
  ]);

  const terminateAction = useCallback(async () => {
    return workflow
      .terminateMultipleTaskByWorkflowV1({
        workflow_id: workflowId,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('execWorkflow.detail.operator.terminateSuccessTips')
          );
          refreshWorkflowInfo();
          refreshOverviewAction();
        }
      });
  }, [
    messageApi,
    projectName,
    refreshWorkflowInfo,
    refreshOverviewAction,
    t,
    workflowId
  ]);

  const rejectAction = useCallback(
    async (reason: string, stepId: number) => {
      return workflow
        .rejectWorkflowV2({
          project_name: projectName,
          workflow_id: workflowId,
          workflow_step_id: `${stepId}`,
          reason
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('execWorkflow.detail.operator.rejectSuccessTips')
            );
            refreshWorkflowInfo();
            refreshOverviewAction();
          }
        });
    },
    [
      messageApi,
      projectName,
      refreshWorkflowInfo,
      refreshOverviewAction,
      t,
      workflowId
    ]
  );

  const completeAction = useCallback(async () => {
    return workflow
      .batchCompleteWorkflowsV2({
        workflow_id_list: [workflowId],
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('execWorkflow.detail.operator.completeSuccessTips')
          );
          refreshWorkflowInfo();
          refreshOverviewAction();
        }
      });
  }, [
    messageApi,
    projectName,
    refreshWorkflowInfo,
    refreshOverviewAction,
    t,
    workflowId
  ]);

  return {
    passAction,
    executingAction,
    rejectAction,
    completeAction,
    terminateAction,
    messageContextHolder,
    executeInOtherInstanceAction: executeInOtherInstance
  };
};

export default useGenerateWorkflowStepsProps;
