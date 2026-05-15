import { useTranslation } from 'react-i18next';
import { BasicInput, BasicSwitch, EmptyBox } from '@actiontech/dms-kit';
import { FormItemLabel, CustomLabelContent } from '@actiontech/dms-kit';
import { Form } from 'antd';
const ConfigField = () => {
  const { t } = useTranslation();
  const autoCreateUser = Form.useWatch('autoCreateUser');
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.clientId')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.clientSecret')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.clientHost')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.serverAuthUrl')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.serverTokenUrl')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.serverUserIdUrl')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.oauth.layoutUrl')}
            tips={t('dmsSystem.oauth.layoutUrlTips')}
          />
        }
        name="serverLayoutUrl"
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.layoutUrl')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.scopes')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.accessTokenKeyName')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.userIdKeyName')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.userEmailTagName')
          })}
        />
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
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.userWechatTagName')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.oauth.oauth2ButtonText')}
            tips={t('dmsSystem.oauth.oauth2ButtonTextTips')}
          />
        }
        name="oauth2ButtonText"
        rules={[
          {
            type: 'string',
            max: 28,
            message: t('dmsSystem.oauth.loginButtonTextValidateMessage')
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.oauth2ButtonText')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.oauth.loginPermissionQueryGJsonExpression')}
            tips={t('dmsSystem.oauth.loginPermissionQueryGJsonExpressionTips')}
          />
        }
        name="loginPermissionQueryGJsonExpression"
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.oauth.loginPermissionQueryGJsonExpression')
          })}
        />
      </FormItemLabel>

      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.oauth.skipCheckState')}
            tips={t('dmsSystem.oauth.skipStateCheckTips')}
          />
        }
        name="skipCheckState"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.oauth.autoBindSameNameUser')}
            tips={t('dmsSystem.oauth.autoBindSameNameUserTips')}
          />
        }
        name="autoBindSameNameUser"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.oauth.autoCreateUser')}
            tips={t('dmsSystem.oauth.autoCreateUserTips')}
          />
        }
        name="autoCreateUser"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <EmptyBox
        if={autoCreateUser}
        defaultNode={
          <FormItemLabel
            className="has-label-tip"
            label={
              <CustomLabelContent
                title={t('dmsSystem.oauth.enableManuallyBind')}
                tips={t('dmsSystem.oauth.enableManuallyBindTips')}
              />
            }
            name="enableManuallyBind"
            valuePropName="checked"
          >
            <BasicSwitch />
          </FormItemLabel>
        }
      >
        <FormItemLabel
          className="has-label-tip"
          label={
            <CustomLabelContent
              title={t('dmsSystem.oauth.userPassword')}
              tips={t('dmsSystem.oauth.userPasswordTips')}
            />
          }
          name="userPassword"
        >
          <BasicInput.Password
            placeholder={t('common.form.placeholder.input', {
              name: t('dmsSystem.oauth.userPassword')
            })}
          />
        </FormItemLabel>
      </EmptyBox>
    </>
  );
};
export default ConfigField;
