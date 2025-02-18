import { useTranslation } from 'react-i18next';
import LDAPSetting from './LDAPSetting';
import Oauth from './Oauth';
import SystemBasicTitle from '../components/BasicTitle';
import LoginBasicSetting from './LoginBasicSetting';
import { useState } from 'react';
import { LoginConnectionContext } from './context';

const LoginConnection = () => {
  const { t } = useTranslation();
  const [isOAuthEnabled, setOAuthEnabled] = useState(false);
  const [isLDAPEnabled, setLDAPEnabled] = useState(false);

  return (
    <LoginConnectionContext.Provider
      value={{
        isOAuthEnabled,
        isLDAPEnabled,
        setOAuthEnabled,
        setLDAPEnabled
      }}
    >
      <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.loginConnection')}>
        <LDAPSetting />
        <Oauth />
        {/* #if [ee] */}
        <LoginBasicSetting />
        {/* #endif */}
      </SystemBasicTitle>
    </LoginConnectionContext.Provider>
  );
};

export default LoginConnection;
