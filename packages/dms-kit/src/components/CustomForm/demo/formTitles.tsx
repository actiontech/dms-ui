import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { FormItemBigTitle, FormItemSubTitle } from '@actiontech/dms-kit';
import { Card, Space, Divider } from 'antd';

const FormTitlesDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>表单标题组件</h3>

        <Card
          title="FormItemBigTitle - 大标题"
          style={{ marginBottom: '16px' }}
        >
          <FormItemBigTitle>用户管理系统</FormItemBigTitle>
          <p style={{ color: '#666', marginTop: '8px' }}>
            用于表单的主要标题，通常放在表单的最顶部
          </p>
        </Card>

        <Card
          title="FormItemSubTitle - 子标题"
          style={{ marginBottom: '16px' }}
        >
          <FormItemSubTitle>基本信息</FormItemSubTitle>
          <p style={{ color: '#666', marginTop: '8px' }}>
            用于表单的分组标题，通常放在相关字段之前
          </p>
        </Card>

        <Card title="标题层级组合" style={{ marginBottom: '16px' }}>
          <FormItemBigTitle>系统配置</FormItemBigTitle>

          <FormItemSubTitle>用户配置</FormItemSubTitle>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            用户相关的配置选项
          </p>

          <FormItemSubTitle>系统配置</FormItemSubTitle>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            系统级别的配置选项
          </p>

          <FormItemSubTitle>安全配置</FormItemSubTitle>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            安全相关的配置选项
          </p>
        </Card>

        <Card title="不同样式的标题" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <FormItemBigTitle>主要功能</FormItemBigTitle>
              <p style={{ color: '#666' }}>这是主要功能的描述</p>
            </div>

            <Divider />

            <div>
              <FormItemSubTitle>辅助功能</FormItemSubTitle>
              <p style={{ color: '#666' }}>这是辅助功能的描述</p>
            </div>

            <Divider />

            <div>
              <FormItemSubTitle>高级设置</FormItemSubTitle>
              <p style={{ color: '#666' }}>这是高级设置的描述</p>
            </div>
          </Space>
        </Card>

        <Card title="使用说明">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>FormItemBigTitle</strong>:
              用于表单的主要标题，通常只有一个
            </li>
            <li>
              <strong>FormItemSubTitle</strong>: 用于表单的分组标题，可以有多个
            </li>
            <li>标题组件主要用于视觉层次，不影响表单逻辑</li>
            <li>可以组合使用创建清晰的表单结构</li>
            <li>支持主题系统的样式配置</li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default FormTitlesDemo;
