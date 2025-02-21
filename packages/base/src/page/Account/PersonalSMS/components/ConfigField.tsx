import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { VerificationCodeInput } from '@actiontech/shared';
import { ConfigFieldProps } from '../index.type';
import { SMSService } from '@actiontech/shared/lib/api';

const ConfigField: React.FC<ConfigFieldProps> = ({ userPhone, username }) => {
  const { t } = useTranslation();

  const onSendCode = () => {
    return SMSService.SendSmsCode({ username });
  };

  return (
    <>
      <FormItemLabel label={t('common.phone')}>{userPhone}</FormItemLabel>
      <FormItemLabel
        label={t('dmsAccount.sms.verificationCode')}
        name="code"
        rules={[{ required: true }]}
      >
        <VerificationCodeInput onSendCode={onSendCode} />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
