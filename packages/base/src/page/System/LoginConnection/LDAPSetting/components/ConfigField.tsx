import { useTranslation } from 'react-i18next';
import { BasicInput, BasicSwitch } from '@actiontech/shared';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { validatorPort } from '@actiontech/shared/lib/utils/FormRule';
import { Form } from 'antd';

const ConfigField = () => {
  const { t } = useTranslation();
  const updatePassword = Form.useWatch('update_password');
  return (
    <>
      <FormItemLabel
        label={t('dmsSystem.ldap.enableLdapSSL')}
        name="enable_ssl"
        valuePropName="checked"
        className="has-required-style"
        rules={[{ required: true }]}
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.ldap.ldapServerHost')}
        name="ldap_server_host"
        className="has-required-style"
        rules={[{ required: true }]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapServerHost')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.ldap.ldapServerPort')}
        name="ldap_server_port"
        className="has-required-style"
        rules={[
          {
            validator: validatorPort()
          },
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapServerPort')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip has-required-style"
        label={
          <CustomLabelContent
            title={t('dmsSystem.ldap.ldapConnectDn')}
            tips={t('dmsSystem.ldap.ldapConnectDnTips')}
          />
        }
        name="ldap_connect_dn"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('dmsSystem.ldap.ldapConnectDn')
            })
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapConnectDn')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.ldap.updatePassword')}
        name="update_password"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.ldap.ldapConnectPwd')}
        name="ldap_connect_pwd"
        className="has-required-style"
        rules={[{ required: updatePassword }]}
        hidden={!updatePassword}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapConnectPwd')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip has-required-style"
        label={
          <CustomLabelContent
            title={t('dmsSystem.ldap.ldapSearchBaseDn')}
            tips={t('dmsSystem.ldap.ldapSearchBaseDnTips')}
          />
        }
        name="ldap_search_base_dn"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('dmsSystem.ldap.ldapSearchBaseDn')
            })
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapSearchBaseDn')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip has-required-style"
        label={
          <CustomLabelContent
            title={t('dmsSystem.ldap.ldapUserNameRdnKey')}
            tips={t('dmsSystem.ldap.ldapUserNameRdnKeyTips')}
          />
        }
        name="ldap_user_name_rdn_key"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('dmsSystem.ldap.ldapUserNameRdnKey')
            })
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapUserNameRdnKey')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.ldap.ldapUserEmailRdnKey')}
            tips={t('dmsSystem.ldap.ldapUserEmailRdnKeyTips')}
          />
        }
        name="ldap_user_email_rdn_key"
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapUserEmailRdnKey')
          })}
        />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
