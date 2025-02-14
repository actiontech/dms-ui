import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/CustomForm';
import { useTranslation } from 'react-i18next';
import { Form, message } from 'antd';
import {
  BasicInput,
  BasicInputNumber,
  BasicSelect,
  EmptyBox
} from '@actiontech/shared';
import { useRequest } from 'ahooks';
import AuthService from '@actiontech/shared/lib/api/provision/service/auth';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBusinessOptions from '../../../../hooks/useBusinessOptions';
import useServiceOptions from '../../../../hooks/useServiceOptions';
import { useEffect } from 'react';
import { EventEmitterKey } from '../../../../data/enum';
import EventEmitter from '../../../../utils/EventEmitter';
import { CreateAccountFormType } from '../../index.type';
import InputPassword from '../../../../components/PasswordWithGenerate';
import Password from '../../../../utils/Password';
import useSecurityPolicy, {
  NORMAL_POLICY_VALUE
} from '../../../../hooks/useSecurityPolicy';
import ServiceFiled from './ServiceField';
import { IDBAccountMeta } from '@actiontech/shared/lib/api/provision/service/common';

// todo 后续在 dms-ui 调整至shared 后修改这里
import AutoCreatedFormItemByApi from '../../../../../../sqle/src/components/BackendForm';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';

type Props = {
  mode: 'create' | 'update';
  dbAccountMeta: IDBAccountMeta[];
};

const BaseInfoForm: React.FC<Props> = ({ mode, dbAccountMeta }) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<CreateAccountFormType>();

  const [messageApi, contextHolder] = message.useMessage();

  const business = Form.useWatch('business', form);

  const selectedDBServiceID = Form.useWatch('dbServiceID', form);

  const { businessOptions, updateBusinessList, loading } = useBusinessOptions();
  const policy = Form.useWatch('policy', form);

  const disabled = mode === 'update';

  const {
    updateSecurityPolicyList,
    securityPolicyOptions,
    securityPolicyList
  } = useSecurityPolicy();

  const {
    serviceOptions,
    updateServiceList,
    serviceList,
    loading: servicesLoading
  } = useServiceOptions(true);

  const onSyncService = () => {
    SyncService.run();
  };

  const SyncService = useRequest(
    () =>
      AuthService.AuthSyncService({
        service_uids: [selectedDBServiceID ?? '']
      }),
    {
      manual: true,
      ready: !!selectedDBServiceID,
      onSuccess: (res) => {
        if (res?.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('databaseAccount.create.form.syncSuccessTips'));
          EventEmitter.emit(EventEmitterKey.Create_Account_Sync_Service);
        }
      }
    }
  );

  useEffect(() => {
    updateBusinessList();
  }, [updateBusinessList]);

  useEffect(() => {
    if (business) {
      updateServiceList(business);
      form.resetFields(['service']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  useEffect(() => {
    if (disabled) {
      updateServiceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  useEffect(() => {
    updateSecurityPolicyList();
  }, [updateSecurityPolicyList]);

  useEffect(() => {
    if (policy !== NORMAL_POLICY_VALUE) {
      const value = securityPolicyList.find(
        (i) => i.uid === policy
      )?.password_expiration_period;
      form.setFieldValue('effective_time_day', value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy]);

  const generatePassword = () => {
    const password = Password.generateMySQLPassword(16);
    form.setFieldsValue({
      password,
      confirm_password: password
    });
    return password;
  };

  useEffect(() => {
    if (selectedDBServiceID) {
      form.setFieldValue(
        'dbType',
        serviceList.find((v) => v.uid === selectedDBServiceID)?.db_type
      );
    }
  }, [form, selectedDBServiceID, serviceList]);

  return (
    <>
      {contextHolder}
      <FormItemSubTitle>
        {t('databaseAccount.create.baseInfo')}
      </FormItemSubTitle>
      <EmptyBox if={!disabled}>
        <FormItemLabel
          name="business"
          label={t('databaseAccount.discovery.business')}
          rules={[{ required: true }]}
          className="has-required-style"
        >
          <BasicSelect
            onChange={() => {
              form.setFieldValue('dbServiceID', undefined);
            }}
            disabled={disabled}
            loading={loading}
            options={businessOptions}
            showSearch
            filterOption={filterOptionByLabel}
          />
        </FormItemLabel>
      </EmptyBox>
      <FormItemLabel
        name="dbServiceID"
        label={t('databaseAccount.discovery.service')}
        rules={[{ required: true }]}
        className="has-required-style"
      >
        <ServiceFiled
          disabled={disabled}
          loading={servicesLoading}
          options={serviceOptions}
          onSyncService={onSyncService}
          syncServiceLoading={SyncService.loading}
        />
      </FormItemLabel>

      <FormItemLabel hidden name="dbType">
        <BasicInput />
      </FormItemLabel>

      <FormItemLabel
        name="username"
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.username')}
            tips={t('databaseAccount.create.form.usernameTips')}
          />
        }
        rules={[{ required: true }]}
        className="has-required-style has-label-tip"
      >
        <BasicInput disabled={disabled} />
      </FormItemLabel>

      <FormItemLabel
        name="password"
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.password')}
            tips={t('databaseAccount.create.form.passwordTips')}
          />
        }
        rules={[{ required: true }]}
        className="has-required-style has-label-tip"
      >
        <InputPassword
          disabled={disabled}
          clickGeneratePassword={generatePassword}
        />
      </FormItemLabel>
      <FormItemLabel
        name="confirm_password"
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.confirmPassword')}
            tips={t('databaseAccount.create.form.confirmPasswordTips')}
          />
        }
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(t('databaseAccount.create.form.passwordError'))
              );
            }
          })
        ]}
        dependencies={['password']}
        className="has-required-style has-label-tip"
      >
        <BasicInput.Password disabled={disabled} />
      </FormItemLabel>

      <EmptyBox if={!!selectedDBServiceID}>
        <AutoCreatedFormItemByApi
          disabled={disabled}
          paramsKey="additionalParams"
          params={dbAccountMeta}
        />
      </EmptyBox>

      <FormItemLabel
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.policy')}
            tips={t('databaseAccount.create.form.policyTips')}
          />
        }
        name="policy"
        rules={[{ required: true }]}
        className="has-required-style has-label-tip"
      >
        <BasicSelect options={securityPolicyOptions()} disabled={disabled} />
      </FormItemLabel>
      <EmptyBox if={!disabled}>
        <FormItemLabel
          label={
            <CustomLabelContent
              title={t('databaseAccount.create.form.effectiveTimeDay')}
              tips={t('databaseAccount.create.form.effectiveTimeDayTips')}
            />
          }
          name="effective_time_day"
          className="has-required-style has-label-tip"
          rules={[
            { required: true },

            {
              validator: (_, value) => {
                if (value === undefined || value <= 0) {
                  return Promise.reject(
                    t(
                      'databaseAccount.create.form.effectiveTimeDayValidationMessage'
                    )
                  );
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <BasicInputNumber
            disabled={
              (policy !== undefined && policy !== NORMAL_POLICY_VALUE) ||
              disabled
            }
          />
        </FormItemLabel>
      </EmptyBox>
      <FormItemLabel
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.desc')}
            tips={t('databaseAccount.create.form.descTips')}
          />
        }
        name="explanation"
        className="has-label-tip"
      >
        <BasicInput.TextArea
          disabled={disabled}
          autoSize={{
            maxRows: 10,
            minRows: 2
          }}
          placeholder={t('databaseAccount.create.form.descPlaceholder')}
        />
      </FormItemLabel>
    </>
  );
};

export default BaseInfoForm;
