import { useTranslation } from 'react-i18next';
import { BasicTag, BasicToolTip } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import { ListDBServiceV2LastConnectionTestStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
type Props = {
  /** 仅接受 list API 的 last_connection_test_status（连通三态）；勿传入权限结果 */
  connectionStatus?: ListDBServiceV2LastConnectionTestStatusEnum;
  connectionTestTime?: string;
  connectionErrorMessage?: string;
};
/** 列表「上一次连接状态」：只渲染连通写回三态（AC-012） */
const ConnectionStatusColumn: React.FC<Props> = ({
  connectionStatus,
  connectionTestTime,
  connectionErrorMessage
}) => {
  const { t } = useTranslation();
  if (
    connectionStatus ===
    ListDBServiceV2LastConnectionTestStatusEnum.connect_success
  ) {
    return (
      <BasicToolTip
        titleWidth={270}
        title={
          <Typography.Text>
            {t('dmsDataSource.databaseList.lastTestConnectionTime')}：
            {formatTime(connectionTestTime, '-')}
          </Typography.Text>
        }
      >
        <BasicTag
          style={{
            height: 32
          }}
          color="green"
          size="small"
        >
          {t('dmsDataSource.databaseList.connectSucceed')}
        </BasicTag>
      </BasicToolTip>
    );
  }
  if (
    connectionStatus ===
    ListDBServiceV2LastConnectionTestStatusEnum.connect_failed
  ) {
    return (
      <BasicToolTip
        titleWidth={330}
        title={
          <Space direction="vertical">
            <Typography.Text>
              {t('dmsDataSource.databaseList.lastTestConnectionTime')}：
              {formatTime(connectionTestTime, '-')}
            </Typography.Text>

            <Typography.Text>
              {t('dmsDataSource.databaseList.lastTestConnectionErrorMessage')}：
              <Typography.Text type="danger">
                {connectionErrorMessage}
              </Typography.Text>
            </Typography.Text>
          </Space>
        }
      >
        <BasicTag
          style={{
            height: 32
          }}
          color="red"
          size="small"
        >
          {t('dmsDataSource.databaseList.connectFailed')}
        </BasicTag>
      </BasicToolTip>
    );
  }
  return <>-</>;
};
export default ConnectionStatusColumn;
