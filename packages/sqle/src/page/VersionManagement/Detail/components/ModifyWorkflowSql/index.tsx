import useInitDataWithRequest from '../../../../SqlExecWorkflow/Detail/hooks/useInitDataWithRequest';
import useModifySql from '../../../../SqlExecWorkflow/Detail/hooks/useModifySql';
import ModifySqlStatement from '../../../../SqlExecWorkflow/Detail/components/ModifySqlStatement';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { updateSelectWorkflowId } from '../../../../../store/versionManagement';

const ModifyWorkflowSql: React.FC<{
  hideModifyWorkflowSqlStatement: () => void;
}> = ({ hideModifyWorkflowSqlStatement }) => {
  const { t } = useTranslation();

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

  const onRefreshDetail = () => {
    EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
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
        refreshOverviewAction={onRefreshDetail}
      />
    </Spin>
  );
};

export default ModifyWorkflowSql;
