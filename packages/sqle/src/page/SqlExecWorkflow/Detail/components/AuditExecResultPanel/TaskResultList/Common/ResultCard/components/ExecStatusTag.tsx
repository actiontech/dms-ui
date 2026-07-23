import { BasicTag } from '@actiontech/dms-kit';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { BasicTagColor } from '@actiontech/dms-kit/es/theme/theme.type';
import { useTranslation } from 'react-i18next';
import { execStatusDictionary } from '../../../../../../../../../hooks/useStaticStatus/index.data';
import {
  failProductStatusI18nKey,
  ONLINE_FAIL_STAGE,
  resolveFailStage
} from '../../../../../../utils/failDisplay';

const execStatusMap: {
  [key in getAuditTaskSQLsV2FilterExecStatusEnum]?: BasicTagColor;
} = {
  [getAuditTaskSQLsV2FilterExecStatusEnum.initialized]: 'default',
  [getAuditTaskSQLsV2FilterExecStatusEnum.failed]: 'red',
  [getAuditTaskSQLsV2FilterExecStatusEnum.succeeded]: 'green',
  [getAuditTaskSQLsV2FilterExecStatusEnum.doing]: 'geekblue',
  [getAuditTaskSQLsV2FilterExecStatusEnum.manually_executed]: 'orange',
  [getAuditTaskSQLsV2FilterExecStatusEnum.terminate_failed]: 'red',
  [getAuditTaskSQLsV2FilterExecStatusEnum.terminate_succeeded]: 'green',
  [getAuditTaskSQLsV2FilterExecStatusEnum.terminating]: 'geekblue',
  [getAuditTaskSQLsV2FilterExecStatusEnum.execute_rollback]: 'orange',
  [getAuditTaskSQLsV2FilterExecStatusEnum.not_executed]: 'orange'
};
export interface ExecStatusTagProps {
  status: getAuditTaskSQLsV2FilterExecStatusEnum;
  failStage?: string;
  backupStatus?: string;
}
const ExecStatusTag: React.FC<ExecStatusTagProps> = ({
  status,
  failStage,
  backupStatus
}) => {
  const { t } = useTranslation();
  const productStatusKey =
    status === getAuditTaskSQLsV2FilterExecStatusEnum.failed
      ? failProductStatusI18nKey[resolveFailStage(failStage, backupStatus)] ??
        failProductStatusI18nKey[ONLINE_FAIL_STAGE.unknown]
      : null;
  const label = productStatusKey
    ? t(productStatusKey)
    : t(execStatusDictionary[status]);
  return (
    <BasicTag color={execStatusMap[status]} size="large" bordered={false}>
      {label}
    </BasicTag>
  );
};
export default ExecStatusTag;
