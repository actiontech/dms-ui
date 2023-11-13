import { Space, TooltipProps } from 'antd';
import classNames from 'classnames';
import { PopoverInnerContentStyleWrapper, ToolTipsStyleWrapper } from './style';
import { InfoCircleOutlined } from '@ant-design/icons';

export const tooltipsCommonProps: (
  title: TooltipProps['title'],
  width?: number
) => TooltipProps = (title, width) => {
  const renderTitle = typeof title === 'function' ? title() : title;

  return {
    title: (
      <PopoverInnerContentStyleWrapper width={width}>
        {renderTitle}
      </PopoverInnerContentStyleWrapper>
    ),
    arrow: false,
    overlayInnerStyle: {
      padding: 0,
      borderRadius: '10px'
    }
  };
};

const BasicToolTips: React.FC<
  TooltipProps & {
    prefixIcon?: boolean | React.ReactNode;
    suffixIcon?: boolean | React.ReactNode;
    titleWidth?: number;
  }
> = ({
  className,
  title,
  children,
  suffixIcon,
  prefixIcon,
  titleWidth,
  ...props
}) => {
  const getIcon = (icon?: boolean | React.ReactNode) => {
    if (typeof icon === 'boolean') {
      return icon ? (
        <InfoCircleOutlined className="tooltips-default-icon" />
      ) : null;
    }

    return icon;
  };
  if (!title) {
    return <>{children}</>;
  }
  return (
    <ToolTipsStyleWrapper
      className={classNames(className, 'basic-tooltips-wrapper')}
      {...tooltipsCommonProps(title, titleWidth)}
      {...props}
    >
      <Space>
        {getIcon(prefixIcon)}
        {children}
        {getIcon(suffixIcon)}
      </Space>
    </ToolTipsStyleWrapper>
  );
};

export default BasicToolTips;
