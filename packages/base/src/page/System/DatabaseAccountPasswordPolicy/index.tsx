import { useState } from 'react';
import { Form, InputNumber, Checkbox, Descriptions, message, Spin } from 'antd';
import { BasicButton } from '@actiontech/shared/';
import SystemBasicTitle from '../components/BasicTitle';
import { SystemConfigReadonlyModeStyleWrapper } from '@actiontech/shared/lib/components/SystemConfigurationHub/style';
import { ConfigSubmitButtonField } from '@actiontech/shared/lib/components/SystemConfigurationHub';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import {
  DatabaseAccountPasswordPolicyFormStyleWrapper,
  DatabaseAccountPasswordPolicyDetailStyleWrapper
} from '../style';
import { DatabaseAccountPasswordPolicyFormValues } from './type';
import { useTranslation } from 'react-i18next';
import { ProvisionApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { charTypeOptions } from './index.data';

const DatabaseAccountPasswordPolicyForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<DatabaseAccountPasswordPolicyFormValues>();
  const [isEdit, setIsEdit] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    data: customPasswordRule,
    loading,
    refresh
  } = useRequest(() =>
    ProvisionApi.CustomDbPasswordRuleService.AuthGetCustomDBPasswordRule().then(
      (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const { min_length, ...restData } = res.data.data || {};
          return {
            minLength: min_length,
            charTypes: Object.keys(restData).filter(
              (key) => restData[key as keyof typeof restData]
            )
          };
        }
      }
    )
  );

  const handleEdit = () => {
    setIsEdit(true);
    form.setFieldsValue(customPasswordRule ?? {});
  };

  const handleFinish = (values: any) => {
    setSubmitLoading(true);
    ProvisionApi.CustomDbPasswordRuleService.AuthUpdateCustomDBPasswordRule({
      update_custom_db_password_rule: {
        min_length: values.minLength,
        require_uppercase: values.charTypes.includes('require_uppercase'),
        require_lowercase: values.charTypes.includes('require_lowercase'),
        require_digit: values.charTypes.includes('require_digit'),
        require_special: values.charTypes.includes('require_special')
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setIsEdit(false);
          refresh();
          messageApi.success(
            t('dmsSystem.databaseAccountPasswordPolicy.successMessage')
          );
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const handleCancel = () => {
    setIsEdit(false);
    form.resetFields();
  };

  const renderDetail = () => {
    const selectedCharType = charTypeOptions.filter((opt) =>
      customPasswordRule?.charTypes.includes(opt.value)
    );
    return (
      <SystemConfigReadonlyModeStyleWrapper
        column={1}
        className="system-config-view-wrapper"
      >
        <Descriptions.Item
          label={t('dmsSystem.databaseAccountPasswordPolicy.minLength')}
        >
          {customPasswordRule?.minLength
            ? `≥ ${customPasswordRule?.minLength} 位`
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item
          label={t('dmsSystem.databaseAccountPasswordPolicy.charTypes')}
        >
          <DatabaseAccountPasswordPolicyDetailStyleWrapper>
            {selectedCharType.length
              ? selectedCharType.map((opt) => (
                  <li key={opt.value}>{opt.label}</li>
                ))
              : '-'}
          </DatabaseAccountPasswordPolicyDetailStyleWrapper>
        </Descriptions.Item>
      </SystemConfigReadonlyModeStyleWrapper>
    );
  };

  const renderEdit = () => (
    <DatabaseAccountPasswordPolicyFormStyleWrapper
      form={form}
      layout="horizontal"
      onFinish={handleFinish}
      colon={false}
      labelAlign={'left'}
      {...formItemLayout.spaceBetween}
    >
      <FormItemLabel
        label={t('dmsSystem.databaseAccountPasswordPolicy.minLength')}
        name="minLength"
        className="has-required-style"
        rules={[
          { required: true },
          {
            validator: (_, value) => {
              if (value && value < 8) {
                return Promise.reject(
                  new Error(
                    t('dmsSystem.databaseAccountPasswordPolicy.minLengthError')
                  )
                );
              }
              return Promise.resolve();
            }
          }
        ]}
        initialValue={16}
      >
        <InputNumber
          addonBefore="≥"
          addonAfter={t('dmsSystem.databaseAccountPasswordPolicy.bit')}
        />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.databaseAccountPasswordPolicy.charTypes')}
        name="charTypes"
        className="has-required-style"
        rules={[{ required: true }]}
      >
        <Checkbox.Group options={charTypeOptions} />
      </FormItemLabel>
      <ConfigSubmitButtonField
        submitLoading={submitLoading}
        handleClickCancel={handleCancel}
      />
    </DatabaseAccountPasswordPolicyFormStyleWrapper>
  );

  return (
    <Spin spinning={loading}>
      {messageContextHolder}
      <SystemBasicTitle
        title={t('dmsSystem.tabPaneTitle.databaseAccountPasswordPolicy')}
        titleExtra={
          !isEdit && (
            <BasicButton type="primary" onClick={handleEdit}>
              {t('common.edit')}
            </BasicButton>
          )
        }
      >
        {isEdit ? renderEdit() : renderDetail()}
      </SystemBasicTitle>
    </Spin>
  );
};

export default DatabaseAccountPasswordPolicyForm;
