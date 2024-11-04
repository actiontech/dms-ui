import { Space } from 'antd';
import ActionButton from './ActionButton';
import { ActionButtonGroupProps } from './index.type';

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  actions,
  ...spaceProps
}) => {
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
