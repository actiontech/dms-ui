import { useState } from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@actiontech/icons';

const { Title } = Typography;

/**
 * 特殊样式类名
 * - switch-btn-default：切换按钮默认状态
 * - switch-btn-active：切换按钮激活状态
 * - btn-icon-no-border：无边框图标按钮
 * - has-icon-primary：图标主题色
 */
const SwitchButtonDemo = () => {
  const [active, setActive] = useState(false);

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>切换状态</Title>
          <Space>
            <BasicButton
              className={active ? 'switch-btn-active' : 'switch-btn-default'}
              onClick={() => setActive(!active)}
            >
              {active ? '已激活' : '未激活'}
            </BasicButton>
            <BasicButton className="switch-btn-default">默认状态</BasicButton>
            <BasicButton className="switch-btn-active">激活状态</BasicButton>
          </Space>
        </div>

        <div>
          <Title level={5}>图标主题色</Title>
          <Space>
            <BasicButton className="has-icon-primary">
              <span className="custom-icon">
                <CheckCircleOutlined color="currentColor" />
              </span>
              <span style={{ marginLeft: 8 }}>带主题色图标</span>
            </BasicButton>
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default SwitchButtonDemo;
