import { useTranslation } from 'react-i18next';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { BasicButton, BasicInput, BasicSelect } from '@actiontech/dms-kit';
import { Rule } from 'antd/es/form';
import { nameRule } from '@actiontech/dms-kit';
import { RuleTemplateBaseInfoFormProps } from './index.type';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { FormInputBotBorder, FormItemNoLabel } from '@actiontech/dms-kit';
import { FormItemLabel } from '@actiontech/dms-kit';
import { useWatch } from 'antd/es/form/Form';
import useRuleVersionTips from '../../../../hooks/useRuleVersionTips';
const BaseInfoForm = (props: RuleTemplateBaseInfoFormProps) => {
  const { t } = useTranslation();
  const {
    loading: getDriverNameListLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();
  const {
    generateRuleVersionOptions,
    loading: getRuleVersionLoading,
    updateRuleVersionTips
  } = useRuleVersionTips();
  const selectedDbType = useWatch(['db_type'], props.form);
  const isUpdate = useMemo(() => !!props.defaultData, [props.defaultData]);
  const [formDefaultLoading, setFormDefaultLoading] = useState(false);
  const nameFormRule: () => Rule[] = useCallback(() => {
    const rule: Rule[] = [
      {
        required: true,
        message: t('common.form.placeholder.input', {
          name: t('ruleTemplate.ruleTemplateForm.templateName')
        })
      }
    ];
    if (!isUpdate) {
      rule.push(...nameRule());
    }
    return rule;
  }, [isUpdate, t]);
  useEffect(() => {
    updateDriverNameList();
    updateRuleVersionTips();
  }, [props.projectName, updateDriverNameList, updateRuleVersionTips]);
  useEffect(() => {
    if (!!props.defaultData) {
      setFormDefaultLoading(true);
      props.form.setFieldsValue({
        templateName: props.defaultData.rule_template_name,
        templateDesc: props.defaultData.desc,
        db_type: props.defaultData.db_type,
        ruleVersion: props.defaultData.rule_version
      });
      setFormDefaultLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultData]);
  return (
    <FormStyleWrapper
      colon={false}
      labelAlign="left"
      form={props.form}
      disabled={props.submitLoading || formDefaultLoading}
    >
      <FormItemNoLabel name="templateName" validateFirst rules={nameFormRule()}>
        <FormInputBotBorder
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('ruleTemplate.ruleTemplateForm.templateName')
          })}
        ></FormInputBotBorder>
      </FormItemNoLabel>
      <FormItemLabel
        label={t('ruleTemplate.ruleTemplateForm.templateDesc')}
        {...formItemLayout.fullLine}
        name="templateDesc"
      >
        <BasicInput.TextArea
          style={{
            resize: 'none'
          }}
          placeholder={t(
            'ruleTemplate.ruleTemplateForm.placeholder.templateDesc'
          )}
          rows={8}
          maxLength={255}
          showCount
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        {...formItemLayout.fullLine}
        label={t('ruleTemplate.ruleTemplateForm.databaseType')}
        name="db_type"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          placeholder={t('common.form.placeholder.select', {
            name: t('ruleTemplate.ruleTemplateForm.databaseType')
          })}
          allowClear
          loading={getDriverNameListLoading}
          disabled={isUpdate || props.mode === 'import'}
          onChange={(value) => {
            if (!value) {
              props.form.setFieldValue('ruleVersion', undefined);
            }
          }}
        >
          {generateDriverSelectOptions()}
        </BasicSelect>
      </FormItemLabel>

      <FormItemLabel
        className="has-required-style"
        {...formItemLayout.fullLine}
        label={t('ruleTemplate.ruleTemplateForm.ruleVersion')}
        name="ruleVersion"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          placeholder={t('common.form.placeholder.select', {
            name: t('ruleTemplate.ruleTemplateForm.ruleVersion')
          })}
          allowClear
          disabled={isUpdate || props.mode === 'import' || !selectedDbType}
          options={generateRuleVersionOptions(selectedDbType)}
          loading={getRuleVersionLoading}
        />
      </FormItemLabel>
      <BasicButton
        type="primary"
        onClick={props.submit}
        loading={!!props.submitLoading || props.ruleListLoading}
        disabled={!!props.submitLoading}
      >
        {t('common.nextStep')}
      </BasicButton>
    </FormStyleWrapper>
  );
};
export default BaseInfoForm;
