import { FormInstance } from 'antd';
import { BaseInfoFormProps, CustomRuleFormBaseInfoFields } from '.';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useStaticStatus from '../../../hooks/useStaticStatus';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import {
  FormInputBotBorder,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { BasicButton, BasicInput, BasicSelect } from '@actiontech/shared';
import useRuleCategories from '../../../hooks/useRuleCategories';

const BaseInfoForm: React.FC<BaseInfoFormProps> = (props) => {
  const { t } = useTranslation();

  const {
    loading: getDriverNameListLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();

  const {
    getRuleCategoriesLoading,
    auditAccuracyOptions,
    operandOptions,
    sqlOptions,
    auditPurposeOptions
  } = useRuleCategories();

  const { getRuleLevelStatusSelectOption } = useStaticStatus();

  const isUpdate = useMemo(() => !!props.defaultData, [props.defaultData]);

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    if (!!props.defaultData) {
      props.form.setFieldsValue({
        desc: props.defaultData.desc,
        annotation: props.defaultData.annotation,
        dbType: props.defaultData.db_type,
        ruleType: props.defaultData.type,
        level: props.defaultData.level,
        sql: props.defaultData.categories?.sql?.[0],
        operand: props.defaultData.categories?.operand,
        auditPurpose: props.defaultData.categories?.audit_purpose?.[0],
        auditAccuracy: props.defaultData.categories?.audit_accuracy?.[0]
      });
    }
  }, [props.defaultData, props.form]);

  return (
    <FormStyleWrapper
      colon={false}
      labelAlign="left"
      form={props.form as FormInstance<CustomRuleFormBaseInfoFields>}
    >
      <FormItemNoLabel name="desc" validateFirst rules={[{ required: true }]}>
        <FormInputBotBorder
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('customRule.baseInfoForm.ruleName')
          })}
        ></FormInputBotBorder>
      </FormItemNoLabel>
      <FormItemLabel
        label={t('customRule.baseInfoForm.ruleDesc')}
        name="annotation"
        {...formItemLayout.fullLine}
      >
        <BasicInput.TextArea
          className="textarea-no-resize"
          placeholder={t('common.form.placeholder.input', {
            name: t('customRule.baseInfoForm.ruleDesc')
          })}
          maxLength={255}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('customRule.baseInfoForm.dbType')}
        name="dbType"
        rules={[
          {
            required: true
          }
        ]}
        {...formItemLayout.fullLine}
      >
        <BasicSelect
          disabled={isUpdate}
          loading={getDriverNameListLoading}
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.dbType')
          })}
          onChange={() => {
            props.form.setFieldsValue({
              ruleType: ''
            });
          }}
        >
          {generateDriverSelectOptions()}
        </BasicSelect>
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('customRule.baseInfoForm.category.operand')}
        name="operand"
        rules={[
          {
            required: true
          }
        ]}
        {...formItemLayout.fullLine}
      >
        <BasicSelect
          loading={getRuleCategoriesLoading}
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.category.operand')
          })}
          options={operandOptions}
          mode="tags"
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('customRule.baseInfoForm.category.auditPurpose')}
        name="auditPurpose"
        rules={[
          {
            required: true
          }
        ]}
        {...formItemLayout.fullLine}
      >
        <BasicSelect
          loading={getRuleCategoriesLoading}
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.category.auditPurpose')
          })}
          options={auditPurposeOptions}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('customRule.baseInfoForm.category.sql')}
        name="sql"
        rules={[
          {
            required: true
          }
        ]}
        {...formItemLayout.fullLine}
      >
        <BasicSelect
          loading={getRuleCategoriesLoading}
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.category.sql')
          })}
          options={sqlOptions}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('customRule.baseInfoForm.category.auditAccuracy')}
        name="auditAccuracy"
        rules={[
          {
            required: true
          }
        ]}
        {...formItemLayout.fullLine}
      >
        <BasicSelect
          loading={getRuleCategoriesLoading}
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.category.auditAccuracy')
          })}
          options={auditAccuracyOptions}
        />
      </FormItemLabel>

      <FormItemLabel
        className="has-required-style"
        label={t('customRule.baseInfoForm.level')}
        name="level"
        initialValue={RuleResV1LevelEnum.notice}
        rules={[
          {
            required: true
          }
        ]}
        {...formItemLayout.fullLine}
      >
        <BasicSelect
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.level')
          })}
        >
          {getRuleLevelStatusSelectOption()}
        </BasicSelect>
      </FormItemLabel>
      <BasicButton type="primary" onClick={props.submit}>
        {t('common.nextStep')}
      </BasicButton>
    </FormStyleWrapper>
  );
};

export default BaseInfoForm;
