import { useBoolean } from 'ahooks';
import { Space, Typography } from 'antd5';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../EmptyBox';
import { TestDatabaseConnectButtonProps } from './index.type';
import BasicButton from '../BasicButton';
import { IconFailed, IconSucceeded } from '../../Icon/common';
import { TestConnectResultStyleWrapper } from './style';
import BasicToolTips from '../BasicToolTips';

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
    <Space>
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
          <TestConnectResultStyleWrapper success>
            <IconSucceeded />
            {t('common.testDatabaseConnectButton.testSuccess')}
          </TestConnectResultStyleWrapper>
        )}
        {!props.loading && !props.connectAble && (
          <BasicToolTips title={props.connectDisableReason}>
            <TestConnectResultStyleWrapper success={false}>
              <IconFailed />
              {t('common.testDatabaseConnectButton.testFailed')}
            </TestConnectResultStyleWrapper>
          </BasicToolTips>
        )}
      </EmptyBox>
    </Space>
  );
};

export default TestDatabaseConnectButton;
