import React from 'react';
import { useTranslation } from 'react-i18next';
import { OperationRecordListStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import { CheckHexagonOutlined, InfoHexagonOutlined } from '@actiontech/icons';

const OperationStatus: React.FC<{ status: OperationRecordListStatusEnum }> = ({
  status
}) => {
  const { t } = useTranslation();

  return (
    <TableColumnWithIconStyleWrapper>
      {status === OperationRecordListStatusEnum.succeeded ? (
        <>
          <CheckHexagonOutlined />
          <span>{t('common.success')}</span>
        </>
      ) : (
        <>
          <InfoHexagonOutlined />
          <span>{t('common.fail')}</span>
        </>
      )}
    </TableColumnWithIconStyleWrapper>
  );
};

export default OperationStatus;
