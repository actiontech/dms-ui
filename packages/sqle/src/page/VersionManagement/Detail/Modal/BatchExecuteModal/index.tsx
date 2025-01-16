import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import {
  updateVersionManagementModalStatus,
  updateSelectVersionStageWorkflowList
} from '../../../../../store/versionManagement';
import {
  BasicModal,
  BasicButton,
  TypedLink,
  useTypedParams
} from '@actiontech/shared';
import { Space, Typography, message } from 'antd';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { useBoolean } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const BatchExecuteModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { projectName, projectID } = useCurrentProject();

  const { versionId } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.detail>();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [submitting, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const { currentStageWorkflowList, visible } = useSelector(
    (state: IReduxState) => ({
      currentStageWorkflowList:
        state.versionManagement.currentStageWorkflowList,
      visible:
        !!state.versionManagement.modalStatus[
          ModalName.Version_Management_Execute_Modal
        ]
    })
  );

  const onClose = () => {
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Execute_Modal,
        status: false
      })
    );
    dispatch(updateSelectVersionStageWorkflowList({ workflowList: null }));
  };

  const onSubmit = () => {
    startSubmit();
    sqlVersion
      .batchExecuteWorkflowsV1({
        project_name: projectName,
        sql_version_id: versionId ?? '',
        workflow_ids:
          currentStageWorkflowList?.map(
            (workflow) => workflow?.workflow_id ?? ''
          ) ?? []
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('versionManagement.execute.successTips'));
        }
        if (
          res.data.code === ResponseCode.SUCCESS ||
          res.data.code === ResponseCode.BatchTaskNotFullyCompleted
        ) {
          onClose();
          EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  return (
    <BasicModal
      open={visible}
      title={t('versionManagement.execute.title')}
      closable={false}
      footer={
        <Space>
          <BasicButton onClick={onClose} loading={submitting}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={onSubmit} loading={submitting}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
      centered
    >
      {messageContextHolder}
      <Space direction="vertical">
        <Typography.Text type="secondary">
          {t('versionManagement.execute.currentAllowExecuteWorkflow')}
        </Typography.Text>
        {currentStageWorkflowList?.map((workflow, index) => (
          <TypedLink
            key={index}
            to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
            params={{ projectID, workflowId: workflow.workflow_id ?? '' }}
            target="_blank"
          >
            {workflow.workflow_name}
          </TypedLink>
        ))}
      </Space>
    </BasicModal>
  );
};

export default BatchExecuteModal;
