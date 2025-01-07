import { Space } from 'antd';
import ActionButton from './ActionButton';
import { ActionButtonGroupProps } from './ActionButton.types';
import { RoutePathValue } from '../TypedRouter';

const ActionButtonGroup = <T extends RoutePathValue>({
  actions,
  ...spaceProps
}: ActionButtonGroupProps<T>) => {
  return (
    <Space {...spaceProps}>
      {actions.map(({ key, ...action }) => {
        return <ActionButton<T> key={key} {...action} />;
      })}
    </Space>
  );
};

ActionButtonGroup.displayName = 'ActionButtonGroup';

export default ActionButtonGroup;
