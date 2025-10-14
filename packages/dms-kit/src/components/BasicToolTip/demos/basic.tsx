import React from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Button } from 'antd';

const BasicToolTipDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <BasicToolTip title="这是一个基础的文字提示">
          <Button>悬停查看提示</Button>
        </BasicToolTip>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipDemo;
