import { BasicButton, BasicInput, BasicModal } from '@actiontech/dms-kit';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ApproveWorkflowModalFormFields,
  ApproveWorkflowModalProps
} from './index.type';

const APPROVAL_COMMENT_MAX_LENGTH = 255;

const ApproveWorkflowModal: React.FC<ApproveWorkflowModalProps> = ({
  open,
  close,
  loading,
  approve
}) => {
  const [form] = Form.useForm<ApproveWorkflowModalFormFields>();
  const { t } = useTranslation();
  const resetAndCloseApproveModal = () => {
    form.resetFields();
    close();
  };
  return (
    <BasicModal
      title={t('dmsDataExport.detail.action.approve.text')}
      open={open}
      closable={false}
      footer={
        <>
          <BasicButton onClick={resetAndCloseApproveModal} disabled={loading}>
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={async () => {
              const values = await form.validateFields();
              await approve({
                reason: values.reason?.trim()
              });
              resetAndCloseApproveModal();
            }}
          >
            {t('dmsDataExport.detail.operator.confirmApprove')}
          </BasicButton>
        </>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t('dmsDataExport.detail.operator.approvalComment')}
          name="reason"
          rules={[
            {
              max: APPROVAL_COMMENT_MAX_LENGTH,
              message: t('common.form.rule.maxLength', {
                max: APPROVAL_COMMENT_MAX_LENGTH
              })
            }
          ]}
        >
          <BasicInput.TextArea
            placeholder={t('common.form.placeholder.input')}
            rows={3}
            maxLength={APPROVAL_COMMENT_MAX_LENGTH}
          />
        </Form.Item>
      </Form>
    </BasicModal>
  );
};
export default ApproveWorkflowModal;
