import { useTranslation } from 'react-i18next';
import SMTPSetting from './SMTPSetting';
import Wechat from './Wechat';
import LarkSetting from './LarkSetting';
import WebHook from './WebhookSetting';

const PushNotification = () => {
  const { t } = useTranslation();

  return (
    <section className="system-form-wrapper">
      <div className="config-title-wrapper">
        {t('dmsSystem.tabPaneTitle.pushNotification')}
      </div>

      <SMTPSetting />
      <Wechat />
      <LarkSetting />
      <WebHook />
    </section>
  );
};

export default PushNotification;
