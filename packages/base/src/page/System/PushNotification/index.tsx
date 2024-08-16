import { useTranslation } from 'react-i18next';
import SystemBasicTitle from '../components/BasicTitle';
import SMTPSetting from './SMTPSetting';
import Wechat from './Wechat';
import LarkSetting from './LarkSetting';
import WebHook from './WebhookSetting';

const PushNotification = () => {
  const { t } = useTranslation();

  return (
    <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.pushNotification')}>
      <>
        <SMTPSetting />
        <Wechat />
        <LarkSetting />
        <WebHook />
      </>
    </SystemBasicTitle>
  );
};

export default PushNotification;
