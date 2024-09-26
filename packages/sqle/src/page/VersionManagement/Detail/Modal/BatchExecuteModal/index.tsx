import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import {
  updateVersionManagementModalStatus,
  updateSelectVersionStageWorkflowList
} from '../../../../../store/versionManagement';
import { BasicModal, BasicButton } from '@actiontech/shared';
import { Space, Typography, message } from 'antd';
import { Link } from 'react-router-dom';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { useBoolean } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useParams } from 'react-router-dom';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';

const BatchExecuteModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { projectName, projectID } = useCurrentProject();

  const { versionId } = useParams<{ versionId: string }>();

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
      .batchExecuteTasksOnWorkflowV1({
        project_name: projectName,
        sql_version_id: versionId ?? '',
        workflow_ids:
          currentStageWorkflowList?.map(
            (workflow) => workflow?.workflow_id ?? ''
          ) ?? []
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          messageApi.success(t('versionManagement.execute.successTips'));
        }
      })
      .finally(() => {
        EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
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
          {t('versionManagement.execute.currentAllowExecuteWorkflow')}：
        </Typography.Text>
        {currentStageWorkflowList?.map((workflow, index) => (
          <Link
            to={`/sqle/project/${projectID}/exec-workflow/${workflow.workflow_id}`}
            key={index}
            target="__blank"
          >
            {workflow.workflow_name}
          </Link>
        ))}
      </Space>
    </BasicModal>
  );
};

export default BatchExecuteModal;
