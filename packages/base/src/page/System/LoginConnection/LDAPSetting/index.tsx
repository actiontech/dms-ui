import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Space, Spin } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { switchFieldName } from './index.data';
import {
  ConfigSwitch,
  ConfigModifyBtn,
  ConfigSubmitButtonField,
  useConfigRender,
  useConfigSwitchControls,
  ReadOnlyConfigColumnsType
} from '@actiontech/shared/lib/components/SystemConfigurationHub';
import ConfigField from './components/ConfigField';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { LDAPFormFields } from './index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  ILDAPConfiguration,
  ILDAPConfigurationResData
} from '@actiontech/shared/lib/api/base/service/common';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { useLoginConnectionContext } from '../context';

const LDAPSetting = () => {
  const { t } = useTranslation();
  const { setLDAPEnabled } = useLoginConnectionContext();

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
          setLDAPEnabled(!!res.enable_ldap);
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
    const params: ILDAPConfiguration = {
      enable_ldap: values.enable_ldap,
      enable_ssl: values.enable_ssl,
      ldap_connect_dn: values.ldap_connect_dn,
      ldap_search_base_dn: values.ldap_search_base_dn,
      ldap_server_host: values.ldap_server_host,
      ldap_server_port: values.ldap_server_port,
      ldap_user_email_rdn_key: values.ldap_user_email_rdn_key,
      ldap_user_name_rdn_key: values.ldap_user_name_rdn_key
    };

    if (values.update_password) {
      params.ldap_connect_pwd = values.ldap_connect_pwd;
    }

    startUpdateLdap();
    Configuration.UpdateLDAPConfiguration({
      ldap: params
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

  const switchOpen = Form.useWatch(switchFieldName, form);

  const {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  } = useConfigSwitchControls(form, switchFieldName);

  const onConfigSwitchPopoverConfirm = () => {
    if (isConfigClosed && modifyFlag) {
      handleClickCancel();
      refreshLdapSetting();
      hiddenConfigSwitchPopover();
    } else {
      startUpdateLdap();
      Configuration.UpdateLDAPConfiguration({
        ldap: {
          ...ldapSetting,
          enable_ldap: false
        }
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handleClickCancel();
            refreshLdapSetting();
          }
        })
        .finally(() => {
          updateLdapFinish();
          hiddenConfigSwitchPopover();
        });
    }
  };

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
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION.ENABLE_LDAP
              }
            >
              <Space hidden={isConfigClosed || !extraButtonsVisible}>
                <ConfigModifyBtn onClick={handleClickModify} />
              </Space>
            </PermissionControl>
          ),
          configSwitchNode: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION.ENABLE_LDAP
              }
            >
              <ConfigSwitch
                title={generateConfigSwitchPopoverTitle(modifyFlag)}
                switchFieldName={switchFieldName}
                checked={switchOpen}
                submitLoading={submitLoading}
                popoverVisible={configSwitchPopoverOpenState}
                onConfirm={onConfigSwitchPopoverConfirm}
                onSwitchChange={(open) =>
                  handleConfigSwitchChange(open, handleClickModify)
                }
                onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
              />
            </PermissionControl>
          ),
          configField: <ConfigField />,
          submitButtonField: (
            <ConfigSubmitButtonField
              submitLoading={submitLoading}
              handleClickCancel={handleClickCancel}
            />
          ),
          onSubmit: handleSubmit
        })}
      </Spin>
    </div>
  );
};

export default LDAPSetting;
