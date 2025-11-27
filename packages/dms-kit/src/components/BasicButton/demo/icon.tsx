import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@actiontech/icons';

const { Title } = Typography;

/**
 * 图标按钮
 * - 普通图标按钮
 * - 无边框图标按钮（noBorderIcon）
 * - 带文本的图标按钮
 */
const IconButtonDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>普通图标按钮</Title>
          <Space wrap>
            <BasicButton icon={<PlusOutlined color="white" />} type="primary" />
            <BasicButton icon={<SearchOutlined />} />
            <BasicButton icon={<CloseCircleOutlined />} danger />
            <BasicButton icon={<CheckCircleOutlined />} type="dashed" />
          </Space>
        </div>

        <div>
          <Title level={5}>无边框图标按钮</Title>
          <Space wrap>
            <BasicButton noBorderIcon icon={<PlusOutlined />} />
            <BasicButton noBorderIcon icon={<SearchOutlined />} />
            <BasicButton noBorderIcon icon={<CloseCircleOutlined />} />
            <BasicButton noBorderIcon icon={<CheckCircleOutlined />} />
          </Space>
        </div>

        <div>
          <Title level={5}>带文本的图标按钮</Title>
          <Space wrap>
            <BasicButton icon={<PlusOutlined color="white" />} type="primary">
              新建
            </BasicButton>
            <BasicButton icon={<SearchOutlined />}>搜索</BasicButton>
            <BasicButton icon={<CloseCircleOutlined />} danger>
              删除
            </BasicButton>
            <BasicButton icon={<CheckCircleOutlined />}>确认</BasicButton>
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default IconButtonDemo;
