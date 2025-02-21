import { Popconfirm, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  BasicSwitch,
  BasicToolTip,
  ConfigItem,
  EditInput,
  LabelContent
} from '@actiontech/shared';
import { useState } from 'react';
import { useLoginConnectionContext } from '../context';
import { useBoolean, useRequest } from 'ahooks';
import { ConfigurationService } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ILoginConfiguration } from '@actiontech/shared/lib/api/base/service/common';

const LoginBasicSetting: React.FC = () => {
  const { t } = useTranslation();
  const { isLDAPEnabled, isOAuthEnabled } = useLoginConnectionContext();
  const [isPasswordLoginDisabled, setIsPasswordLoginDisabled] = useState(false);
  const [loginButtonText, setLoginButtonText] = useState<string>();
  const [
    isLoginButtonEditing,
    { setTrue: startEditing, setFalse: finishEditing }
  ] = useBoolean();

  const updateLoginConfig = async (
    value: string | boolean,
    configKey: keyof ILoginConfiguration
  ) => {
    const res = await ConfigurationService.UpdateLoginConfiguration({
      login: {
        [configKey]: value
      }
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      refresh();
      if (configKey === 'login_button_text') {
        finishEditing();
      }
    }
  };

  const { loading, refresh } = useRequest(() =>
    ConfigurationService.GetLoginTips().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        setLoginButtonText(res.data.data?.login_button_text);
        setIsPasswordLoginDisabled(!!res.data.data?.disable_user_pwd_login);
      }
    })
  );

  const renderPasswordLoginSwitch = () => {
    if (!isOAuthEnabled) {
      return (
        <BasicToolTip title={t('dmsSystem.loginBasic.enableOAuthFirst')}>
          <BasicSwitch
            data-testid="password-disabled-login-switch-disabled-mode"
            disabled
          />
        </BasicToolTip>
      );
    }

    const confirmTitle = isPasswordLoginDisabled
      ? t('dmsSystem.loginBasic.confirmDisable')
      : isLDAPEnabled
      ? t('dmsSystem.loginBasic.confirmEnableWithLDAP')
      : t('dmsSystem.loginBasic.confirmEnable');

    return (
      <Popconfirm
        title={confirmTitle}
        okText={t('common.ok')}
        cancelText={t('common.cancel')}
        onConfirm={() => {
          const newValue = !isPasswordLoginDisabled;
          setIsPasswordLoginDisabled(newValue);
          updateLoginConfig(newValue, 'disable_user_pwd_login');
        }}
      >
        <BasicSwitch
          data-testid="password-disabled-login-switch"
          checked={isPasswordLoginDisabled}
        />
      </Popconfirm>
    );
  };

  return (
    <Spin spinning={loading} delay={300}>
      <ConfigItem
        label={
          <LabelContent tips={t('dmsSystem.loginBasic.loginButtonTextTips')}>
            {t('dmsSystem.loginBasic.loginButtonText')}
          </LabelContent>
        }
        descNode={loginButtonText ?? '-'}
        fieldVisible={isLoginButtonEditing}
        showField={startEditing}
        hideField={finishEditing}
        inputNode={
          <EditInput
            fieldValue={loginButtonText || ''}
            hideField={finishEditing}
            onSubmit={(value) => {
              updateLoginConfig(value, 'login_button_text');
            }}
          />
        }
      />
      <ConfigItem
        label={
          <LabelContent
            tips={t('dmsSystem.loginBasic.passwordLoginDisabledTips')}
          >
            {t('dmsSystem.loginBasic.passwordLoginDisabled')}
          </LabelContent>
        }
        inputNode={renderPasswordLoginSwitch()}
      />
    </Spin>
  );
};

export default LoginBasicSetting;
