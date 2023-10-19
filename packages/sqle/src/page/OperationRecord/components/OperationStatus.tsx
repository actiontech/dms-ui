import React from 'react';
import { useTranslation } from 'react-i18next';
import { OperationStatusStyleWrapper } from '../style';
import { OperationRecordListStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IconOrderStatusIsFinished,
  IconOrderStatusIsFailed
} from '../../../icon/Order';

const OperationStatus: React.FC<{ status: OperationRecordListStatusEnum }> = ({
  status
}) => {
  const { t } = useTranslation();

  return (
    <OperationStatusStyleWrapper>
      {status === OperationRecordListStatusEnum.succeeded ? (
        <>
          <IconOrderStatusIsFinished />
          {t('common.success')}
        </>
      ) : (
        <>
          <IconOrderStatusIsFailed />
          {t('common.fail')}
        </>
      )}
    </OperationStatusStyleWrapper>
  );
};

export default OperationStatus;
