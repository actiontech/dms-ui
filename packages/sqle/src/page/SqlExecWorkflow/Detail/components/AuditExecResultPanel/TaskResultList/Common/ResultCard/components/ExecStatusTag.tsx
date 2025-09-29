import { BasicTag } from '@actiontech/dms-kit';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { BasicTagColor } from '@actiontech/dms-kit/es/theme/theme.type';
import { useTranslation } from 'react-i18next';
import { execStatusDictionary } from '../../../../../../../../../hooks/useStaticStatus/index.data';
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
  [getAuditTaskSQLsV2FilterExecStatusEnum.execute_rollback]: 'orange'
};
export interface ExecStatusTagProps {
  status: getAuditTaskSQLsV2FilterExecStatusEnum;
}
const ExecStatusTag: React.FC<ExecStatusTagProps> = ({ status }) => {
  const { t } = useTranslation();
  return (
    <BasicTag color={execStatusMap[status]} size="large" bordered={false}>
      {t(execStatusDictionary[status])}
    </BasicTag>
  );
};
export default ExecStatusTag;
