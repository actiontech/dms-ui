import classnames from 'classnames';
import { TableRefreshButtonProps } from '../index.type';
import BasicButton from '../../BasicButton';
import { CheckCircleFilled, RefreshOutlined } from '@actiontech/icons';
import { RefreshButtonStyleWrapper } from './style';

const RefreshButton: React.FC<TableRefreshButtonProps> = ({
  refresh,
  refreshing,
  success,
  lastRefreshTime,
  className,
  disabled,
  ...props
}) => {
  return (
    <RefreshButtonStyleWrapper className="actiontech-table-refresh-button">
      <BasicButton
        size="small"
        className={classnames(className, {
          'refresh-button-success': success
        })}
        icon={
          success ? (
            <CheckCircleFilled
              className="custom-icon custom-icon-refresh-success"
              width={14}
              height={14}
            />
          ) : (
            <RefreshOutlined
              className={classnames('custom-icon custom-icon-refresh', {
                'custom-icon-refresh-spinning': refreshing
              })}
              width={14}
              height={14}
            />
          )
        }
        onClick={refresh}
        disabled={disabled || refreshing}
        {...props}
      ></BasicButton>
      {!!lastRefreshTime && (
        <span className="refresh-time" data-testid="table-refresh-time">
          {lastRefreshTime}
        </span>
      )}
    </RefreshButtonStyleWrapper>
  );
};

export default RefreshButton;
