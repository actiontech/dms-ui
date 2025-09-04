import React, { useState } from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button, Input, Typography } from 'antd';
import {
  InfoCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const BasicToolTipConditionalDemo = () => {
  const [inputValue, setInputValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const getTooltipContent = (value: string) => {
    if (!value) {
      return '请输入内容';
    }
    if (value.length < 3) {
      return '内容太短，至少需要3个字符';
    }
    if (value.length > 20) {
      return '内容太长，最多允许20个字符';
    }
    return '内容长度符合要求';
  };

  const getTooltipIcon = (value: string) => {
    if (!value) {
      return <InfoCircleOutlined />;
    }
    if (value.length < 3 || value.length > 20) {
      return <ExclamationCircleOutlined />;
    }
    return <InfoCircleOutlined />;
  };

  const getTooltipColor = (value: string) => {
    if (!value) {
      return 'default';
    }
    if (value.length < 3 || value.length > 20) {
      return 'error';
    }
    return 'success';
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" size="large">
          <div>
            <Text>输入验证提示:</Text>
            <BasicToolTip
              title={getTooltipContent(inputValue)}
              prefixIcon={getTooltipIcon(inputValue)}
              titleWidth={200}
            >
              <Input
                placeholder="请输入3-20个字符"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ width: 200 }}
              />
            </BasicToolTip>
          </div>

          <div>
            <Text>当前状态: </Text>
            <BasicToolTip
              title={getTooltipContent(inputValue)}
              prefixIcon={getTooltipIcon(inputValue)}
            >
              <span
                style={{
                  color:
                    getTooltipColor(inputValue) === 'error'
                      ? '#ff4d4f'
                      : getTooltipColor(inputValue) === 'success'
                      ? '#52c41a'
                      : '#666'
                }}
              >
                {inputValue || '未输入'}
              </span>
            </BasicToolTip>
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipConditionalDemo;
