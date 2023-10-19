import { Space, Tooltip } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { IIconTipsLabelProps } from '.';
import { IconTipGray } from '../../Icon';

/**
 * 后续会移除, 由 BasicToolTips 替代
 * @deprecated
 */
const IconTipsLabel: React.FC<IIconTipsLabelProps> = (props) => {
  const { tips, children, iconStyle } = props;

  return (
    <Space>
      {children}
      <Tooltip overlay={tips}>
        <Icon component={IconTipGray} className="icon-tip" style={iconStyle} />
      </Tooltip>
    </Space>
  );
};

export default IconTipsLabel;
