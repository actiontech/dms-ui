import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { Form, Space, Spin, Tag, Typography } from 'antd';
import {
  BasicToolTip,
  EmptyBox,
  EnterpriseFeatureDisplay
} from '@actiontech/shared';
import {
  ConfigSwitch,
  ConfigModifyBtn,
  ConfigSubmitButtonField,
  useConfigRender,
  useConfigSwitchControls,
  ReadOnlyConfigColumnsType
} from '@actiontech/shared/lib/components/SystemConfigurationHub';
import ConfigField from './components/ConfigField';
import { switchFieldName } from './index.data';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OauthFormField } from './index.type';
import {
  IGetOauth2ConfigurationResData,
  IOauth2Configuration
} from '@actiontech/shared/lib/api/base/service/common';
import { IUpdateOauth2ConfigurationParams } from '@actiontech/shared/lib/api/base/service/Configuration/index.d';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { useLoginConnectionContext } from '../context';

const Oauth = () => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();
  const { setOAuthEnabled } = useLoginConnectionContext();
  const {
    form,
    renderConfigForm,
    startModify,
    modifyFinish,
    modifyFlag,
    extraButtonsVisible
  } = useConfigRender<OauthFormField>({
    switchFieldName,
    switchFieldLabel: t('dmsSystem.oauth.enable')
  });
  const {
    loading: getConfigLoading,
    data: oauthConfig,
    refresh: refreshOauthConfig
  } = useRequest(
    () =>
      Configuration.GetOauth2Configuration().then(
        (res) => res.data?.data ?? {}
      ),
    {
      onSuccess(res) {
        if (res) {
          setOAuthEnabled(!!res.enable_oauth2);
          form.setFieldsValue({
            enable: !!res.enable_oauth2
          });
        }
      },
      // #if [ce]
      ready: false
      // #endif
    }
  );

  const isConfigClosed = useMemo(() => {
    return !oauthConfig?.enable_oauth2;
  }, [oauthConfig]);

  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };
  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const handleSubmit = async (value: OauthFormField) => {
    startSubmit();
    const configuration: IOauth2Configuration = {
      enable_oauth2: value.enable,
      client_id: value.clientId,
      client_key: value.clientSecret,
      client_host: value.clientHost,
      server_auth_url: value.serverAuthUrl,
      server_token_url: value.serverTokenUrl,
      server_user_id_url: value.serverUserIdUrl,
      server_logout_url: value.serverLayoutUrl,
      access_token_tag: value.accessTokenKeyName,
      login_tip: value.oauth2ButtonText,
      user_id_tag: value.userIdKeyName,
      user_email_tag: value.userEmailTag,
      user_wechat_tag: value.userWechatTag,
      auto_create_user: value.autoCreateUser,
      auto_create_user_pwd: value.userPassword,
      skip_check_state: value.skipCheckState,
      login_perm_expr: value.loginPermissionQueryGJsonExpression
    };

    if (!!value.scopes) {
      configuration.scopes = value.scopes.split(',');
    }

    const params: IUpdateOauth2ConfigurationParams = {
      oauth2: configuration
    };

    try {
      const res = await Configuration.UpdateOauth2Configuration(params);
      if (res.data.code === ResponseCode.SUCCESS) {
        modifyFinish();
        form.resetFields();
        refreshOauthConfig();
      }
    } finally {
      submitFinish();
    }
  };

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      clientId: oauthConfig?.client_id,
      clientSecret: undefined,
      clientHost: oauthConfig?.client_host,
      serverAuthUrl: oauthConfig?.server_auth_url,
      serverTokenUrl: oauthConfig?.server_token_url,
      serverUserIdUrl: oauthConfig?.server_user_id_url,
      serverLayoutUrl: oauthConfig?.server_logout_url,
      scopes: oauthConfig?.scopes?.join(','),
      accessTokenKeyName: oauthConfig?.access_token_tag,
      oauth2ButtonText: oauthConfig?.login_tip,
      userIdKeyName: oauthConfig?.user_id_tag,
      userEmailTag: oauthConfig?.user_email_tag,
      userWechatTag: oauthConfig?.user_wechat_tag,
      autoCreateUser: oauthConfig?.auto_create_user,
      // userPassword: oauthConfig?.auto_create_user_pwd,
      skipCheckState: oauthConfig?.skip_check_state,
      loginPermissionQueryGJsonExpression: oauthConfig?.login_perm_expr
    });
  }, [form, oauthConfig]);

  const switchOpen = Form.useWatch(switchFieldName, form);

  const {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  } = useConfigSwitchControls(form, switchFieldName);

  const onConfigSwitchPopoverConfirm = async () => {
    if (isConfigClosed && modifyFlag) {
      handleClickCancel();
      refreshOauthConfig();
      hiddenConfigSwitchPopover();
    } else {
      startSubmit();
      try {
        const res = await Configuration.UpdateOauth2Configuration({
          oauth2: {
            ...oauthConfig,
            enable_oauth2: false
          }
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          handleClickCancel();
          refreshOauthConfig();
        }
      } finally {
        submitFinish();
        hiddenConfigSwitchPopover();
      }
    }
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IGetOauth2ConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: (
            <BasicToolTip
              title={t('dmsSystem.oauth.clientIdTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.clientId')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'client_id',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.clientHost'),
          span: 3,
          dataIndex: 'client_host',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTip
              title={t('dmsSystem.oauth.oauth2ButtonTextTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.oauth2ButtonText')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'login_tip',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.serverAuthUrl'),
          span: 3,
          dataIndex: 'server_auth_url',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.serverTokenUrl'),
          span: 3,
          dataIndex: 'server_token_url',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.serverUserIdUrl'),
          span: 3,
          dataIndex: 'server_user_id_url',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.layoutUrl'),
          span: 3,
          dataIndex: 'server_logout_url',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.backChannelLogoutUri'),
          span: 3,
          dataIndex: 'back_channel_logout_uri',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.scopes'),
          span: 3,
          dataIndex: 'scopes',
          hidden: !oauthConfig?.enable_oauth2,

          render: (val) => {
            const scopes = val as string[];
            return (
              <EmptyBox if={(scopes?.length ?? 0) > 0} defaultNode="--">
                {scopes?.map((e) => (
                  <Tag key={e}>{e}</Tag>
                ))}
              </EmptyBox>
            );
          }
        },
        {
          label: (
            <BasicToolTip
              title={t('dmsSystem.oauth.accessTokenKeyNameTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.accessTokenKeyName')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'access_token_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTip
              title={t('dmsSystem.oauth.userIdKeyNameTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.userIdKeyName')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'user_id_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTip
              title={t('dmsSystem.oauth.userEmailTagNameTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.userEmailTagName')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'user_email_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTip
              title={t('dmsSystem.oauth.userWechatTagNameTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.userWechatTagName')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'user_wechat_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTip
              title={t(
                'dmsSystem.oauth.loginPermissionQueryGJsonExpressionTips'
              )}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.loginPermissionQueryGJsonExpression')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'login_perm_expr',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTip
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
              title={t('dmsSystem.oauth.autoCreateUserTips')}
            >
              {t('dmsSystem.oauth.autoCreateUser')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'auto_create_user',
          hidden: !oauthConfig?.enable_oauth2,
          render: (enable) => (
            <>{!!enable ? t('common.open') : t('common.close')}</>
          )
        },
        {
          label: (
            <BasicToolTip
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
              title={t('dmsSystem.oauth.skipStateCheckTips')}
            >
              {t('dmsSystem.oauth.skipCheckState')}
            </BasicToolTip>
          ),
          span: 3,
          dataIndex: 'skip_check_state',
          hidden: !oauthConfig?.enable_oauth2,
          render: (skipCheck) => (
            <>{skipCheck ? t('common.open') : t('common.close')}</>
          )
        }
      ];
    }, [oauthConfig?.enable_oauth2, t, baseTheme]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={getConfigLoading}>
        <EnterpriseFeatureDisplay
          featureName={t('dmsSystem.oauth.featureName')}
          eeFeatureDescription={
            <Typography.Paragraph className="paragraph">
              {t('dmsSystem.oauth.ceTips')}
            </Typography.Paragraph>
          }
          isConfigPage={true}
        >
          <>
            {renderConfigForm({
              data: oauthConfig ?? {},
              columns: readonlyColumnsConfig,
              configExtraButtons: (
                <PermissionControl
                  permission={
                    PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION
                      .ENABLE_OAUTH2
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
                    PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION
                      .ENABLE_OAUTH2
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
          </>
        </EnterpriseFeatureDisplay>
      </Spin>
    </div>
  );
};

export default Oauth;
