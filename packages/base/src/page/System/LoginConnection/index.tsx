import { useTranslation } from 'react-i18next';
import LDAPSetting from './LDAPSetting';
import Oauth from './Oauth';
import SystemBasicTitle from '../components/BasicTitle';

const LoginConnection = () => {
  const { t } = useTranslation();

  return (
    <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.loginConnection')}>
      <>
        <LDAPSetting />
        <Oauth />
      </>
    </SystemBasicTitle>
  );
};

export default LoginConnection;
