import { BasicButton } from '@actiontech/shared';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceAuditPlanInfoLastCollectStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
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

  if (status === InstanceAuditPlanInfoLastCollectStatusEnum.success) {
    const count = record.last_collect_success_count ?? 0;
    return (
      <Popover
        trigger={['hover', 'click']}
        content={
          <span>
            {t(
              'managementConf.detail.overview.column.lastCollectResult.successCountTips',
              { n: count }
            )}
          </span>
        }
      >
        <span>{mainText}</span>
      </Popover>
    );
  }

  if (status === InstanceAuditPlanInfoLastCollectStatusEnum.failed) {
    const failureMsg = record.last_collect_failure_msg ?? '';
    return (
      <Popover
        trigger={['hover', 'click']}
        content={
          <Space direction="vertical" size={8} style={{ maxWidth: 420 }}>
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
          </Space>
        }
      >
        <span>{mainText}</span>
      </Popover>
    );
  }

  return <span>{mainText}</span>;
};

export default LastCollectResultCell;
