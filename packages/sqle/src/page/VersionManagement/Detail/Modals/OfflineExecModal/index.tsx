import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { ModalName } from '../../../../../data/ModalName';
import { useTranslation } from 'react-i18next';
import { BasicModal, BasicButton, BasicInput } from '@actiontech/dms-kit';
import { FormItemLabel } from '@actiontech/dms-kit';
import { Form, Space, message } from 'antd';
import { useBoolean } from 'ahooks';
import {
  updateVersionManagementModalStatus,
  updateSelectWorkflowId
} from '../../../../../store/versionManagement';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/dms-kit';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { DrawerFormLayout } from '@actiontech/dms-kit';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
const OfflineExecModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [submitting, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [form] = Form.useForm<{
    remarks: string;
  }>();
  const { projectName } = useCurrentProject();
  const { workflowId, visible } = useSelector((state: IReduxState) => ({
    workflowId: state.versionManagement.workflowId,
    visible:
      !!state.versionManagement.modalStatus[
        ModalName.Version_Management_Offline_Execute_Modal
      ]
  }));
  const onClose = () => {
    form.resetFields();
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Offline_Execute_Modal,
        status: false
      })
    );
    dispatch(
      updateSelectWorkflowId({
        workflowId: null
      })
    );
  };
  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    workflow
      .batchCompleteWorkflowsV3({
        workflow_list: [
          {
            workflow_id: workflowId ?? '',
            desc: values.remarks
          }
        ],
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
          messageApi.success(t('versionManagement.offlineExec.successTips'));
        }
      })
      .finally(() => submitFinish());
  };
  return (
    <BasicModal
      open={visible}
      title={t('versionManagement.offlineExec.title')}
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
    >
      {messageContextHolder}
      <Form form={form} layout="vertical" {...DrawerFormLayout}>
        <FormItemLabel
          className="has-required-style"
          label={t('versionManagement.offlineExec.remarks')}
          rules={[
            {
              required: true
            }
          ]}
          name="remarks"
        >
          <BasicInput.TextArea />
        </FormItemLabel>
      </Form>
    </BasicModal>
  );
};
export default OfflineExecModal;
