import { useBoolean } from 'ahooks';
import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../EmptyBox';
import { TestDatabaseConnectButtonProps } from './index.type';
import BasicButton from '../BasicButton';
import ReminderInformation from '../ReminderInformation';

const TestDatabaseConnectButton: React.FC<TestDatabaseConnectButtonProps> = (
  props
) => {
  const { t } = useTranslation();
  const [initHide, { setFalse }] = useBoolean(props.initHide ?? true);

  const handleClick = () => {
    if (initHide && props.initHide === undefined) {
      setFalse();
    }
    props.onClickTestButton();
  };

  return (
    <Space direction="vertical">
      <BasicButton onClick={handleClick} loading={props.loading}>
        {t('common.testDatabaseConnectButton.testDatabaseConnection')}
      </BasicButton>
      <EmptyBox if={props.initHide !== undefined ? !props.initHide : !initHide}>
        {props.loading && (
          <Typography.Link>
            {t('common.testDatabaseConnectButton.testing')}
          </Typography.Link>
        )}
        {!props.loading && props.connectAble && (
          <ReminderInformation
            status="success"
            message={t('common.testDatabaseConnectButton.testSuccess')}
          />
        )}
        {!props.loading && !props.connectAble && (
          <ReminderInformation
            status="error"
            message={props.connectDisableReason ?? ''}
          />
        )}
      </EmptyBox>
    </Space>
  );
};

export default TestDatabaseConnectButton;
