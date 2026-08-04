import { BasicTag } from '@actiontech/dms-kit';
import { BasicTagColor } from '@actiontech/dms-kit/es/theme/theme.type';
import { ListDataExportTaskSQLExportStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { useTranslation } from 'react-i18next';
import { resolveExportSqlStatusI18nKey } from '../../../../utils/exportFailDisplay';

const exportExecStatusColorMap: Record<
  ListDataExportTaskSQLExportStatusEnum,
  BasicTagColor
> = {
  [ListDataExportTaskSQLExportStatusEnum.success]: 'green',
  [ListDataExportTaskSQLExportStatusEnum.failed]: 'red',
  [ListDataExportTaskSQLExportStatusEnum.not_executed]: 'orange'
};

export type ExportExecStatusTagProps = {
  status?: string | null;
};

/**
 * 数据导出 SQL 卡片执行状态 Tag（对齐上线 ExecStatusTag 习惯；与 AuditResultTag 分区）
 */
const ExportExecStatusTag: React.FC<ExportExecStatusTagProps> = ({
  status
}) => {
  const { t } = useTranslation();
  const i18nKey = resolveExportSqlStatusI18nKey(status);
  if (!i18nKey) {
    return null;
  }
  const normalized = status?.trim() as ListDataExportTaskSQLExportStatusEnum;
  return (
    <BasicTag
      className="export-exec-status-tag"
      color={exportExecStatusColorMap[normalized] ?? 'default'}
      size="large"
      bordered={false}
      data-testid="export-exec-status-tag"
      data-export-status={normalized}
    >
      {t(i18nKey)}
    </BasicTag>
  );
};

export default ExportExecStatusTag;
