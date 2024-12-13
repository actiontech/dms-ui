import { useTranslation } from 'react-i18next';
import { CustomLoadingIndicatorStyleWrapper } from './style';
import { SpinIndicator } from '@actiontech/shared';

const CustomLoadingIndicator: React.FC = () => {
  const { t } = useTranslation();
  return (
    <CustomLoadingIndicatorStyleWrapper className="custom-loading-container">
      <SpinIndicator className="loading-animation-icon" />
      <div className="loading-text">
        <span className="ai-icon"></span>
        {t('sqlRewrite.aiIsThinking')}
      </div>
      <div className="loading-subtext">
        {t('sqlRewrite.generatingResultsWithLLM')}
      </div>
    </CustomLoadingIndicatorStyleWrapper>
  );
};

export default CustomLoadingIndicator;
