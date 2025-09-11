import { Space } from 'antd';
import ActionButton from './ActionButton';
import { ActionButtonGroupProps } from './ActionButton.types';

const ActionButtonGroup = ({
  actions,
  ...spaceProps
}: ActionButtonGroupProps) => {
  if (actions.length === 0) {
    return null;
  }
  return (
    <Space {...spaceProps}>
      {actions.map(({ key, ...action }) => {
        return <ActionButton key={key} {...action} />;
      })}
    </Space>
  );
};

ActionButtonGroup.displayName = 'ActionButtonGroup';

export default ActionButtonGroup;
