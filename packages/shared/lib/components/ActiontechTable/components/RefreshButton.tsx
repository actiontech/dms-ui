import { TableRefreshButtonProps } from '../index.type';
import BasicButton from '../../BasicButton';
import { RefreshOutlined } from '@actiontech/icons';

const RefreshButton: React.FC<TableRefreshButtonProps> = ({
  refresh,
  ...props
}) => {
  return (
    <BasicButton
      size="small"
      icon={<RefreshOutlined width={14} height={14} />}
      onClick={refresh}
      {...props}
    ></BasicButton>
  );
};

export default RefreshButton;
