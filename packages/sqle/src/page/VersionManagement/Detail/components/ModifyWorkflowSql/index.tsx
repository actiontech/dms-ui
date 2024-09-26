import useInitDataWithRequest from '../../../../SqlExecWorkflow/Detail/hooks/useInitDataWithRequest';
import useModifySql from '../../../../SqlExecWorkflow/Detail/hooks/useModifySql';
import ModifySqlStatement from '../../../../SqlExecWorkflow/Detail/components/ModifySqlStatement';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import sql_version from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useParams } from 'react-router-dom';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { updateSelectWorkflowId } from '../../../../../store/versionManagement';

const ModifyWorkflowSql: React.FC<{
  hideModifyWorkflowSqlStatement: () => void;
}> = ({ hideModifyWorkflowSqlStatement }) => {
  const { t } = useTranslation();

  const { versionId } = useParams<{ versionId: string }>();

  const { projectName } = useCurrentProject();

  const dispatch = useDispatch();

  const { workflowId } = useSelector((state: IReduxState) => ({
    workflowId: state.versionManagement.workflowId
  }));

  const { workflowInfo, taskInfos, initLoading } = useInitDataWithRequest(
    workflowId ?? ''
  );

  const {
    taskInfos: modifiedTasks,
    disabledOperatorWorkflowBtnTips,
    isDisableFinallySubmitButton,
    modifySqlAudit,
    resetAllState
  } = useModifySql(workflowInfo?.mode === WorkflowResV2ModeEnum.same_sqls);

  const backToDetail = () => {
    dispatch(updateSelectWorkflowId({ workflowId: null }));
    resetAllState();
    hideModifyWorkflowSqlStatement();
  };

  const onModifySqlSubmit = (taskIds: number[]) => {
    sql_version
      .retryExecWorkflowV1({
        project_name: projectName,
        sql_version_id: versionId ?? '',
        workflow_id: workflowInfo?.workflow_id,
        task_ids: taskIds
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          backToDetail();
          EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
        }
      });
  };

  return (
    <Spin spinning={initLoading}>
      <ModifySqlStatement
        backToDetail={backToDetail}
        isAtRejectStep={true}
        auditAction={modifySqlAudit}
        currentTasks={taskInfos}
        isSameSqlForAll={workflowInfo?.mode === WorkflowResV2ModeEnum.same_sqls}
        executeMode={workflowInfo?.exec_mode}
        workflowId={workflowInfo?.workflow_id ?? ''}
        modifiedTasks={modifiedTasks}
        disabledOperatorWorkflowBtnTips={disabledOperatorWorkflowBtnTips}
        isDisableFinallySubmitButton={isDisableFinallySubmitButton}
        backToDetailText={t('versionManagement.detail.backToVersionDetail')}
        onModifySqlSubmit={onModifySqlSubmit}
      />
    </Spin>
  );
};

export default ModifyWorkflowSql;
