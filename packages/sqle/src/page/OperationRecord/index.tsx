import { useTranslation } from 'react-i18next';
import { PageHeader } from '@actiontech/dms-kit';
import OperationRecordList from './List';

const OperationRecord = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* #if [ce] */}
      <PageHeader title={t('operationRecord.pageTitle')} />
      {/* #endif */}

      <OperationRecordList />
    </>
  );
};

export default OperationRecord;
