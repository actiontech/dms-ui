import { useTranslation } from 'react-i18next';
import DingTalkSetting from './DingTalkSetting';
import LarkAuditSetting from './LarkAuditSetting';
import SystemBasicTitle from '../components/BasicTitle';

const ProcessConnection = () => {
  const { t } = useTranslation();

  return (
    <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.processConnection')}>
      <>
        <DingTalkSetting />
        <LarkAuditSetting />
      </>
    </SystemBasicTitle>
  );
};

export default ProcessConnection;
