import { BasicTag } from '@actiontech/shared';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { BasicTagColor } from '@actiontech/shared/lib/theme/theme.type';
import { execStatusDictionary } from '../../../../../hooks/useStaticStatus/index.data';
import { useTranslation } from 'react-i18next';

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
  [getAuditTaskSQLsV2FilterExecStatusEnum.terminating]: 'geekblue'
};

const ExecStatusTag: React.FC<{
  status: getAuditTaskSQLsV2FilterExecStatusEnum;
}> = ({ status }) => {
  const { t } = useTranslation();

  return (
    <BasicTag color={execStatusMap[status]} size="large" bordered={false}>
      {t(execStatusDictionary[status])}
    </BasicTag>
  );
};

export default ExecStatusTag;
