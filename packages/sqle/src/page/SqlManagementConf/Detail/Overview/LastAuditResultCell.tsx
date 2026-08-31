import { BasicButton } from '@actiontech/shared';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceAuditPlanInfoLastAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import Copy from '@actiontech/shared/lib/utils/Copy';
import { Popover, Space, Typography, message } from 'antd';
import { t } from '../../../../locale';

const mapLastAuditStatusText = (status?: string | null) => {
  if (status === undefined || status === null || status === '') {
    return t('managementConf.detail.overview.column.lastAuditResult.none');
  }
  switch (status) {
    case InstanceAuditPlanInfoLastAuditStatusEnum.success:
      return t('managementConf.detail.overview.column.lastAuditResult.success');
    case InstanceAuditPlanInfoLastAuditStatusEnum.partial_failed:
      return t(
        'managementConf.detail.overview.column.lastAuditResult.partialFailed'
      );
    case InstanceAuditPlanInfoLastAuditStatusEnum.failed:
      return t('managementConf.detail.overview.column.lastAuditResult.failed');
    default:
      return t('managementConf.detail.overview.column.lastAuditResult.none');
  }
};

const copyFailureMsg = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    Copy.copyTextByTextarea(text);
  }
  message.success(t('common.copied'));
};

const isFailureStatus = (status?: string | null) =>
  status === InstanceAuditPlanInfoLastAuditStatusEnum.failed ||
  status === InstanceAuditPlanInfoLastAuditStatusEnum.partial_failed;

const LastAuditResultCell: React.FC<{
  record: IInstanceAuditPlanInfo;
}> = ({ record }) => {
  const status = record.last_audit_status;
  const mainText = mapLastAuditStatusText(status);
  const hasStatus = !(status === undefined || status === null || status === '');
  const failureMsg = record.last_audit_failure_msg ?? '';

  if (!hasStatus) {
    return <span>{mainText}</span>;
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Popover
        trigger={['hover', 'click']}
        content={
          <Space direction="vertical" size={4} style={{ maxWidth: 420 }}>
            <span>
              {t(
                'managementConf.detail.overview.column.lastAuditResult.problematicSqlCount',
                { n: record.unsolved_sql_nums ?? 0 }
              )}
            </span>
            <span>
              {t(
                'managementConf.detail.overview.column.lastAuditResult.lastAuditTime',
                {
                  time: formatTime(
                    record.last_audit_finished_at ?? undefined,
                    '—'
                  )
                }
              )}
            </span>
            {isFailureStatus(status) ? (
              <>
                <Typography.Paragraph
                  style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
                >
                  {failureMsg}
                </Typography.Paragraph>
                <BasicButton
                  size="small"
                  disabled={!failureMsg}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!failureMsg) return;
                    void copyFailureMsg(failureMsg);
                  }}
                >
                  {t(
                    'managementConf.detail.overview.column.lastAuditResult.copy'
                  )}
                </BasicButton>
              </>
            ) : null}
          </Space>
        }
      >
        <span>{mainText}</span>
      </Popover>
    </span>
  );
};

export default LastAuditResultCell;
