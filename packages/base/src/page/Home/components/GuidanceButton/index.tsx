import { GuidanceButtonStyleWrapper } from './style';
import { ButtonProps, ConfigProvider, Space } from 'antd5';

const GuidanceButton = (props: ButtonProps) => {
  const { children, ...otherProps } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            controlHeightSM: 28
          }
        }
      }}
    >
      <GuidanceButtonStyleWrapper
        className="guidance-button-wrapper"
        size="small"
        {...otherProps}
      >
        <Space size={0}>{children}</Space>
      </GuidanceButtonStyleWrapper>
    </ConfigProvider>
  );
};

export default GuidanceButton;
