import { useTranslation } from 'react-i18next';
import SMTPSetting from './SMTPSetting';
import Wechat from './Wechat';
import LarkSetting from './LarkSetting';
import WebHook from './WebhookSetting';
import SystemBasicTitle from '../components/BasicTitle';

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
