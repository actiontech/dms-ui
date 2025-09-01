import { BasicButton } from '@actiontech/dms-kit';
import { TableRefreshButtonProps } from '../index.type';
import { RefreshOutlined } from '@actiontech/icons';

const RefreshButton: React.FC<TableRefreshButtonProps> = ({
  refresh,
  ...props
}) => {
  return (
    <BasicButton
      size="small"
      icon={
        <RefreshOutlined
          className="custom-icon custom-icon-refresh"
          width={14}
          height={14}
        />
      }
      onClick={refresh}
      {...props}
    ></BasicButton>
  );
};

export default RefreshButton;
