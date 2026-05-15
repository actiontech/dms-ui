import { Steps, Typography, StepProps } from 'antd';
import { PipelineConfigurationDefaultPromptsWrapper } from '../style';
import { useTranslation } from 'react-i18next';

const DefaultPrompts = () => {
  const { t } = useTranslation();

  const stepItems = (desc: string): StepProps[] => {
    return desc.split('\n').map((i) => ({ title: i }));
  };

  return (
    <PipelineConfigurationDefaultPromptsWrapper
      direction="vertical"
      align="center"
    >
      <Typography.Title level={3}>
        {t('pipelineConfiguration.defaultPrompt.promptTitle')}
      </Typography.Title>
      <Typography.Text type="secondary">
        {t('pipelineConfiguration.defaultPrompt.promptDesc')}
      </Typography.Text>
      <div className="step-wrap">
        <Steps
          status="wait"
          items={stepItems(t('pipelineConfiguration.defaultPrompt.promptStep'))}
        />
      </div>
    </PipelineConfigurationDefaultPromptsWrapper>
  );
};

export default DefaultPrompts;
