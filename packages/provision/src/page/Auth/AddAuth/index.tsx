import { Form, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { timeDayOptions } from './index.data';
import { useRequest, useBoolean } from 'ahooks';
import PreviewModal from './PreviewModal';
import UserSelect from './UserSelect';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import InputPassword from '~/components/PasswordWithGenerate';
import Password from '~/utils/Password';
import {
  PageHeader,
  BasicButton,
  BasicSelect,
  BasicInput,
  BasicResult,
  EmptyBox,
  BasicSwitch
} from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAddAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import {
  FormItemLabel,
  FormItemSubTitle,
  FormItemBigTitle,
  CustomLabelContent
} from '@actiontech/shared/lib/components/FormCom';
import { AddAuthFormFields } from './index.type';
import {
  IconSuccessResult,
  IconLeftArrow
} from '@actiontech/shared/lib/Icon/common';
import { FormValidatorRule } from '@actiontech/shared/lib/types/common.type';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const AddAuth: React.FC = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<AddAuthFormFields>();

  const navigate = useNavigate();

  const { projectID } = useCurrentProject();

  const [urlParams] = useSearchParams();

  const id = urlParams.get('id');

  const template_uid = Form.useWatch('data_permission_template_uid', form);
  const username = Form.useWatch('username', form);
  const hostname = Form.useWatch('hostname', form);

  useEffect(() => {
    if (id) {
      form.setFieldsValue({
        data_permission_template_uid: id
      });
    }
  }, [id, form]);

  const [params, setParams] = useState<IAddAuthorization>();

  const [
    submitSuccess,
    { setTrue: setSubmitSuccess, setFalse: setSubmitFailed }
  ] = useBoolean();

  const { data: authTemplateOptions } = useRequest(
    () =>
      auth
        .AuthListDataPermissionTemplate({
          page_index: 1,
          page_size: 999,
          filter_by_namespace_uid: projectID ?? ''
        })
        .then((res) => {
          return (
            res.data.data?.map((item) => ({
              value: item.uid ?? '',
              label: item.name ?? ''
            })) ?? []
          );
        }),
    {
      refreshDeps: [projectID]
    }
  );

  const resetFields = () => {
    form.resetFields();
    setParams(undefined);
    setSubmitFailed();
    setValidateSuccess(false);
    if (id) {
      form.setFieldsValue({
        data_permission_template_uid: id
      });
    }
  };

  const onSave = () => {
    form.validateFields().then((values) => {
      setParams({
        data_permission_template_uid: values.data_permission_template_uid,
        db_account: {
          hostname: values.hostname,
          password: values.password,
          username: values.username
        },
        effective_time_day: values.effective_time_day,
        memo: values.memo,
        permission_user_uid: values.permission_user_uid,
        purpose: values.purpose,
        used_by_sql_workbench: values.used_by_sql_workbench
      });
    });
  };

  const onSuccess = () => {
    setParams(undefined);
    setSubmitSuccess();
  };

  const [validateSuccess, setValidateSuccess] = useState(false);
  const { runAsync: verifyDBAccount } = useRequest(
    auth.AuthVerifyDBAccount.bind(auth),
    {
      manual: true,
      debounceWait: 300,
      onSuccess(res) {
        setValidateSuccess(res.data.code === ResponseCode.SUCCESS);
      }
    }
  );

  useEffect(() => {
    if (template_uid && username && hostname) {
      setValidateSuccess(false);
    }
  }, [template_uid, username, hostname, form]);

  const userValidator: FormValidatorRule = async (_, value: string) => {
    const { data_permission_template_uid, username, hostname } =
      form.getFieldsValue([
        'data_permission_template_uid',
        'username',
        'hostname'
      ]);

    if (!data_permission_template_uid || !username || !hostname) {
      return Promise.resolve();
    }
    const res = await verifyDBAccount({
      data_permission_template_uid,
      username,
      hostname
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      return Promise.resolve();
    }
    return Promise.reject(res.data.message);
  };

  const generatePassword = () => {
    const password = Password.generateMySQLPassword(16);
    form.setFieldsValue({
      password,
      confirm_password: password
    });
    return password;
  };

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={
          <BasicButton onClick={() => navigate(-1)} icon={<IconLeftArrow />}>
            {t('auth.addAuth.backAuthList')}
          </BasicButton>
        }
        extra={
          <Space hidden={submitSuccess}>
            <BasicButton onClick={resetFields}>{t('common.reset')}</BasicButton>
            <BasicButton type="primary" onClick={onSave}>
              {t('common.ok')}
            </BasicButton>
          </Space>
        }
      />
      <EmptyBox
        if={submitSuccess}
        defaultNode={
          <FormStyleWrapper
            form={form}
            colon={false}
            labelAlign="left"
            className="hasTopHeader"
            {...formItemLayout.spaceBetween}
          >
            <FormAreaBlockStyleWrapper>
              <FormItemBigTitle>{t('auth.addAuth.title')}</FormItemBigTitle>
              <FormItemSubTitle>
                {t('auth.addAuth.templateFormTitle')}
              </FormItemSubTitle>
              <FormItemLabel
                label={t('auth.addAuth.baseForm.template')}
                name="data_permission_template_uid"
                rules={[{ required: true }]}
                className="has-required-style"
              >
                <BasicSelect options={authTemplateOptions} />
              </FormItemLabel>
              <FormItemLabel
                label={t('auth.addAuth.baseForm.effectiveTimeDay')}
                name="effective_time_day"
                initialValue={-1}
                required={true}
                className="has-required-style"
              >
                <BasicSelect options={timeDayOptions} />
              </FormItemLabel>
              <FormItemSubTitle>
                {t('auth.addAuth.steps.purpose')}
              </FormItemSubTitle>
              <UserSelect className="has-required-style" />
              <FormItemLabel
                name="purpose"
                label={t('auth.addAuth.purposeForm.purpose')}
                rules={[
                  { required: true },
                  {
                    max: 20,
                    message: t('common.form.rule.maxLength', { max: 20 })
                  }
                ]}
                className="has-required-style"
              >
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                name="used_by_sql_workbench"
                className="has-label-tip"
                initialValue={true}
                valuePropName="checked"
                label={
                  <CustomLabelContent
                    title={t('auth.addAuth.purposeForm.cbPermission')}
                    tips={t('auth.addAuth.purposeForm.cbTips')}
                  />
                }
              >
                <BasicSwitch />
              </FormItemLabel>
              <FormItemLabel
                name="memo"
                label={t('auth.addAuth.purposeForm.memo')}
              >
                <BasicInput.TextArea />
              </FormItemLabel>
              <FormItemSubTitle>
                {t('auth.addAuth.steps.account')}
              </FormItemSubTitle>
              <FormItemLabel
                name="username"
                label={t('auth.addAuth.accountForm.username')}
                rules={[{ required: true, validator: userValidator }]}
                dependencies={['data_permission_template_uid', 'hostname']}
                extra={
                  validateSuccess && (
                    <Typography.Text type="success">
                      {t('auth.addAuth.accountForm.usernameExtra')}
                    </Typography.Text>
                  )
                }
                className="has-required-style"
              >
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                name="hostname"
                className="has-label-tip"
                label={
                  <CustomLabelContent
                    title={t('auth.addAuth.accountForm.hostname')}
                    tips={t('auth.addAuth.accountForm.hostnameTips')}
                  />
                }
              >
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                name="password"
                label={t('auth.addAuth.accountForm.password')}
                rules={[{ required: true }]}
                className="has-required-style"
              >
                <InputPassword clickGeneratePassword={generatePassword} />
              </FormItemLabel>
              <FormItemLabel
                name="confirm_password"
                label={t('auth.addAuth.accountForm.confirm_password')}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t('auth.addAuth.accountForm.password_error'))
                      );
                    }
                  })
                ]}
                dependencies={['password']}
                className="has-required-style"
              >
                <BasicInput.Password />
              </FormItemLabel>
            </FormAreaBlockStyleWrapper>
          </FormStyleWrapper>
        }
      >
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('auth.addAuth.result.success')}
          subTitle={
            <>
              {t('auth.addAuth.result.jumpDetailPrefix')}
              {t('auth.addAuth.result.viewString')}
              {t('auth.addAuth.result.jumpDetailSuffix')}
            </>
          }
          extra={
            <Space>
              <BasicButton type="primary" onClick={resetFields}>
                {t('auth.addAuth.result.continue')}
              </BasicButton>
            </Space>
          }
        />
      </EmptyBox>
      <PreviewModal
        params={params}
        setParams={setParams}
        onSuccess={onSuccess}
      />
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default AddAuth;
