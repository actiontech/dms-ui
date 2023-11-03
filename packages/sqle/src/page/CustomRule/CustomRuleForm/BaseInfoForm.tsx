import { Divider, Form, InputRef, Space, FormInstance } from 'antd5';
import { BaseInfoFormProps, CustomRuleFormBaseInfoFields } from '.';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef } from 'react';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useStaticStatus from '../../../hooks/useStaticStatus';
import useRuleType from '../../../hooks/useRuleType';
import { PlusOutlined } from '@ant-design/icons';
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

const BaseInfoForm: React.FC<BaseInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const inputRef = useRef<InputRef>(null);

  const {
    loading: getDriverNameListLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();

  const {
    loading: getRuleTypeLoading,
    updateRuleTypeList,
    ruleTypeList
  } = useRuleType();

  const { getRuleLevelStatusSelectOption } = useStaticStatus();

  const isUpdate = useMemo(() => !!props.defaultData, [props.defaultData]);

  const currentDbType = Form.useWatch(
    'dbType',
    props.form as FormInstance<CustomRuleFormBaseInfoFields>
  );

  const addRuleType = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    props.resetExtraInfo();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

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
        level: props.defaultData.level
      });
    }
  }, [props.defaultData, props.form]);

  useEffect(() => {
    if (currentDbType) {
      updateRuleTypeList(currentDbType);
    }
  }, [currentDbType, props.form, updateRuleTypeList]);

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
        label={t('customRule.baseInfoForm.ruleType')}
        name="ruleType"
        rules={[
          {
            required: true
          }
        ]}
        {...formItemLayout.fullLine}
      >
        <BasicSelect
          disabled={!currentDbType}
          allowClear
          showSearch
          loading={getRuleTypeLoading}
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.ruleType')
          })}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <BasicInput
                  size="small"
                  data-testid="add-rule-type"
                  placeholder={t(
                    'customRule.baseInfoForm.addExtraRuleTypePlaceholder'
                  )}
                  ref={inputRef}
                  value={props.extraRuleName}
                  onChange={props.onExtraRuleNameChange}
                />
                <BasicButton icon={<PlusOutlined />} onClick={addRuleType}>
                  {t('customRule.baseInfoForm.addExtraRuleType')}
                </BasicButton>
              </Space>
            </>
          )}
          options={[
            ...ruleTypeList.map((v) => ({
              label: v.rule_count ? (
                <Space size={6}>
                  <span>{v.rule_type}</span>
                  <span>{`(${v.rule_count})`}</span>
                </Space>
              ) : (
                v.rule_type
              ),
              value: v.rule_type
            })),

            ...props.extraRuleTypeList.map((v) => ({
              label: v,
              value: v
            }))
          ]}
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
