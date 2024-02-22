import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { Typography } from 'antd';
import WorkflowTemplateDetail from './WorkflowTemplateDetail';

const WorkflowTemplate = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* #if [ce] */}
      <PageHeader title={t('workflowTemplate.pageTitle')} />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('workflowTemplate.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('workflowTemplate.ceTips')}
          </Typography.Paragraph>
        }
      >
        <WorkflowTemplateDetail />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default WorkflowTemplate;
