import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { Space, Typography, Image } from 'antd';
import OperationRecordList from './List';

const OperationRecord = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* IFTRUE_isCE  */}
      <PageHeader title={t('operationRecord.pageTitle')} />
      {/* FITRUE_isCE */}

      <EnterpriseFeatureDisplay
        featureName={t('operationRecord.pageTitle')}
        eeFeatureDescription={
          <Space direction="vertical">
            <Typography.Paragraph className="paragraph">
              {t('operationRecord.ceTips')}
            </Typography.Paragraph>
            <Image
              width="100%"
              className="ce_img"
              alt="ce_sqle_operate_record_preview"
              src="/static/image/ce_sqle_operate_record_preview.png"
            />
          </Space>
        }
      >
        <OperationRecordList />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default OperationRecord;
