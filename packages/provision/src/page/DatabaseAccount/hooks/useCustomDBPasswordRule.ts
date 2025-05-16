import { ProvisionApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import Password, { CharType } from '../../../utils/Password';
import { useMemo } from 'react';
import { PasswordRule } from '../index.type';
import { defaultRules } from '../index.data';
import { useTranslation } from 'react-i18next';

const useCustomDBPasswordRule = () => {
  const { t } = useTranslation();

  const {
    data: customPasswordRule,
    loading: getCustomPasswordRuleLoading,
    run: getCustomPasswordRule
  } = useRequest(
    () =>
      ProvisionApi.CustomDbPasswordRuleService.AuthGetCustomDBPasswordRule().then(
        (res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }
      ),
    {
      manual: true
    }
  );

  const passwordRules = useMemo(() => {
    const { min_length = 16, ...restData } = customPasswordRule || {};
    const lengthRule: PasswordRule = {
      key: 'min_length',
      label: t('databaseAccount.passwordRule.minLength', {
        minLength: min_length
      }),
      validate: (v) => v?.length >= min_length
    };
    return [
      lengthRule,
      ...defaultRules.filter(
        (rule) => restData[rule.key as keyof typeof restData]
      )
    ];
  }, [customPasswordRule, t]);

  const generatePasswordByRule = () => {
    const { min_length = 16, ...restData } = customPasswordRule || {};
    const password = Password.generateDBPasswordByCustomCharType(
      min_length,
      Object.keys(restData).filter(
        (key) => restData[key as keyof typeof restData]
      ) as CharType[]
    );
    return password;
  };

  return {
    customPasswordRule,
    getCustomPasswordRuleLoading,
    getCustomPasswordRule,
    passwordRules,
    generatePasswordByRule
  };
};

export default useCustomDBPasswordRule;
