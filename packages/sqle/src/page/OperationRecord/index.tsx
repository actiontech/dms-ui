import { useTranslation } from 'react-i18next';
import { PageHeader } from '@actiontech/dms-kit';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import OperationRecordList from './List';
import { useCurrentProject } from '@actiontech/shared/lib/features';

const OperationRecord = () => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

  return (
    <>
      {/* #if [ce] */}
      <PageHeader
        title={
          projectName
            ? t('operationRecord.pageTitle')
            : t('operationRecord.globalPageTitle')
        }
      />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('operationRecord.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('operationRecord.ceTips')}
          </Typography.Paragraph>
        }
      >
        <OperationRecordList />
      </EnterpriseFeatureDisplay>
    </>
  );
};
export default OperationRecord;
