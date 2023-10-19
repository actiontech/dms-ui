import { TableRefreshButtonProps } from '../index.type';
import { IconRefresh } from '../../../Icon';
import BasicButton from '../../BasicButton';

const RefreshButton: React.FC<TableRefreshButtonProps> = ({
  refresh,
  ...props
}) => {
  return (
    <BasicButton
      size="small"
      icon={<IconRefresh />}
      onClick={refresh}
      {...props}
    ></BasicButton>
  );
};

export default RefreshButton;
