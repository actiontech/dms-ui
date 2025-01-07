import { Space } from 'antd';
import classNames from 'classnames';
import { ToolTipStyleWrapper } from './style';
import { InfoCircleOutlined } from '@ant-design/icons';
import { BasicTooltipProps } from './BasicToolTip.types';
import { basicTooltipCommonProps } from './utils';

const BasicToolTip: React.FC<BasicTooltipProps> = ({
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
    <ToolTipStyleWrapper
      className={classNames(className, 'basic-tooltips-wrapper')}
      {...basicTooltipCommonProps(title, titleWidth)}
      {...props}
    >
      <Space>
        {getIcon(prefixIcon)}
        {children}
        {getIcon(suffixIcon)}
      </Space>
    </ToolTipStyleWrapper>
  );
};

export default BasicToolTip;
