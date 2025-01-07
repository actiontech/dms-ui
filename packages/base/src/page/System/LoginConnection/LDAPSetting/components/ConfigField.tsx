import { useTranslation } from 'react-i18next';

import { BasicInput, BasicSwitch } from '@actiontech/shared';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';

import { validatorPort } from '@actiontech/shared/lib/utils/FormRule';

const ConfigField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FormItemLabel
        label={t('dmsSystem.ldap.enableLdapSSL')}
        name="enable_ssl"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.ldap.ldapServerHost')}
        name="ldap_server_host"
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
        rules={[
          {
            validator: validatorPort()
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
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.ldap.ldapConnectDn')}
            tips={t('dmsSystem.ldap.ldapConnectDnTips')}
          />
        }
        name="ldap_connect_dn"
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapConnectDn')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.ldap.ldapConnectPwd')}
        name="ldap_connect_pwd"
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapConnectPwd')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.ldap.ldapSearchBaseDn')}
            tips={t('dmsSystem.ldap.ldapSearchBaseDnTips')}
          />
        }
        name="ldap_search_base_dn"
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.ldap.ldapSearchBaseDn')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.ldap.ldapUserNameRdnKey')}
            tips={t('dmsSystem.ldap.ldapUserNameRdnKeyTips')}
          />
        }
        name="ldap_user_name_rdn_key"
      >
        <BasicInput placeholder={t('common.form.placeholder.input')} />
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
