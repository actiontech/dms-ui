import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Space, Spin } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { switchFieldName } from './index.data';
import ConfigSwitch from '../../components/ConfigSwitch';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import ConfigField from './components/ConfigField';
import ConfigSubmitButtonField from '../../components/ConfigSubmitButtonField';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { LDAPFormFields } from './index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ILDAPConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';

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
    () => Configuration.GetLDAPConfiguration().then((res) => res.data.data),
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
      enable_ssl: ldapSetting?.enable_ssl ?? false,
      ldap_server_host: ldapSetting?.ldap_server_host,
      ldap_server_port: ldapSetting?.ldap_server_port,
      ldap_connect_dn: ldapSetting?.ldap_connect_dn,
      ldap_connect_pwd: undefined,
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
    Configuration.UpdateLDAPConfiguration({
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
    setFormDefaultValue();
    startModify();
  };

  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
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
    startSubmit: startUpdateLdap,
    submitFinish: updateLdapFinish,
    handleClickModify,
    handleUpdateConfig: () =>
      Configuration.UpdateLDAPConfiguration({
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
          configField: <ConfigField />,
          submitButtonField: (
            <ConfigSubmitButtonField
              submitLoading={submitLoading}
              handleClickCancel={handleClickCancel}
            />
          ),
          submit: handleSubmit
        })}
      </Spin>
    </div>
  );
};

export default LDAPSetting;
