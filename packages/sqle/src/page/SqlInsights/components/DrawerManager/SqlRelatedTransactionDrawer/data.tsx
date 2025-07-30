import { TransactionInfoLockTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../../locale';

export const TransactionInfoLockTypeEnumDict = {
  [TransactionInfoLockTypeEnum.EXCLUSIVE]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.exclusive'
  ),
  [TransactionInfoLockTypeEnum.SHARED]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.shared'
  ),
  [TransactionInfoLockTypeEnum.INTENTION_SHARED]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.intentionShared'
  ),
  [TransactionInfoLockTypeEnum.INTENTION_EXCLUSIVE]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.intentionExclusive'
  ),
  [TransactionInfoLockTypeEnum.SHARED_INTENTION_EXCLUSIVE]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.sharedIntentionExclusive'
  ),
  [TransactionInfoLockTypeEnum.ROW_LOCK]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.rowLock'
  ),
  [TransactionInfoLockTypeEnum.TABLE_LOCK]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.tableLock'
  ),
  [TransactionInfoLockTypeEnum.METADATA_LOCK]: t(
    'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockTypeDict.metadataLock'
  )
};

export const TransactionInfoLockTypeEnumFlagDict = {
  [TransactionInfoLockTypeEnum.SHARED]: 'S',
  [TransactionInfoLockTypeEnum.INTENTION_SHARED]: 'IS',
  [TransactionInfoLockTypeEnum.INTENTION_EXCLUSIVE]: 'IX',
  [TransactionInfoLockTypeEnum.SHARED_INTENTION_EXCLUSIVE]: 'SIX',
  [TransactionInfoLockTypeEnum.ROW_LOCK]: 'RL',
  [TransactionInfoLockTypeEnum.TABLE_LOCK]: 'TL',
  [TransactionInfoLockTypeEnum.METADATA_LOCK]: 'ML',
  [TransactionInfoLockTypeEnum.EXCLUSIVE]: 'X'
};
