import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { Form, Space, Spin, Tag } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  BasicButton,
  BasicInput,
  BasicToolTips,
  EmptyBox,
  EnterpriseFeatureDisplay
} from '@actiontech/shared';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import ConfigSwitch from '../../components/ConfigSwitch';
import {
  FormItemLabel,
  FormItemNoLabel,
  CustomLabelContent
} from '@actiontech/shared/lib/components/FormCom';
import { switchFieldName } from './index.data';
import { OauthFormField } from './index.type';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  IGetOauth2ConfigurationResData,
  IOauth2Configuration
} from '@actiontech/shared/lib/api/base/service/common';
import { IUpdateOauth2ConfigurationParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';

const Oauth = () => {
  const { t } = useTranslation();

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
    () => dms.GetOauth2Configuration().then((res) => res.data?.data ?? {}),
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
      user_id_tag: value.userIdKeyName
    };

    if (!!value.scopes) {
      configuration.scopes = value.scopes.split(',');
    }

    const params: IUpdateOauth2ConfigurationParams = {
      oauth2: configuration
    };

    try {
      const res = await dms.UpdateOauth2Configuration(params);
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
      userIdKeyName: oauthConfig?.user_id_tag
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
      dms.UpdateOauth2Configuration({
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
              suffixIcon={<IconTipGray />}
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
              suffixIcon={<IconTipGray />}
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
              suffixIcon={<IconTipGray />}
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
              title={t('dmsSystem.oauth.loginButtonTextTips')}
              suffixIcon={<IconTipGray />}
            >
              {t('dmsSystem.oauth.loginButtonText')}
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'login_tip',
          hidden: !oauthConfig?.enable_oauth2
        }
      ];
    }, [oauthConfig?.enable_oauth2, t]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={getConfigLoading}>
        <EnterpriseFeatureDisplay
          featureName={t('dmsSystem.oauth.featureName')}
          eeFeatureDescription={t('dmsSystem.oauth.ceTips')}
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
              configField: (
                <>
                  <FormItemLabel
                    className="has-label-tip has-required-style"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.clientId')}
                        tips={t('dmsSystem.oauth.clientIdTips')}
                      />
                    }
                    name="clientId"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsSystem.oauth.clientId')
                        })
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.clientSecret')}
                        tips={t('dmsSystem.oauth.clientSecretTips')}
                      />
                    }
                    name="clientSecret"
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip has-required-style"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.clientHost')}
                        tips={t('dmsSystem.oauth.clientHostTips')}
                      />
                    }
                    name="clientHost"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsSystem.oauth.clientHost')
                        })
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip has-required-style"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.serverAuthUrl')}
                        tips={t('dmsSystem.oauth.serverAuthUrlTips')}
                      />
                    }
                    name="serverAuthUrl"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsSystem.oauth.serverAuthUrl')
                        })
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip has-required-style"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.serverTokenUrl')}
                        tips={t('dmsSystem.oauth.serverTokenUrlTips')}
                      />
                    }
                    name="serverTokenUrl"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsSystem.oauth.serverTokenUrl')
                        })
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip has-required-style"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.serverUserIdUrl')}
                        tips={t('dmsSystem.oauth.serverUserIdUrlTips')}
                      />
                    }
                    name="serverUserIdUrl"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsSystem.oauth.serverUserIdUrl')
                        })
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.scopes')}
                        tips={t('dmsSystem.oauth.scopesTips')}
                      />
                    }
                    name="scopes"
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip has-required-style"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.accessTokenKeyName')}
                        tips={t('dmsSystem.oauth.accessTokenKeyNameTips')}
                      />
                    }
                    name="accessTokenKeyName"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsSystem.oauth.accessTokenKeyName')
                        })
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip has-required-style"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.userIdKeyName')}
                        tips={t('dmsSystem.oauth.userIdKeyNameTips')}
                      />
                    }
                    name="userIdKeyName"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsSystem.oauth.userIdKeyName')
                        })
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    className="has-label-tip"
                    label={
                      <CustomLabelContent
                        title={t('dmsSystem.oauth.loginButtonText')}
                        tips={t('dmsSystem.oauth.loginButtonTextTips')}
                      />
                    }
                    name="loginButtonText"
                    rules={[
                      {
                        type: 'string',
                        max: 28,
                        message: t(
                          'dmsSystem.oauth.loginButtonTextValidateMessage'
                        )
                      }
                    ]}
                  >
                    <BasicInput />
                  </FormItemLabel>
                </>
              ),
              submitButtonField: (
                <FormItemNoLabel>
                  <Space size={12}>
                    <BasicButton
                      disabled={submitLoading}
                      onClick={handleClickCancel}
                    >
                      {t('common.cancel')}
                    </BasicButton>
                    <BasicButton
                      disabled={submitLoading}
                      loading={submitLoading}
                      htmlType="submit"
                      type="primary"
                    >
                      {t('common.submit')}
                    </BasicButton>
                  </Space>
                </FormItemNoLabel>
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
