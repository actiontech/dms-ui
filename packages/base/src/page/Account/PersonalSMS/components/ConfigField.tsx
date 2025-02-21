import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { VerificationCodeInput } from '@actiontech/shared';
import { ConfigFieldProps } from '../index.type';
import SMS from '@actiontech/shared/lib/api/base/service/SMS';

const ConfigField: React.FC<ConfigFieldProps> = ({ userPhone, username }) => {
  const { t } = useTranslation();

  const onSendCode = () => {
    return SMS.SendSmsCode({ username });
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
