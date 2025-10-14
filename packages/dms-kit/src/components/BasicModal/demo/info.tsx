import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const BasicModalInfoDemo = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <ConfigProvider>
      <Space>
        <BasicButton type="primary" onClick={() => setInfoVisible(true)}>
          信息展示
        </BasicButton>
        <BasicButton onClick={() => setHelpVisible(true)}>
          帮助信息
        </BasicButton>
      </Space>

      <BasicModal
        title={
          <span>
            <InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            系统通知
          </span>
        }
        visible={infoVisible}
        size="small"
        onOk={() => setInfoVisible(false)}
        onCancel={() => setInfoVisible(false)}
        okText="知道了"
        cancelText={null}
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <InfoCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <h3>系统维护通知</h3>
          <p>系统将于今晚 22:00-24:00 进行维护升级，期间可能影响正常使用。</p>
          <p>给您带来的不便，敬请谅解。</p>
        </div>
      </BasicModal>

      <BasicModal
        title="使用帮助"
        visible={helpVisible}
        size="large"
        onOk={() => setHelpVisible(false)}
        onCancel={() => setHelpVisible(false)}
        okText="关闭"
        cancelText={null}
      >
        <div>
          <h3>功能介绍</h3>
          <p>本系统提供了完整的数据库管理功能，包括：</p>
          <ul>
            <li>数据库连接管理</li>
            <li>SQL 查询执行</li>
            <li>数据导入导出</li>
            <li>用户权限管理</li>
            <li>系统配置管理</li>
          </ul>
          
          <h3>使用说明</h3>
          <p>1. 首次使用请先配置数据库连接</p>
          <p>2. 确保有足够的操作权限</p>
          <p>3. 定期备份重要数据</p>
          <p>4. 如遇问题请联系技术支持</p>
        </div>
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalInfoDemo;
