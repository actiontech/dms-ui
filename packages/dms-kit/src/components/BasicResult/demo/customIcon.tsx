import React from 'react';
import { BasicResult, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { SmileOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';

const BasicResultCustomIconDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicResult
          icon={<SmileOutlined style={{ color: '#52c41a', fontSize: 72 }} />}
          title="自定义图标 - 笑脸"
          subTitle="使用自定义的笑脸图标，表达愉悦的心情。"
        />
        
        <BasicResult
          icon={<HeartOutlined style={{ color: '#ff4d4f', fontSize: 72 }} />}
          title="自定义图标 - 爱心"
          subTitle="使用自定义的爱心图标，表达喜爱之情。"
        />
        
        <BasicResult
          icon={<StarOutlined style={{ color: '#faad14', fontSize: 72 }} />}
          title="自定义图标 - 星星"
          subTitle="使用自定义的星星图标，表达优秀之意。"
        />
        
        <BasicResult
          icon={
            <div style={{ 
              width: 72, 
              height: 72, 
              borderRadius: '50%', 
              backgroundColor: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold'
            }}>
              DMS
            </div>
          }
          title="自定义图标 - 文字图标"
          subTitle="使用自定义的文字图标，展示品牌标识。"
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicResultCustomIconDemo;
