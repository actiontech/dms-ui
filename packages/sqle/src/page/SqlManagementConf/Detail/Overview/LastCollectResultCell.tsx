import { BasicButton } from '@actiontech/shared';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceAuditPlanInfoLastCollectStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import Copy from '@actiontech/shared/lib/utils/Copy';
import { Popover, Space, Typography, message } from 'antd';
import { t } from '../../../../locale';

const mapLastCollectStatusText = (status?: string | null) => {
  if (status === undefined || status === null || status === '') {
    return t('managementConf.detail.overview.column.lastCollectResult.none');
  }
  switch (status) {
    case InstanceAuditPlanInfoLastCollectStatusEnum.success:
      return t(
        'managementConf.detail.overview.column.lastCollectResult.success'
      );
    case InstanceAuditPlanInfoLastCollectStatusEnum.success_empty:
      return t(
        'managementConf.detail.overview.column.lastCollectResult.successEmpty'
      );
    case InstanceAuditPlanInfoLastCollectStatusEnum.failed:
      return t(
        'managementConf.detail.overview.column.lastCollectResult.failed'
      );
    default:
      return t('managementConf.detail.overview.column.lastCollectResult.none');
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

const LastCollectResultCell: React.FC<{
  record: IInstanceAuditPlanInfo;
}> = ({ record }) => {
  const status = record.last_collect_status;
  const mainText = mapLastCollectStatusText(status);
  const hasStatus = status !== undefined;
  const failureMsg = record.last_collect_failure_msg ?? '';
  const isFailed = status === InstanceAuditPlanInfoLastCollectStatusEnum.failed;

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
                'managementConf.detail.overview.column.lastCollectResult.collectedSqlCount',
                { n: record.total_sql_nums ?? 0 }
              )}
            </span>
            <span>
              {t(
                'managementConf.detail.overview.column.lastCollectResult.roundSuccessCount',
                { n: record.last_collect_success_count ?? 0 }
              )}
            </span>
            <span>
              {t(
                'managementConf.detail.overview.column.lastCollectResult.lastCollectionTime',
                {
                  time: formatTime(
                    record.last_collection_time ?? undefined,
                    '—'
                  )
                }
              )}
            </span>
            {isFailed ? (
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
                    'managementConf.detail.overview.column.lastCollectResult.copy'
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

export default LastCollectResultCell;
