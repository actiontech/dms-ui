import { useTranslation } from 'react-i18next';
import LDAPSetting from './LDAPSetting';
import Oauth from './Oauth';

const LoginConnection = () => {
  const { t } = useTranslation();

  return (
    <section className="system-form-wrapper">
      <div className="config-title-wrapper">
        {t('dmsSystem.tabPaneTitle.loginConnection')}
      </div>
      <LDAPSetting />
      <Oauth />
    </section>
  );
};

export default LoginConnection;
