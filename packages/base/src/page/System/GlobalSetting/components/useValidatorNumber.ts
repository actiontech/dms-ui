import { useTranslation } from 'react-i18next';

import { message } from 'antd';
import { integerValidate } from '@actiontech/dms-kit';

const useValidatorNumber = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const integerValidator = (value: string) => {
    if (!integerValidate(value)) {
      messageApi.error(t('common.form.rule.integer'));
      return false;
    }
    return true;
  };

  return {
    messageContextHolder,
    integerValidator
  };
};

export default useValidatorNumber;
