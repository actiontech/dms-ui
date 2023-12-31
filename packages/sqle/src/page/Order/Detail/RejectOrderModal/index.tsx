import { BasicButton, BasicInput, BasicModal } from '@actiontech/shared';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  RejectOrderModalFormFields,
  RejectOrderModalProps
} from './index.type';
import { RejectOrderModalAlertStyleWrapper } from './style';

const RejectOrderModal: React.FC<RejectOrderModalProps> = ({
  open,
  close,
  loading,
  reject
}) => {
  const [form] = Form.useForm<RejectOrderModalFormFields>();

  const { t } = useTranslation();

  const resetAndCloseRejectModal = () => {
    form.resetFields();
    close();
  };
  return (
    <BasicModal
      title={t('order.operator.reject')}
      open={open}
      closable={false}
      footer={
        <>
          <BasicButton onClick={resetAndCloseRejectModal} disabled={loading}>
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={async () => {
              const values = await form.validateFields();
              await reject(values);
              resetAndCloseRejectModal();
            }}
          >
            {t('order.operator.reject')}
          </BasicButton>
        </>
      }
    >
      <>
        <Form form={form} onFinish={reject} layout="vertical">
          <Form.Item
            label={t('order.operator.rejectReason')}
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

        <RejectOrderModalAlertStyleWrapper>
          {t('order.operator.rejectAllTips')}
        </RejectOrderModalAlertStyleWrapper>
      </>
    </BasicModal>
  );
};

export default RejectOrderModal;
