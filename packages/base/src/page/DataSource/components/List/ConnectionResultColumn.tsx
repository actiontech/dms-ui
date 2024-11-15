import { useTranslation } from 'react-i18next';
import { BasicTag, BasicToolTips } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { Space, Tag, Typography } from 'antd';
import { ListDBServiceLastConnectionTestStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

type Props = {
  connectionStatus?: ListDBServiceLastConnectionTestStatusEnum;
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
    ListDBServiceLastConnectionTestStatusEnum.connect_success
  ) {
    return (
      <BasicToolTips
        titleWidth={270}
        title={
          <Typography.Text>
            {t('dmsDataSource.databaseList.lastTestConnectionTime')}：
            {formatTime(connectionTestTime, '-')}
          </Typography.Text>
        }
      >
        <BasicTag style={{ height: 32 }} color="green" size="small">
          {t('dmsDataSource.databaseList.connectSucceed')}
        </BasicTag>
      </BasicToolTips>
    );
  }

  if (
    connectionStatus ===
    ListDBServiceLastConnectionTestStatusEnum.connect_failed
  ) {
    return (
      <BasicToolTips
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
        <BasicTag style={{ height: 32 }} color="red" size="small">
          {t('dmsDataSource.databaseList.connectFailed')}
        </BasicTag>
      </BasicToolTips>
    );
  }

  return <>-</>;
};

export default ConnectionStatusColumn;
