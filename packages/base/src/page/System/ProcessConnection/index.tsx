import { useTranslation } from 'react-i18next';
import DingTalkSetting from './DingTalkSetting';
import LarkAuditSetting from './LarkAuditSetting';

const ProcessConnection = () => {
  const { t } = useTranslation();

  return (
    <section className="system-form-wrapper">
      <div className="config-title-wrapper">
        {t('dmsSystem.tabPaneTitle.processConnection')}
      </div>
      <DingTalkSetting />
      <LarkAuditSetting />
    </section>
  );
};

export default ProcessConnection;
