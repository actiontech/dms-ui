import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { ModalName } from '../../../../../data/ModalName';
import { useTranslation } from 'react-i18next';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { BasicDrawer, BasicButton } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import {
  updateVersionManagementModalStatus,
  updateSelectVersionStageId
} from '../../../../../store/versionManagement';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useParams } from 'react-router-dom';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import WorkflowTableField from './WorkflowTableField';

const AssociateWorkflowModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [submitting, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const [form] = Form.useForm<{ workflow_ids: React.Key[] }>();

  const { projectName } = useCurrentProject();

  const { versionId } = useParams<{ versionId: string }>();

  const { stageId, visible } = useSelector((state: IReduxState) => ({
    stageId: state.versionManagement.stageId,
    visible:
      !!state.versionManagement.modalStatus[
        ModalName.Version_Management_Associate_Workflow_Modal
      ]
  }));

  const { data: workflowData, loading: getWorkflowDataLoading } = useRequest(
    () =>
      sqlVersion
        .GetWorkflowsThatCanBeAssociatedToVersionV1({
          project_name: projectName,
          sql_version_id: versionId ?? '',
          sql_version_stage_id: `${stageId}`
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }),
    {
      ready: !!stageId && visible
    }
  );

  const onClose = () => {
    form.resetFields();
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Associate_Workflow_Modal,
        status: false
      })
    );
    dispatch(updateSelectVersionStageId({ stageId: null }));
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    sqlVersion
      .batchAssociateWorkflowsWithVersionV1({
        project_name: projectName,
        sql_version_id: versionId ?? '',
        sql_version_stage_id: `${stageId}`,
        workflow_ids: values.workflow_ids as string[]
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
          onClose();
          messageApi.success(
            t('versionManagement.associateWorkflow.successTips')
          );
        }
      })
      .finally(() => submitFinish());
  };

  return (
    <BasicDrawer
      open={visible}
      size="large"
      title={t('versionManagement.associateWorkflow.title')}
      onClose={onClose}
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
    >
      {messageContextHolder}
      <Form form={form} layout="vertical" {...DrawerFormLayout}>
        <FormItemLabel
          className="has-required-style"
          label={t('versionManagement.associateWorkflow.workflow')}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('versionManagement.associateWorkflow.workflow')
              })
            }
          ]}
          name="workflow_ids"
        >
          <WorkflowTableField
            loading={getWorkflowDataLoading}
            workflowList={workflowData}
          />
        </FormItemLabel>
      </Form>
    </BasicDrawer>
  );
};

export default AssociateWorkflowModal;
