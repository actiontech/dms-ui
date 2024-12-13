import { useTranslation } from 'react-i18next';
import DingTalkSetting from './DingTalkSetting';
import LarkAuditSetting from './LarkAuditSetting';
import SystemBasicTitle from '../components/BasicTitle';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import WechatAuditSetting from './WechatAuditSetting';
import CodingSetting from './CodingSetting';

const ProcessConnection = () => {
  const { t } = useTranslation();

  return (
    <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.processConnection')}>
      <EnterpriseFeatureDisplay
        featureName={t('dmsSystem.tabPaneTitle.processConnection')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsSystem.processConnectionCETips')}
          </Typography.Paragraph>
        }
        isConfigPage={true}
        showTitle={false}
      >
        <DingTalkSetting />
        <LarkAuditSetting />
        <WechatAuditSetting />
        <CodingSetting />
      </EnterpriseFeatureDisplay>
    </SystemBasicTitle>
  );
};

export default ProcessConnection;
