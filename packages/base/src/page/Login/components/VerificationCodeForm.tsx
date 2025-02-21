import {
  VerificationCodeInput,
  BasicButton,
  maskPhoneNumber
} from '@actiontech/shared';
import { Form, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { VerificationCodeReturnButtonStyleWrapper } from '../style';
import { SMSService } from '@actiontech/shared/lib/api';
import { VerificationCodeFormProps } from '../types';

const VerificationCodeForm: React.FC<VerificationCodeFormProps> = ({
  loading,
  onVerify,
  form,
  hideVerificationForm,
  username,
  phone
}) => {
  const { t } = useTranslation();

  const onSendCode = () => {
    return SMSService.SendSmsCode({ username });
  };

  return (
    <Form onFinish={onVerify} form={form}>
      <Form.Item>
        <Typography.Text type="secondary">
          <Space>
            {`${t('common.phone')}:`}
            {phone ? maskPhoneNumber(phone) : '-'}
          </Space>
        </Typography.Text>
      </Form.Item>
      <Form.Item
        name="verificationCode"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dmsLogin.verifyCode')
            })
          }
        ]}
      >
        <VerificationCodeInput onSendCode={onSendCode} />
      </Form.Item>
      <Form.Item>
        <BasicButton
          type="primary"
          className="login-btn"
          htmlType="submit"
          loading={loading}
        >
          {t('dmsLogin.verify')}
        </BasicButton>
      </Form.Item>
      <VerificationCodeReturnButtonStyleWrapper>
        <Typography.Link onClick={hideVerificationForm}>
          {t('dmsLogin.returnLogin')}
        </Typography.Link>
      </VerificationCodeReturnButtonStyleWrapper>
    </Form>
  );
};

export default VerificationCodeForm;
