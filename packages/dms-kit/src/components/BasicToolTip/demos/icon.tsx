import React from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button } from 'antd';
import {
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const BasicToolTipIconDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space size="large">
          <BasicToolTip title="这是一个信息提示" prefixIcon={true}>
            <Button>信息提示</Button>
          </BasicToolTip>

          <BasicToolTip
            title="这是一个警告提示"
            prefixIcon={<ExclamationCircleOutlined />}
          >
            <Button type="primary">警告提示</Button>
          </BasicToolTip>

          <BasicToolTip
            title="这是一个帮助提示"
            prefixIcon={<QuestionCircleOutlined />}
          >
            <Button>帮助提示</Button>
          </BasicToolTip>

          <BasicToolTip
            title="这是一个成功提示"
            prefixIcon={<CheckCircleOutlined />}
          >
            <Button type="primary" ghost>
              成功提示
            </Button>
          </BasicToolTip>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipIconDemo;
