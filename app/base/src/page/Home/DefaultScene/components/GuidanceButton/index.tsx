import { GuidanceButtonStyleWrapper } from './style';
import { ButtonProps, Space } from 'antd';

const GuidanceButton = (props: ButtonProps) => {
  const { children, ...otherProps } = props;

  return (
    <GuidanceButtonStyleWrapper
      className="guidance-button-wrapper"
      size="small"
      {...otherProps}
    >
      <Space size={0}>{children}</Space>
    </GuidanceButtonStyleWrapper>
  );
};

export default GuidanceButton;
