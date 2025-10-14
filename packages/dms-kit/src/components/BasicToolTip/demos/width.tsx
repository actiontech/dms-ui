import React from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button, Typography } from 'antd';

const { Text } = Typography;

const BasicToolTipWidthDemo = () => {
  const shortText = '短文本提示';
  const longText =
    '这是一个非常长的提示文本，包含了大量的信息内容，需要足够的宽度来显示，避免文字换行影响阅读体验。';
  const veryLongText =
    '这是一个超级长的提示文本，包含了极其详细的信息内容，涵盖了多个方面的说明，需要更大的宽度来确保所有内容都能完整显示，同时保持良好的可读性和视觉效果。';

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" size="large">
          <div>
            <Text>默认宽度:</Text>
            <BasicToolTip title={shortText}>
              <Button style={{ marginLeft: '8px' }}>短文本</Button>
            </BasicToolTip>
          </div>

          <div>
            <Text>自定义宽度 300px:</Text>
            <BasicToolTip title={longText} titleWidth={300}>
              <Button style={{ marginLeft: '8px' }}>中等文本</Button>
            </BasicToolTip>
          </div>

          <div>
            <Text>自定义宽度 500px:</Text>
            <BasicToolTip title={veryLongText} titleWidth={500}>
              <Button style={{ marginLeft: '8px' }}>长文本</Button>
            </BasicToolTip>
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipWidthDemo;
