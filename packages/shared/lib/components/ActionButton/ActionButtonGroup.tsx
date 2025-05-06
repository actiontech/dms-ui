import { Space } from 'antd';
import ActionButton from './ActionButton';
import { ActionButtonGroupProps } from './ActionButton.types';
import { RoutePathValue } from '../TypedRouter';

const ActionButtonGroup = <T extends RoutePathValue>({
  actions,
  ...spaceProps
}: ActionButtonGroupProps<T>) => {
  if (actions.length === 0) {
    return null;
  }
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
