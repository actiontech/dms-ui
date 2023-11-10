import { Rule } from 'antd/es/form';
import i18n from 'i18next';
import { FormValidatorRule } from '../types/common.type';

export const nameRule = (): Rule[] => {
  return [
    {
      validator: nameRuleValidator()
    },
    {
      max: 59
    }
  ];
};

export const roleNameRule = (): Rule[] => {
  return [
    {
      validator: roleNameRuleValidator()
    },
    {
      max: 59
    }
  ];
};

export const workflowNameRule = (): FormValidatorRule => {
  return (_, value) => {
    const startReg = /^[\u4e00-\u9fa5a-zA-Z]/;
    if (!startReg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.startWithWords'));
    }
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9_-]*$/;
    if (!reg.test(value)) {
      return Promise.reject(i18n.t('order.createOrder.workflowNameRule'));
    }
    return Promise.resolve();
  };
};

export const tagNameRule = (): FormValidatorRule => {
  return (_, value) => {
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9_-]*$/;
    if (!reg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.onlyWordsAndNumber'));
    }
    return Promise.resolve();
  };
};

export const nameRuleValidator = (): FormValidatorRule => {
  return (_, value) => {
    const startReg = /^[a-zA-Z]/;
    if (!startReg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.startWithLetter'));
    }
    const reg = /^[a-zA-Z0-9_-]*$/;
    if (!reg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.onlyLetterAndNumber'));
    }
    return Promise.resolve();
  };
};

export const roleNameRuleValidator = (): FormValidatorRule => {
  return (_, value) => {
    const startReg = /^[\u4e00-\u9fa5a-zA-Z]/;
    if (!startReg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.startWithWords'));
    }
    const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]*$/;
    if (!reg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.onlyWordsAndNumber'));
    }
    return Promise.resolve();
  };
};

export const whiteSpaceSql = (): Rule[] => {
  return [
    {
      validator: whiteSpaceSqlValidator()
    }
  ];
};

export const whiteSpaceSqlValidator = (): FormValidatorRule => {
  return (_, values) => {
    const placeholder = '/* input your sql */';
    if (values === placeholder) {
      return Promise.reject(
        i18n.t('common.form.rule.require', {
          name: i18n.t('common.sqlStatements')
        })
      );
    }
    return Promise.resolve();
  };
};

export const validatorPort = (min = 1, max = 65535): FormValidatorRule => {
  return (_, value) => {
    const reg = /^[0-9]*$/;
    if (!reg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.onlyNumber'));
    }
    const port = parseInt(value, 10);
    if (port < min || port > max) {
      return Promise.reject(
        i18n.t('common.form.rule.portRange', {
          min,
          max
        })
      );
    }
    return Promise.resolve();
  };
};

export const phoneRule = (): Rule[] => {
  return [
    {
      validator: phoneRuleValidator()
    }
  ];
};

export const phoneRuleValidator = (): FormValidatorRule => {
  return (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    const reg = /^1\d{10}$/;
    if (!reg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.phone'));
    }
    return Promise.resolve();
  };
};

export const integerValidator = (
  name: string,
  min: number,
  max: number
): FormValidatorRule => {
  return (_, value) => {
    const reg = /^\d+$/;
    if (!reg.test(value)) {
      return Promise.reject(i18n.t('common.form.rule.integer'));
    }

    if (value < min || value > max) {
      return Promise.reject(
        i18n.t('common.form.rule.numberRange', {
          name,
          min,
          max
        })
      );
    }
    return Promise.resolve();
  };
};

export const integerRule = (name: string, min = 0, max = 1): Rule[] => {
  return [
    {
      validator: integerValidator(name, min, max)
    }
  ];
};
