import { useTranslation } from 'react-i18next';
import { PageHeader } from '@actiontech/dms-kit';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import OperationRecordList from './List';
const OperationRecord = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* #if [ce] */}
      <PageHeader title={t('operationRecord.pageTitle')} />
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
