import React from 'react';
import { useTranslation } from 'react-i18next';
import { OperationRecordListStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IconOrderStatusIsFinished,
  IconOrderStatusIsFailed
} from '../../../icon/Order';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const OperationStatus: React.FC<{ status: OperationRecordListStatusEnum }> = ({
  status
}) => {
  const { t } = useTranslation();

  return (
    <TableColumnWithIconStyleWrapper>
      {status === OperationRecordListStatusEnum.succeeded ? (
        <>
          <IconOrderStatusIsFinished />
          <span>{t('common.success')}</span>
        </>
      ) : (
        <>
          <IconOrderStatusIsFailed />
          <span>{t('common.fail')}</span>
        </>
      )}
    </TableColumnWithIconStyleWrapper>
  );
};

export default OperationStatus;
