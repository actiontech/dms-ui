import { Steps, Typography, StepProps } from 'antd';
import { BasicButton } from '@actiontech/shared';
import { PluginAuditDefaultPromptsWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

const DefaultPrompts = () => {
  const { t } = useTranslation();
  const { language } = useCurrentUser();

  const stepItems = (desc: string): StepProps[] => {
    return desc.split('\n').map((i) => ({ title: i }));
  };

  return (
    <PluginAuditDefaultPromptsWrapper direction="vertical" align="center">
      <Typography.Title level={3}>
        {t('pluginAudit.promptTitle')}
      </Typography.Title>
      <Typography.Text type="secondary">
        {t('pluginAudit.promptDesc')}
      </Typography.Text>
      <div className="step-wrap">
        <Steps status="wait" items={stepItems(t('pluginAudit.promptStep'))} />
        {language === SupportLanguage.zhCN ? (
          <a
            target="_blank"
            href="https://actiontech.github.io/sqle-docs/docs/dev-manual/auditplugins/jetbrains"
            rel="noreferrer"
          >
            <BasicButton type="primary">
              {t('pluginAudit.userBook')}
            </BasicButton>
          </a>
        ) : null}
      </div>
    </PluginAuditDefaultPromptsWrapper>
  );
};

export default DefaultPrompts;
