import { useTranslation } from 'react-i18next';

import { BasicInput } from '@actiontech/shared';
import {
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared/lib/components/FormCom';

const ConfigField = () => {
  const { t } = useTranslation();

  return (
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
            title={t('dmsSystem.oauth.userEmailTagName')}
            tips={t('dmsSystem.oauth.userEmailTagNameTips')}
          />
        }
        name="userEmailTag"
      >
        <BasicInput />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.oauth.userWechatTagName')}
            tips={t('dmsSystem.oauth.userWechatTagNameTips')}
          />
        }
        name="userWechatTag"
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
            message: t('dmsSystem.oauth.loginButtonTextValidateMessage')
          }
        ]}
      >
        <BasicInput />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
