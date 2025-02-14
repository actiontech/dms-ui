import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import KnowledgeEE from './index.ee';

const Knowledge = () => {
  const { t } = useTranslation();

  return (
    <EnterpriseFeatureDisplay
      featureName={t('knowledgeBase.pageTitle')}
      eeFeatureDescription={
        <Typography.Paragraph className="paragraph">
          {t('knowledgeBase.ceTips')}
        </Typography.Paragraph>
      }
    >
      <KnowledgeEE />
    </EnterpriseFeatureDisplay>
  );
};

export default Knowledge;
