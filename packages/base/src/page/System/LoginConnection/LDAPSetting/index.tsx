import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Space, Spin } from 'antd5';
import { useBoolean, useRequest } from 'ahooks';
import { BasicButton, BasicInput, BasicSwitch } from '@actiontech/shared';
import { LDAPFormFields } from './index.type';
import { validatorPort } from '@actiontech/shared/lib/utils/FormRule';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ILDAPConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';
import { switchFieldName } from './index.data';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import ConfigSwitch from '../../components/ConfigSwitch';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';

const LDAPSetting = () => {
  const { t } = useTranslation();

  const {
    form,
    renderConfigForm,
    startModify,
    modifyFinish,
    modifyFlag,
    extraButtonsVisible
  } = useConfigRender<LDAPFormFields>({
    switchFieldName,
    switchFieldLabel: t('dmsSystem.ldap.enableLdap')
  });

  const {
    data: ldapSetting,
    loading,
    refresh: refreshLdapSetting
  } = useRequest(
    () => dms.GetLDAPConfiguration().then((res) => res.data.data),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enable_ldap: !!res.enable_ldap
          });
        }
      }
    }
  );
  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      enable_ldap: ldapSetting?.enable_ldap ?? false,
      enable_ssl: ldapSetting?.enable_ssl ?? false,
      ldap_server_host: ldapSetting?.ldap_server_host,
      ldap_server_port: ldapSetting?.ldap_server_port,
      ldap_connect_dn: ldapSetting?.ldap_connect_dn,
      ldap_search_base_dn: ldapSetting?.ldap_search_base_dn,
      ldap_user_name_rdn_key: ldapSetting?.ldap_user_name_rdn_key,
      ldap_user_email_rdn_key: ldapSetting?.ldap_user_email_rdn_key
    });
  }, [form, ldapSetting]);

  const isConfigClosed = useMemo(() => {
    return !ldapSetting?.enable_ldap;
  }, [ldapSetting]);

  const [
    submitLoading,
    { setTrue: startUpdateLdap, setFalse: updateLdapFinish }
  ] = useBoolean();
  const handleSubmit = (values: LDAPFormFields) => {
    startUpdateLdap();
    dms
      .UpdateLDAPConfiguration({
        ldap: {
          ...values
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          form.resetFields();
          refreshLdapSetting();
        }
      })
      .finally(() => {
        updateLdapFinish();
      });
  };

  const handleClickModify = () => {
    startModify();
    setFormDefaultValue();
  };

  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    modifyFinish();
  };

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
  };

  const switchOpen = Form.useWatch(switchFieldName, form);

  const {
    configSwitchPopoverVisible,
    onConfigSwitchPopoverOpen,
    onConfigSwitchPopoverConfirm,
    onConfigSwitchChange
  } = useConfigSwitch({
    isConfigClosed,
    switchOpen,
    modifyFlag,
    startModify,
    startSubmit: startUpdateLdap,
    submitFinish: updateLdapFinish,
    handleUpdateConfig: () =>
      dms.UpdateLDAPConfiguration({
        ldap: {
          ...ldapSetting,
          enable_ldap: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshLdapSetting,
    handleToggleSwitch
  });

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<ILDAPConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: t('dmsSystem.ldap.enableLdapSSL'),
          span: 3,
          dataIndex: 'enable_ssl',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
          hidden: !ldapSetting?.enable_ldap
        },
        {
          label: t('dmsSystem.ldap.ldapServerHost'),
          span: 3,
          dataIndex: 'ldap_server_host',
          hidden: !ldapSetting?.enable_ldap
        },
        {
          label: t('dmsSystem.ldap.ldapServerPort'),
          span: 3,
          dataIndex: 'ldap_server_port',
          hidden: !ldapSetting?.enable_ldap
        },
        {
          label: t('dmsSystem.ldap.ldapConnectDn'),
          span: 3,
          dataIndex: 'ldap_connect_dn',
          hidden: !ldapSetting?.enable_ldap
        },
        {
          label: t('dmsSystem.ldap.ldapSearchBaseDn'),
          span: 3,
          dataIndex: 'ldap_search_base_dn',
          hidden: !ldapSetting?.enable_ldap
        },
        {
          label: t('dmsSystem.ldap.ldapSearchBaseDn'),
          span: 3,
          dataIndex: 'ldap_search_base_dn',
          hidden: !ldapSetting?.enable_ldap
        },
        {
          label: t('dmsSystem.ldap.ldapUserNameRdnKey'),
          span: 3,
          dataIndex: 'ldap_user_name_rdn_key',
          hidden: !ldapSetting?.enable_ldap
        },
        {
          label: t('dmsSystem.ldap.ldapUserEmailRdnKey'),
          span: 3,
          dataIndex: 'ldap_user_email_rdn_key',
          hidden: !ldapSetting?.enable_ldap
        }
      ];
    }, [ldapSetting?.enable_ldap, t]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading || submitLoading}>
        {renderConfigForm({
          data: ldapSetting ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <Space hidden={isConfigClosed || !extraButtonsVisible}>
              <ConfigModifyBtn onClick={handleClickModify} />
            </Space>
          ),
          configSwitchNode: (
            <ConfigSwitch
              switchFieldName={switchFieldName}
              switchOpen={switchOpen}
              modifyFlag={modifyFlag}
              submitLoading={submitLoading}
              popoverVisible={configSwitchPopoverVisible}
              onConfirm={onConfigSwitchPopoverConfirm}
              onSwitchChange={onConfigSwitchChange}
              onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
            />
          ),
          configField: (
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
                <BasicInput placeholder={t('common.form.placeholder.input')} />
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
                <BasicInput placeholder={t('common.form.placeholder.input')} />
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
                <BasicInput placeholder={t('common.form.placeholder.input')} />
              </FormItemLabel>
              <FormItemLabel
                label={t('dmsSystem.ldap.ldapConnectPwd')}
                name="ldap_connect_pwd"
              >
                <BasicInput.Password
                  placeholder={t('common.form.placeholder.input')}
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
                <BasicInput placeholder={t('common.form.placeholder.input')} />
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
                <BasicInput placeholder={t('common.form.placeholder.input')} />
              </FormItemLabel>
            </>
          ),
          submitButtonField: (
            <FormItemNoLabel>
              <Space size={12}>
                <BasicButton
                  onClick={handleClickCancel}
                  disabled={submitLoading}
                >
                  {t('common.cancel')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  htmlType="submit"
                  disabled={submitLoading}
                >
                  {t('common.submit')}
                </BasicButton>
              </Space>
            </FormItemNoLabel>
          ),
          submit: handleSubmit
        })}
      </Spin>
    </div>
  );
};

export default LDAPSetting;
