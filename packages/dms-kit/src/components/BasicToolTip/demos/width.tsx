/**
 * 通过 titleWidth 控制提示框宽度
 * - 适应不同长度的内容
 * - 避免文字过度换行
 */
import { BasicToolTip, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button } from 'antd';

const BasicToolTipWidthDemo = () => {
  const longText =
    '这是一个非常长的提示文本，包含了大量的信息内容，需要足够的宽度来显示，避免文字换行影响阅读体验。';

  return (
    <ConfigProvider>
      <Space size="large">
        <BasicToolTip title={longText}>
          <Button>默认宽度</Button>
        </BasicToolTip>

        <BasicToolTip title={longText} titleWidth={300}>
          <Button>宽度 300px</Button>
        </BasicToolTip>

        <BasicToolTip title={longText} titleWidth={500}>
          <Button>宽度 500px</Button>
        </BasicToolTip>
      </Space>
    </ConfigProvider>
  );
};

export default BasicToolTipWidthDemo;
