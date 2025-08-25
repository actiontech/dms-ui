import { useTranslation } from 'react-i18next';
import { BasicTag, BasicToolTip } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import { ListDBServiceV2LastConnectionTestStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
type Props = {
  connectionStatus?: ListDBServiceV2LastConnectionTestStatusEnum;
  connectionTestTime?: string;
  connectionErrorMessage?: string;
};
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
