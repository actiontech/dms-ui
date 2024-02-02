import { BasicButton, BasicInput, BasicModal } from '@actiontech/shared';
import { Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { RejectWorkflowModalFormFields } from './index.type';
import useDataExportDetailReduxManage from '../../../hooks/index.redux';
import { RejectWorkflowModalAlertStyleWrapper } from './style';
import { useBoolean } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../../data/EmitterKey';
import eventEmitter from '../../../../../../utils/EventEmitter';

const RejectWorkflowModal: React.FC = () => {
  const { workflowRejectOpen, updateWorkflowRejectOpen, workflowInfo } =
    useDataExportDetailReduxManage();

  const closeModal = () => {
    updateWorkflowRejectOpen(false);
  };
  const { projectID } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [form] = Form.useForm<RejectWorkflowModalFormFields>();

  const { t } = useTranslation();

  const resetAndCloseRejectModal = () => {
    form.resetFields();
    closeModal();
  };

  const [
    rejectWorkflowLoading,
    { setFalse: finishRejectWorkflow, setTrue: startRejectWorkflow }
  ] = useBoolean();

  const rejectWorkflow = (
    workflowID: string,
    values: RejectWorkflowModalFormFields
  ) => {
    startRejectWorkflow();
    dms
      .RejectDataExportWorkflow({
        data_export_workflow_uid: workflowID,
        project_uid: projectID,
        payload: {
          reason: values.reason
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataExport.detail.action.reject.successTips')
          );
          eventEmitter.emit(EmitterKey.DMS_Refresh_Export_Data_Workflow);
        }
      })
      .finally(() => {
        finishRejectWorkflow();
      });
  };

  return (
    <BasicModal
      title={t('dmsDataExport.detail.action.reject.modal.title')}
      open={workflowRejectOpen}
      closable={false}
      footer={
        <>
          <BasicButton
            onClick={resetAndCloseRejectModal}
            disabled={rejectWorkflowLoading}
          >
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            type="primary"
            loading={rejectWorkflowLoading}
            disabled={rejectWorkflowLoading}
            onClick={async () => {
              const values = await form.validateFields();
              await rejectWorkflow(workflowInfo?.workflow_uid ?? '', values);
              resetAndCloseRejectModal();
            }}
          >
            {t('dmsDataExport.detail.action.reject.modal.text')}
          </BasicButton>
        </>
      }
    >
      {messageContextHolder}
      <>
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('dmsDataExport.detail.action.reject.reason')}
            name="reason"
            rules={[
              {
                required: true
              }
            ]}
          >
            <BasicInput.TextArea
              placeholder={t('common.form.placeholder.input')}
              rows={3}
            />
          </Form.Item>
        </Form>

        <RejectWorkflowModalAlertStyleWrapper>
          {t('dmsDataExport.detail.action.reject.tips')}
        </RejectWorkflowModalAlertStyleWrapper>
      </>
    </BasicModal>
  );
};

export default RejectWorkflowModal;
