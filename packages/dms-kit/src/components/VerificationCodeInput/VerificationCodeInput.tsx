import { BasicInput } from '../BasicInput';
import { BasicButton } from '../BasicButton';
import { useCountDown } from 'ahooks';
import { useState } from 'react';
import { VerificationCodeInputStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { InputProps } from 'antd';
import { AxiosResponse } from 'axios';
import { useBoolean } from 'ahooks';

interface VerificationCodeFieldProps extends InputProps {
  onSendCode?: () => Promise<AxiosResponse<unknown, any>>;
  interval?: number; // second
}

const VerificationCodeInput: React.FC<VerificationCodeFieldProps> = ({
  onSendCode,
  interval = 60,
  ...restProps
}) => {
  const { t } = useTranslation();

  const [targetDate, setTargetDate] = useState<number>();

  const [sending, { setTrue: startSending, setFalse: finishSending }] =
    useBoolean();

  const [countdown] = useCountDown({
    targetDate
  });

  const onSendCodeClick = () => {
    startSending();
    onSendCode?.()
      .then(() => setTargetDate(Date.now() + interval * 1000))
      .finally(() => finishSending());
  };

  return (
    <VerificationCodeInputStyleWrapper>
      <BasicInput
        placeholder={t('common.form.placeholder.input', {
          name: t('common.verificationCodeInput.code')
        })}
        {...restProps}
      />
      <BasicButton
        onClick={onSendCodeClick}
        disabled={countdown !== 0}
        loading={sending}
      >
        {countdown === 0
          ? t('common.verificationCodeInput.sendCode')
          : t('common.verificationCodeInput.secondsLater', {
              number: Math.round(countdown / 1000)
            })}
      </BasicButton>
    </VerificationCodeInputStyleWrapper>
  );
};

export default VerificationCodeInput;
