import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { ModalName } from '../../../../../data/ModalName';
import { useTranslation } from 'react-i18next';
// import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { BasicModal, BasicButton, BasicInput } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useBoolean } from 'ahooks';
import {
  updateVersionManagementModalStatus,
  updateSelectVersionStageId
} from '../../../../../store/versionManagement';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useParams } from 'react-router-dom';
// import { ResponseCode } from '@actiontech/shared/lib/enum';
// import EmitterKey from '../../../../../data/EmitterKey';
// import EventEmitter from '../../../../../utils/EventEmitter';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

const OfflineExecModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [submitting, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const [form] = Form.useForm<{ remarks: string }>();

  const { projectName } = useCurrentProject();

  const { versionId } = useParams<{ versionId: string }>();

  const { stageId, workflowId, visible } = useSelector(
    (state: IReduxState) => ({
      stageId: state.versionManagement.stageId,
      workflowId: state.versionManagement.workflowId,
      visible:
        !!state.versionManagement.modalStatus[
          ModalName.Version_Management_Offline_Execute_Modal
        ]
    })
  );

  const onClose = () => {
    form.resetFields();
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Offline_Execute_Modal,
        status: false
      })
    );
    dispatch(updateSelectVersionStageId({ stageId: null }));
  };

  const onSubmit = () => {
    form.validateFields();
    // todo 待后端补充接口
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
          rules={[{ required: true }]}
          name="remarks"
        >
          <BasicInput.TextArea />
        </FormItemLabel>
      </Form>
    </BasicModal>
  );
};

export default OfflineExecModal;
