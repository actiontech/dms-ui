import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';

import { Form, Space, Spin, Tag, Typography } from 'antd';
import {
  BasicToolTips,
  EmptyBox,
  EnterpriseFeatureDisplay
} from '@actiontech/shared';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import ConfigSwitch from '../../components/ConfigSwitch';
import ConfigField from './components/ConfigField';
import ConfigSubmitButtonField from '../../components/ConfigSubmitButtonField';

import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import useConfigSwitch from '../../hooks/useConfigSwitch';

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

const Oauth = () => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();

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

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
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
      access_token_tag: value.accessTokenKeyName,
      login_tip: value.loginButtonText,
      user_id_tag: value.userIdKeyName,
      user_email_tag: value.userEmailTag,
      user_wechat_tag: value.userWechatTag,
      auto_create_user: value.autoCreateUser,
      skip_check_state: value.skipCheckState
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
      scopes: oauthConfig?.scopes?.join(','),
      accessTokenKeyName: oauthConfig?.access_token_tag,
      loginButtonText: oauthConfig?.login_tip,
      userIdKeyName: oauthConfig?.user_id_tag,
      userEmailTag: oauthConfig?.user_email_tag,
      userWechatTag: oauthConfig?.user_wechat_tag,
      autoCreateUser: oauthConfig?.auto_create_user,
      skipCheckState: oauthConfig?.skip_check_state
    });
  }, [form, oauthConfig]);

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
    startSubmit,
    submitFinish,
    handleClickModify,
    handleUpdateConfig: () =>
      Configuration.UpdateOauth2Configuration({
        oauth2: {
          ...oauthConfig,
          enable_oauth2: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshOauthConfig,
    handleToggleSwitch
  });

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IGetOauth2ConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: (
            <BasicToolTips
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
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'client_id',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: t('dmsSystem.oauth.clientHostTips'),
          span: 3,
          dataIndex: 'client_host',
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
            <BasicToolTips
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
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'access_token_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTips
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
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'user_id_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTips
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
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'user_email_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTips
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
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'user_wechat_tag',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTips
              title={t('dmsSystem.oauth.loginButtonTextTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.oauth.loginButtonText')}
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'login_tip',
          hidden: !oauthConfig?.enable_oauth2
        },
        {
          label: (
            <BasicToolTips
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
            </BasicToolTips>
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
            <BasicToolTips
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
            </BasicToolTips>
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
          </>
        </EnterpriseFeatureDisplay>
      </Spin>
    </div>
  );
};

export default Oauth;
